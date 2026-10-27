// sync-dreamlove-products.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { findMainCategory } from "@/lib/category-mapping";

const prisma = new PrismaClient();

const API_URL = process.env.DREAMLOVE_API_URL;
const USERNAME = process.env.DREAMLOVE_USERNAME;
const PASSWORD = process.env.DREAMLOVE_PASSWORD;

const PORTUGUESE_LANGUAGE_ID = 55;

if (!API_URL || !USERNAME || !PASSWORD) {
  throw new Error("Variáveis DREAMLOVE_* não definidas.");
}

type DreamloveProduct = {
  id: number;
  sku: string;
  name: string;
  brand?: { id: number; name: string } | null;
  description?: string | null;
  longDescription?: string | null;
  customerPrice?: string | null;
  suggestedPrice?: string | null;
  price: string;
  stock: string;
  categories?: string[];
  images?: {
    image?: {
      relatedVideo?: string | null;
      files?: { url: string; dimensions?: string }[];
    };
  }[];
  barcodes?: { code: string }[];
};

type ProductTranslation = {
  name?: string;
  description?: string;
  longDescription?: string;
};

function createSlug(text?: string | null): string {
  if (!text) return "sem-nome";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function loginDreamlove(): Promise<string> {
  const response = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(`Erro no login: ${response.status}`);
  
  const data = JSON.parse(text);
  if (!data.token) throw new Error("Token não recebido.");
  return data.token;
}

async function getAllTranslations(token: string): Promise<Map<number, ProductTranslation>> {
  const translations = new Map<number, ProductTranslation>();
  let page = 1;

  console.log("📚 A carregar traduções...");

  while (true) {
    const response = await fetch(
      `${API_URL}/product_translations?language=/languages/${PORTUGUESE_LANGUAGE_ID}&page=${page}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );

    if (!response.ok) break;
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;

    for (const translation of data) {
      const productId = Number(translation.product?.split("/").pop() ?? "0");
      if (!productId || isNaN(productId)) continue;

      if (!translations.has(productId)) translations.set(productId, {});
      const entry = translations.get(productId)!;

      if (translation.field === "name") entry.name = translation.value;
      else if (translation.field === "description") entry.description = translation.value;
      else if (translation.field === "longDescription") entry.longDescription = translation.value;
    }
    page++;
  }

  console.log(`📚 Total de traduções: ${translations.size} produtos`);
  return translations;
}

async function getProducts(token: string): Promise<DreamloveProduct[]> {
  const products: DreamloveProduct[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(`${API_URL}/products?page=${page}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Erro na página ${page}: ${response.status}`);
    
    const data = await response.json();
    
    const list: DreamloveProduct[] = Array.isArray(data)
      ? data
      : data["hydra:member"] ?? data.items ?? data.data ?? [];

    if (list.length === 0) break;
    products.push(...list);
    page++;
  }

  return products;
}

async function getValidEAN(ean: string | null, dreamloveId: number) {
  if (!ean) return null;
  const exists = await prisma.product.findUnique({ where: { ean } });
  if (exists && exists.dreamloveId !== dreamloveId) return null;
  return ean;
}

async function syncBrand(brand: DreamloveProduct["brand"]) {
  if (!brand?.id) return null;
  const name = brand.name?.trim() || `Marca ${brand.id}`;
  return prisma.brand.upsert({
    where: { dreamloveId: brand.id },
    update: { name, slug: createSlug(name) },
    create: { dreamloveId: brand.id, name, slug: createSlug(name) },
  });
}

async function syncCategories(productId: string, categories?: string[]) {
  if (!categories?.length) return;
  for (const categoryUrl of categories) {
    const id = Number(categoryUrl.split("/").pop());
    if (isNaN(id)) continue;
    const category = await prisma.category.findUnique({ where: { dreamloveId: id } });
    if (!category) continue;

    await prisma.productCategory.upsert({
      where: { productId_categoryId: { productId, categoryId: category.id } },
      update: {},
      create: { productId, categoryId: category.id },
    });
  }
}

async function processProduct(
  item: DreamloveProduct,
  translations: Map<number, ProductTranslation>,
  supplierId: string
) {
  const translation = translations.get(item.id);
  const finalName = translation?.name || item.name;
  const finalDesc = translation?.longDescription || translation?.description || item.longDescription || item.description;

  const brand = await syncBrand(item.brand);
  const costPrice = parseFloat(item.customerPrice || "0");
  const salePrice = parseFloat(item.suggestedPrice || item.price || "0");
  const stock = parseInt(item.stock || "0", 10);
  
  const ean = await getValidEAN(item.barcodes?.find((b) => b.code.length === 13)?.code ?? null, item.id);

  const exists = await prisma.product.findUnique({ where: { dreamloveId: item.id } });

  // 1. Criar ou atualizar o Produto
  const product = await prisma.product.upsert({
    where: { dreamloveId: item.id },
    update: {
      name: finalName,
      description: finalDesc,
      stock,
      price: salePrice,
      costPrice,
      ean,
      brandId: brand?.id,
      status: stock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
    },
    create: {
      dreamloveId: item.id,
      slug: `${createSlug(finalName)}-${item.id}`,
      sku: item.sku,
      name: finalName,
      description: finalDesc,
      stock,
      price: salePrice,
      costPrice,
      status: stock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
      ean,
      brandId: brand?.id,
    },
  });

  // 2. Categorias
  const categorySlug = findMainCategory(`${finalName} ${finalDesc ?? ""}`);
  if (categorySlug) {
    const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (cat) {
      await prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: cat.id } },
        update: {},
        create: { productId: product.id, categoryId: cat.id },
      });
    }
  }
  await syncCategories(product.id, item.categories);

  // 3. Imagens e Vídeos
  const apiImages = item.images || [];
  if (apiImages.length > 0) {
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    
    const imagesToCreate = [];
    for (const img of apiImages) {
      const file = img.image?.files?.[0];
      if (!file || !file.url) continue;

      let videoUrl = null;
      const rawVideo = img.image?.relatedVideo;
      if (rawVideo) {
        const match = rawVideo.match(/src="([^"]+)"/) || rawVideo.match(/(https?:\/\/[^\s"']+)/);
        if (match) videoUrl = match[1].replace(/&amp;/g, "&");
      }

      let width = null, height = null;
      if (file.dimensions) {
        const parts = file.dimensions.split("x");
        if (parts.length === 2) { width = parseInt(parts[0], 10); height = parseInt(parts[1], 10); }
      }

      imagesToCreate.push({
        productId: product.id,
        url: file.url,
        videoUrl,
        alt: finalName,
        isPrimary: imagesToCreate.length === 0,
        position: imagesToCreate.length,
        width,
        height,
      });
    }

    if (imagesToCreate.length > 0) {
      await prisma.productImage.createMany({ data: imagesToCreate });
    }
  }

  // 4. SupplierProduct
  await prisma.supplierProduct.upsert({
    where: { supplierId_supplierProductId: { supplierId, supplierProductId: String(item.id) } },
    update: {
      productId: product.id,
      supplierSku: item.sku,
      supplierEan: ean,
      supplierPrice: costPrice,
      supplierStock: stock,
      supplierUpdatedAt: new Date(),
      lastSyncAt: new Date(),
      isActive: true,
    },
    create: {
      supplierId,
      productId: product.id,
      supplierProductId: String(item.id),
      supplierSku: item.sku,
      supplierEan: ean,
      supplierPrice: costPrice,
      supplierStock: stock,
      supplierUpdatedAt: new Date(),
      lastSyncAt: new Date(),
      isActive: true,
    },
  });

  return { exists: !!exists };
}

async function sync() {
  console.log(JSON.stringify({ type: "progress", progress: 2, step: "Autenticação..." }));
  const token = await loginDreamlove();

  console.log(JSON.stringify({ type: "progress", progress: 5, step: "Traduções..." }));
  const translations = await getAllTranslations(token);

  console.log(JSON.stringify({ type: "progress", progress: 10, step: "Produtos..." }));
  const products = await getProducts(token);

  const supplier = await prisma.supplier.findFirst({
    where: { OR: [{ slug: "dreamlove" }, { name: { equals: "Dreamlove", mode: "insensitive" } }] },
  });

  if (!supplier) throw new Error("Fornecedor não existe.");

  const syncRecord = await prisma.supplierSync.create({
    data: { supplierId: supplier.id, status: "RUNNING", totalProducts: products.length },
  });

  let imported = 0, updated = 0, failed = 0;

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    
    try {
      const result = await processProduct(item, translations, supplier.id);
      
      if (result.exists) updated++;
      else imported++;

      if (i % 10 === 0) {
        const progress = 10 + Math.round((i / products.length) * 70);
        console.log(JSON.stringify({
          type: "progress",
          progress,
          step: `${i}/${products.length} • ${item.name.substring(0, 30)}`,
        }));
        console.log(JSON.stringify({ type: "count", imported, updated, failed, skipped: 0 }));
      }
    } catch (error) {
      failed++;
      console.error(`❌ Erro produto ${item.id}:`, error);
    }
  }

  await prisma.supplierSync.update({
    where: { id: syncRecord.id },
    data: {
      status: failed > 0 ? "FAILED" : "SUCCESS",
      imported, updated, failed,
      finishedAt: new Date(),
    },
  });

  console.log(JSON.stringify({ type: "progress", progress: 85, step: "Concluído." }));
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());