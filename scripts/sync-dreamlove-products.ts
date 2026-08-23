import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import { findMainCategory } from "@/lib/category-mapping";

const prisma = new PrismaClient();

/*
 * =========================
 * CONFIGURAÇÃO
 * =========================
 */

const API_URL = process.env.DREAMLOVE_API_URL;
const USERNAME = process.env.DREAMLOVE_USERNAME;
const PASSWORD = process.env.DREAMLOVE_PASSWORD;

// ID do idioma português na API Dreamlove
const PORTUGUESE_LANGUAGE_ID = 55;

if (!API_URL || !USERNAME || !PASSWORD) {
  throw new Error("Variáveis DREAMLOVE_* não definidas.");
}

type DreamloveProduct = {
  id: number;
  sku: string;
  name: string;

  brand?: {
    id: number;
    name: string;
  } | null;

  description?: string | null;
  longDescription?: string | null;

  customerPrice?: string | null;
  price: string;
  stock: string;

  categories?: string[];

  images?: {
    image?: {
      files?: {
        url: string;
      }[];
    };
  }[];

  barcodes?: {
    code: string;
  }[];
};

type ProductTranslation = {
  name?: string;
  description?: string;
  longDescription?: string;
};

/*
 * =========================
 * HELPERS
 * =========================
 */

function createSlug(text?: string | null): string {
  if (!text) {
    return "sem-nome";
  }

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getImage(product: DreamloveProduct): string | null {
  return (
    product.images?.find((img) => img.image?.files?.length)?.image?.files?.[0]
      ?.url ?? null
  );
}

/*
 * =========================
 * LOGIN DREAMLOVE
 * =========================
 */

async function loginDreamlove(): Promise<string> {
  const response = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Erro no login Dreamlove: ${response.status} - ${text.substring(0, 300)}`
    );
  }

  let data: { token?: string };

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Dreamlove devolveu uma resposta que não é JSON no login.");
  }

  if (!data.token) {
    throw new Error("Token Dreamlove não recebido.");
  }

  return data.token;
}

/*
 * =========================
 * BUSCAR TODAS AS TRADUÇÕES EM PORTUGUÊS DE UMA VEZ
 * =========================
 */

async function getAllTranslations(
  token: string
): Promise<Map<number, ProductTranslation>> {
  const translations = new Map<number, ProductTranslation>();
  let page = 1;

  console.log("📚 A carregar traduções em português...");

  while (true) {
    const response = await fetch(
      `${API_URL}/product_translations?language=/languages/${PORTUGUESE_LANGUAGE_ID}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      break;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    for (const translation of data) {
      const productId = Number(translation.product?.split("/").pop() ?? "0");

      if (!productId || isNaN(productId)) {
        continue;
      }

      if (!translations.has(productId)) {
        translations.set(productId, {});
      }

      const entry = translations.get(productId)!;

      if (translation.field === "name") {
        entry.name = translation.value;
      } else if (translation.field === "description") {
        entry.description = translation.value;
      } else if (translation.field === "longDescription") {
        entry.longDescription = translation.value;
      }
    }

    page++;

    if (page % 5 === 0) {
      console.log(`📚 Traduções: página ${page - 1} carregada (${translations.size} produtos)`);
    }
  }

  console.log(`📚 Total de traduções carregadas: ${translations.size} produtos`);
  return translations;
}

/*
 * =========================
 * BUSCAR PRODUTOS
 * =========================
 */

async function getProducts(token: string): Promise<DreamloveProduct[]> {
  const products: DreamloveProduct[] = [];

  let page = 1;

  while (true) {
    console.log(`📦 Buscar produtos - página ${page}`);

    const response = await fetch(
      `${API_URL}/products?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Erro ao obter produtos página ${page}: ${response.status}`);
    }

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Dreamlove devolveu resposta não JSON na página ${page}.`);
    }

    let list: DreamloveProduct[] = [];

    if (Array.isArray(data)) {
      list = data as DreamloveProduct[];
    } else if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray((data as { items: unknown[] }).items)
    ) {
      list = (data as { items: DreamloveProduct[] }).items;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "products" in data &&
      Array.isArray((data as { products: unknown[] }).products)
    ) {
      list = (data as { products: DreamloveProduct[] }).products;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray((data as { data: unknown[] }).data)
    ) {
      list = (data as { data: DreamloveProduct[] }).data;
    }

    if (list.length === 0) {
      break;
    }

    products.push(...list);
    console.log(`Página ${page}: ${list.length} produtos`);
    page++;
  }

  return products;
}

/*
 * =========================
 * VALIDAR EAN
 * =========================
 */

async function getValidEAN(ean: string | null, dreamloveId: number) {
  if (!ean) {
    return null;
  }

  const exists = await prisma.product.findUnique({
    where: { ean },
  });

  if (exists && exists.dreamloveId !== dreamloveId) {
    return null;
  }

  return ean;
}

/*
 * =========================
 * SINCRONIZAR MARCA
 * =========================
 */

async function syncBrand(brand: DreamloveProduct["brand"]) {
  if (!brand?.id) {
    return null;
  }

  const name = brand.name?.trim() || `Marca ${brand.id}`;

  return prisma.brand.upsert({
    where: { dreamloveId: brand.id },
    update: {
      name,
      slug: createSlug(name),
    },
    create: {
      dreamloveId: brand.id,
      name,
      slug: createSlug(name),
    },
  });
}

/*
 * =========================
 * ASSOCIAR CATEGORIA PRINCIPAL
 * =========================
 */

async function syncMainCategory(
  productId: string,
  productName: string,
  productDescription: string | null | undefined
) {
  const text = `${productName} ${productDescription ?? ""}`;
  const categorySlug = findMainCategory(text);

  if (!categorySlug) {
    return null;
  }

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    return null;
  }

  await prisma.productCategory.upsert({
    where: {
      productId_categoryId: {
        productId,
        categoryId: category.id,
      },
    },
    update: {},
    create: {
      productId,
      categoryId: category.id,
    },
  });

  return category;
}

/*
 * =========================
 * SINCRONIZAR CATEGORIAS DO FORNECEDOR
 * =========================
 */

async function syncDreamloveCategories(
  productId: string,
  categories?: string[]
) {
  if (!categories?.length) {
    return;
  }

  for (const categoryUrl of categories) {
    const id = Number(categoryUrl.split("/").pop());

    if (isNaN(id)) {
      continue;
    }

    const category = await prisma.category.findUnique({
      where: { dreamloveId: id },
    });

    if (!category) {
      continue;
    }

    await prisma.productCategory.upsert({
      where: {
        productId_categoryId: {
          productId,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        productId,
        categoryId: category.id,
      },
    });
  }
}

/*
 * =========================
 * SINCRONIZAÇÃO PRINCIPAL
 * =========================
 */

async function sync() {
  console.log(
    JSON.stringify({
      type: "progress",
      progress: 2,
      step: "Autenticação Dreamlove...",
    })
  );

  const token = await loginDreamlove();

  console.log(
    JSON.stringify({
      type: "progress",
      progress: 5,
      step: "A carregar traduções em português...",
    })
  );

  // Carrega todas as traduções de uma vez (muito mais rápido)
  const translations = await getAllTranslations(token);

  console.log(
    JSON.stringify({
      type: "progress",
      progress: 10,
      step: "A obter produtos...",
    })
  );

  const products = await getProducts(token);

  console.log(
    JSON.stringify({
      type: "log",
      message: `Encontrados ${products.length} produtos.`,
    })
  );

  const supplier = await prisma.supplier.findFirst({
    where: {
      OR: [
        { slug: "dreamlove" },
        { name: { equals: "Dreamlove", mode: "insensitive" } },
      ],
    },
  });

  if (!supplier) {
    throw new Error("Fornecedor Dreamlove não existe na BD.");
  }

  const syncRecord = await prisma.supplierSync.create({
    data: {
      supplierId: supplier.id,
      status: "RUNNING",
      totalProducts: products.length,
    },
  });

  let imported = 0;
  let updated = 0;
  let failed = 0;
  const skipped = 0;

  for (const item of products) {
    try {
      const exists = await prisma.product.findUnique({
        where: { dreamloveId: item.id },
      });

      /*
       * USAR TRADUÇÕES DO MAPA (sem fazer pedidos extra)
       */
      const translation = translations.get(item.id);

      const finalName = translation?.name || item.name;
      const finalDescription =
        translation?.longDescription ||
        translation?.description ||
        item.longDescription ||
        item.description;

      if (translation?.name) {
        console.log(`🇵🇹 ${finalName}`);
      }

      // Limpar duplicados antes do upsert
      const existingProducts = await prisma.product.findMany({
        where: { dreamloveId: item.id },
      });

      if (existingProducts.length > 1) {
        for (let i = 1; i < existingProducts.length; i++) {
          await prisma.product.delete({
            where: { id: existingProducts[i].id },
          });
        }
        console.log(`🧹 Duplicados removidos para dreamloveId ${item.id}`);
      }

      const brand = await syncBrand(item.brand);
      const image = getImage(item);

      const rawEan =
        item.barcodes?.find((b) => b.code.length === 13)?.code ?? null;
      const ean = await getValidEAN(rawEan, item.id);

      const price = Number(item.customerPrice ?? item.price);
      const stock = Number(item.stock);

      /*
       * PRODUTO
       */
      const product = await prisma.product.upsert({
        where: { dreamloveId: item.id },
        update: {
          name: finalName,
          description: finalDescription,
          stock,
          price,
          ean,
          brandId: brand?.id,
          status: "ACTIVE",
          images: image
            ? {
                deleteMany: {},
                create: [{ url: image, isPrimary: true }],
              }
            : undefined,
        },
        create: {
          dreamloveId: item.id,
          slug: createSlug(`${item.sku}-${item.id}`),
          sku: item.sku,
          name: finalName,
          description: finalDescription,
          stock,
          price,
          status: "ACTIVE",
          ean,
          brandId: brand?.id,
          images: image
            ? { create: [{ url: image, isPrimary: true }] }
            : undefined,
        },
      });

      /*
       * CATEGORIA PRINCIPAL
       */
      const mainCategory = await syncMainCategory(
        product.id,
        finalName,
        finalDescription
      );

      if (mainCategory) {
        console.log(`📂 ${finalName} → ${mainCategory.name}`);
      }

      /*
       * CATEGORIAS DO FORNECEDOR
       */
      await syncDreamloveCategories(product.id, item.categories);

      /*
       * RELAÇÃO SUPPLIER PRODUCT
       */
      await prisma.supplierProduct.upsert({
        where: {
          supplierId_supplierProductId: {
            supplierId: supplier.id,
            supplierProductId: String(item.id),
          },
        },
        update: {
          productId: product.id,
          supplierSku: item.sku,
          supplierEan: ean,
          supplierPrice: price,
          supplierStock: stock,
          supplierUpdatedAt: new Date(),
          lastSyncAt: new Date(),
          isActive: true,
          rawData: JSON.parse(JSON.stringify(item)),
        },
        create: {
          supplierId: supplier.id,
          productId: product.id,
          supplierProductId: String(item.id),
          supplierSku: item.sku,
          supplierEan: ean,
          supplierPrice: price,
          supplierStock: stock,
          supplierUpdatedAt: new Date(),
          lastSyncAt: new Date(),
          isActive: true,
          rawData: JSON.parse(JSON.stringify(item)),
        },
      });

      if (exists) {
        updated++;
      } else {
        imported++;
      }

      const processed = imported + updated + failed + skipped;
      const progress = 10 + Math.round((processed / products.length) * 35);

      console.log(
        JSON.stringify({
          type: "progress",
          progress,
          step: `${processed}/${products.length} • ${finalName}`,
        })
      );

      console.log(
        JSON.stringify({
          type: "count",
          imported,
          updated,
          failed,
          skipped,
        })
      );

      await prisma.supplierLog.create({
        data: {
          syncId: syncRecord.id,
          level: "INFO",
          code: exists ? "PRODUCT_UPDATED" : "PRODUCT_IMPORTED",
          message: exists
            ? `Produto atualizado: ${finalName}`
            : `Produto importado: ${finalName}`,
          productSku: item.sku,
          productId: product.id,
        },
      });
    } catch (error) {
      failed++;

      const message = error instanceof Error ? error.message : String(error);

      console.error(`❌ Erro produto ${item.sku}:`, message);

      await prisma.supplierLog.create({
        data: {
          syncId: syncRecord.id,
          level: "ERROR",
          code: "PRODUCT_SYNC_ERROR",
          message,
          productSku: item.sku,
        },
      });
    }
  }

  /*
   * FINALIZAR
   */
  await prisma.supplierSync.update({
    where: { id: syncRecord.id },
    data: {
      status: failed > 0 ? "FAILED" : "SUCCESS",
      totalProducts: products.length,
      imported,
      updated,
      skipped,
      failed,
      finishedAt: new Date(),
      message:
        failed > 0
          ? `Sincronização terminada com ${failed} erro(s).`
          : "Sincronização concluída com sucesso.",
    },
  });

  console.log(
    JSON.stringify({
      type: "progress",
      progress: 85,
      step: "Produtos sincronizados.",
    })
  );
}

sync()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });