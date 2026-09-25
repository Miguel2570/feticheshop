// scripts/sync-no-variants.ts
//
// Sincroniza APENAS produtos que NÃO TÊM variantes.
// Ignora produtos com canonicalUrl (órfãos de merge).
// Ignora produtos ARCHIVED.
//
// Uso:
//   npx tsx scripts/sync-no-variants.ts              # dry-run
//   npx tsx scripts/sync-no-variants.ts --apply      # apply
//
// ⚠️  Este script demora 1-3 horas.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";

import { findMainCategory } from "@/lib/category-mapping";
import { parseProductName, getProductGroupKey } from "@/utils/product-grouping";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

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
  price: string;
  stock: string;
  categories?: string[];
  images?: { image?: { files?: { url: string }[] } }[];
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

function getImages(product: DreamloveProduct): string[] {
  return (
    product.images
      ?.flatMap((img) => img.image?.files ?? [])
      ?.map((file) => file.url)
      ?.filter((url): url is string => Boolean(url)) ?? []
  );
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

  if (!data.token) throw new Error("Token Dreamlove não recebido.");
  return data.token;
}

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

    if (!response.ok) break;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;

    for (const translation of data) {
      const productId = Number(translation.product?.split("/").pop() ?? "0");
      if (!productId || isNaN(productId)) continue;

      if (!translations.has(productId)) translations.set(productId, {});
      const entry = translations.get(productId)!;

      if (translation.field === "name") entry.name = translation.value;
      else if (translation.field === "description")
        entry.description = translation.value;
      else if (translation.field === "longDescription")
        entry.longDescription = translation.value;
    }

    page++;
    if (page % 5 === 0) {
      console.log(
        `📚 Traduções: página ${page - 1} (${translations.size} produtos)`
      );
    }
  }

  console.log(`📚 Total: ${translations.size} traduções`);
  return translations;
}

async function getProducts(token: string): Promise<DreamloveProduct[]> {
  const products: DreamloveProduct[] = [];
  let page = 1;

  while (true) {
    console.log(`📦 Buscar produtos - página ${page}`);

    const response = await fetch(`${API_URL}/products?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(
        `Erro ao obter produtos página ${page}: ${response.status}`
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Dreamlove devolveu resposta não JSON na página ${page}.`);
    }

    let list: DreamloveProduct[] = [];
    if (Array.isArray(data)) list = data as DreamloveProduct[];
    else if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray((data as { items: unknown[] }).items)
    )
      list = (data as { items: DreamloveProduct[] }).items;
    else if (
      typeof data === "object" &&
      data !== null &&
      "products" in data &&
      Array.isArray((data as { products: unknown[] }).products)
    )
      list = (data as { products: DreamloveProduct[] }).products;
    else if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray((data as { data: unknown[] }).data)
    )
      list = (data as { data: DreamloveProduct[] }).data;

    if (list.length === 0) break;

    products.push(...list);
    console.log(`Página ${page}: ${list.length} produtos`);
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

async function syncMainCategory(
  productId: string,
  productName: string,
  productDescription: string | null | undefined
) {
  const text = `${productName} ${productDescription ?? ""}`;
  const categorySlug = findMainCategory(text);
  if (!categorySlug) return null;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) return null;

  await prisma.productCategory.upsert({
    where: {
      productId_categoryId: { productId, categoryId: category.id },
    },
    update: {},
    create: { productId, categoryId: category.id },
  });

  return category;
}

async function syncDreamloveCategories(
  productId: string,
  categories?: string[]
) {
  if (!categories?.length) return;

  for (const categoryUrl of categories) {
    const id = Number(categoryUrl.split("/").pop());
    if (isNaN(id)) continue;

    const category = await prisma.category.findUnique({
      where: { dreamloveId: id },
    });
    if (!category) continue;

    await prisma.productCategory.upsert({
      where: {
        productId_categoryId: { productId, categoryId: category.id },
      },
      update: {},
      create: { productId, categoryId: category.id },
    });
  }
}

/**
 * ✅ CORRIGIDO
 * Procura primeiro por `value` exato. Se não encontrar, procura por `slug`.
 * Isto evita colisões quando o value é diferente mas o slug é igual.
 */
async function resolveAttributeValueId(
  attributeSlug: string,
  value: string
): Promise<string | null> {
  const attribute = await prisma.attribute.findUnique({
    where: { slug: attributeSlug },
  });
  if (!attribute) return null;

  // 1. Procurar por value exato
  let attrValue = await prisma.attributeValue.findFirst({
    where: { attributeId: attribute.id, value },
  });

  // 2. Se não encontrou, procurar por slug
  if (!attrValue) {
    const slug = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    attrValue = await prisma.attributeValue.findFirst({
      where: { attributeId: attribute.id, slug },
    });

    if (attrValue) {
      console.log(
        `   ℹ️  Reutilizado: ${attributeSlug}="${attrValue.value}" (pedido: "${value}")`
      );
      return attrValue.id;
    }
  }

  // 3. Se ainda não existe, criar
  if (!attrValue) {
    const slug = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    attrValue = await prisma.attributeValue.create({
      data: { attributeId: attribute.id, value, slug },
    });
    console.log(`   ➕ AttributeValue criado: ${attributeSlug}=${value}`);
  }

  return attrValue.id;
}

/**
 * Sincroniza um "grupo" de produtos.
 * ⚠️  NÃO muda status para ACTIVE — mantém HIDDEN (o admin decide).
 */
async function syncProductGroup(
  groupItems: DreamloveProduct[],
  translations: Map<number, ProductTranslation>,
  supplierId: string
) {
  const parentItem =
    groupItems.find((it) => Number(it.stock) > 0) ?? groupItems[0];

  const parentTranslation = translations.get(parentItem.id);
  const parentRawName = parentTranslation?.name || parentItem.name;
  const parentParsed = parseProductName(parentRawName);

  const parentDisplayName = parentParsed.color
    ? `${parentParsed.base} - ${parentParsed.color}`
    : parentParsed.base;

  const parentDescription =
    parentTranslation?.longDescription ||
    parentTranslation?.description ||
    parentItem.longDescription ||
    parentItem.description;

  const parentImages = getImages(parentItem);
  const parentBrand = await syncBrand(parentItem.brand);

  const parentCostPrice = Number(parentItem.price);
  const parentSalePrice = Number(parentItem.customerPrice ?? parentItem.price);
  const parentStock = Number(parentItem.stock);

  const parentRawEan =
    parentItem.barcodes?.find((b) => b.code.length === 13)?.code ?? null;
  const parentEan = await getValidEAN(parentRawEan, parentItem.id);

  // ── Upsert do pai — MANTÉM o status atual
  const parentProduct = await prisma.product.upsert({
    where: { dreamloveId: parentItem.id },
    update: {
      name: parentDisplayName,
      description: parentDescription,
      stock: parentStock,
      price: parentSalePrice,
      costPrice: parentCostPrice,
      ean: parentEan,
      brandId: parentBrand?.id,
      // ✅ NÃO alterar status — mantém o que já está
      images:
        parentImages.length > 0
          ? {
              deleteMany: {},
              create: parentImages.map((url, index) => ({
                url,
                isPrimary: index === 0,
                position: index,
              })),
            }
          : undefined,
    },
    create: {
      dreamloveId: parentItem.id,
      slug: createSlug(parentDisplayName),
      sku: parentItem.sku,
      name: parentDisplayName,
      description: parentDescription,
      stock: parentStock,
      price: parentSalePrice,
      costPrice: parentCostPrice,
      status: "HIDDEN",
      ean: parentEan,
      brandId: parentBrand?.id,
      images:
        parentImages.length > 0
          ? {
              create: parentImages.map((url, index) => ({
                url,
                isPrimary: index === 0,
                position: index,
              })),
            }
          : undefined,
    },
  });

  // Categorias
  const mainCategory = await syncMainCategory(
    parentProduct.id,
    parentDisplayName,
    parentDescription
  );

  if (mainCategory) {
    console.log(`📂 ${parentDisplayName} → ${mainCategory.name}`);
  }

  await syncDreamloveCategories(parentProduct.id, parentItem.categories);

  // Apagar variantes antigas e recriar
  await prisma.productVariant.deleteMany({
    where: { productId: parentProduct.id },
  });

  for (const groupItem of groupItems) {
    const itemTranslation = translations.get(groupItem.id);
    const itemRawName = itemTranslation?.name || groupItem.name;
    const itemParsed = parseProductName(itemRawName);

    const variantSize = itemParsed.size || null;
    const variantColor = itemParsed.color || null;
    const variantVolume = itemParsed.volume || null;

    const nameParts: string[] = [];
    if (variantColor) nameParts.push(variantColor);
    if (variantSize) nameParts.push(variantSize);
    if (variantVolume) nameParts.push(variantVolume);
    const variantName = nameParts.join(" / ") || "Único";

    const itemPrice = Number(groupItem.customerPrice ?? groupItem.price);
    const itemCostPrice = Number(groupItem.price);
    const itemStock = Number(groupItem.stock);

    const itemRawEan =
      groupItem.barcodes?.find((b) => b.code.length === 13)?.code ?? null;
    const itemEan = await getValidEAN(itemRawEan, groupItem.id);

    const attrValueIds: string[] = [];

    if (variantColor) {
      const id = await resolveAttributeValueId("cor", variantColor);
      if (id) attrValueIds.push(id);
    }
    if (variantSize) {
      const id = await resolveAttributeValueId("tamanho", variantSize);
      if (id) attrValueIds.push(id);
    }
    if (variantVolume) {
      const id = await resolveAttributeValueId("volume", variantVolume);
      if (id) attrValueIds.push(id);
    }

    try {
      await prisma.productVariant.create({
        data: {
          productId: parentProduct.id,
          name: variantName,
          sku: groupItem.sku,
          ean: itemEan,
          price: itemPrice,
          costPrice: itemCostPrice,
          comparePrice:
            groupItem.customerPrice && Number(groupItem.price) !== itemPrice
              ? Number(groupItem.price)
              : null,
          stock: itemStock,
          isActive: true,
          attributeValues: {
            create: attrValueIds.map((id) => ({
              attributeValue: { connect: { id } },
            })),
          },
        },
      });
    } catch (err) {
      // Se falhar por EAN duplicado, tenta sem EAN
      if (
        err instanceof Error &&
        err.message.includes("Unique constraint")
      ) {
        console.warn(
          `   ⚠️  Conflito EAN para ${groupItem.sku}, a criar sem EAN`
        );
        await prisma.productVariant.create({
          data: {
            productId: parentProduct.id,
            name: variantName,
            sku: groupItem.sku,
            ean: null,
            price: itemPrice,
            costPrice: itemCostPrice,
            comparePrice:
              groupItem.customerPrice && Number(groupItem.price) !== itemPrice
                ? Number(groupItem.price)
                : null,
            stock: itemStock,
            isActive: true,
            attributeValues: {
              create: attrValueIds.map((id) => ({
                attributeValue: { connect: { id } },
              })),
            },
          },
        });
      } else {
        throw err;
      }
    }

    // ✅ Arquivar os filhos (mas SÓ os que não forem órfãos de merge)
    if (groupItem.id !== parentItem.id) {
      const child = await prisma.product.findUnique({
        where: { dreamloveId: groupItem.id },
        select: { status: true, canonicalUrl: true },
      });

      if (child && !child.canonicalUrl) {
        await prisma.product.updateMany({
          where: { dreamloveId: groupItem.id },
          data: { status: "ARCHIVED" },
        });
      }
    }
  }

  // SupplierProduct
  await prisma.supplierProduct.upsert({
    where: {
      supplierId_supplierProductId: {
        supplierId,
        supplierProductId: String(parentItem.id),
      },
    },
    update: {
      productId: parentProduct.id,
      supplierSku: parentItem.sku,
      supplierEan: parentEan,
      supplierPrice: parentCostPrice,
      supplierComparePrice: parentSalePrice,
      supplierStock: parentStock,
      supplierUpdatedAt: new Date(),
      lastSyncAt: new Date(),
      isActive: true,
      rawData: JSON.parse(JSON.stringify(parentItem)),
    },
    create: {
      supplierId,
      productId: parentProduct.id,
      supplierProductId: String(parentItem.id),
      supplierSku: parentItem.sku,
      supplierEan: parentEan,
      supplierPrice: parentCostPrice,
      supplierComparePrice: parentSalePrice,
      supplierStock: parentStock,
      supplierUpdatedAt: new Date(),
      lastSyncAt: new Date(),
      isActive: true,
      rawData: JSON.parse(JSON.stringify(parentItem)),
    },
  });

  return { exists: true, variantsCount: groupItems.length };
}

async function main() {
  console.log(
    `\n🔄 Sync de produtos SEM variantes — ${APPLY ? "⚠️  APPLY" : "DRY-RUN"}\n`
  );

  const needsSync = await prisma.product.findMany({
    where: {
      variants: { none: {} },
      canonicalUrl: null,
      status: { not: "ARCHIVED" },
      dreamloveId: { not: null },
      deletedAt: null,
    },
    select: { id: true, name: true, dreamloveId: true },
  });

  const dreamloveIdsToProcess = new Set(
    needsSync.map((p) => p.dreamloveId!).filter(Boolean)
  );

  console.log(`📊 Produtos sem variantes: ${needsSync.length}`);
  console.log(`📊 dreamloveIds únicos:    ${dreamloveIdsToProcess.size}\n`);

  if (needsSync.length === 0) {
    console.log("✅ Nada a fazer.\n");
    return;
  }

  if (!APPLY) {
    console.log("✅ DRY-RUN. Nada foi alterado.");
    console.log("   Para aplicar: npx tsx scripts/sync-no-variants.ts --apply\n");
    console.log("📋 Primeiros 20:");
    for (const p of needsSync.slice(0, 20)) {
      console.log(`  • [${p.dreamloveId}] ${p.name}`);
    }
    return;
  }

  console.log("⚠️  A APLICAR...\n");

  const token = await loginDreamlove();
  console.log("✅ Login OK");

  const translations = await getAllTranslations(token);
  const allProducts = await getProducts(token);

  console.log(`\n📦 Total de produtos na Dreamlove: ${allProducts.length}`);

  const filtered = allProducts.filter((p) => dreamloveIdsToProcess.has(p.id));
  console.log(`📦 Produtos a processar (filtrados): ${filtered.length}\n`);

  const groups = new Map<string, DreamloveProduct[]>();
  for (const item of filtered) {
    const translation = translations.get(item.id);
    const finalName = translation?.name || item.name;
    const groupKey = getProductGroupKey(finalName);

    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)!.push(item);
  }

  console.log(`📦 ${filtered.length} produtos → ${groups.size} grupos\n`);

  const supplier = await prisma.supplier.findFirst({
    where: {
      OR: [
        { slug: "dreamlove" },
        { name: { equals: "Dreamlove", mode: "insensitive" } },
      ],
    },
  });

  if (!supplier) throw new Error("Fornecedor Dreamlove não existe na BD.");

  const syncRecord = await prisma.supplierSync.create({
    data: {
      supplierId: supplier.id,
      status: "RUNNING",
      totalProducts: filtered.length,
    },
  });

  let imported = 0;
  let updated = 0;
  let failed = 0;
  let processed = 0;

  const log: Array<{ groupKey: string; variantsCount: number; status: string }> = [];

  for (const [groupKey, groupItems] of groups) {
    try {
      const result = await syncProductGroup(
        groupItems,
        translations,
        supplier.id
      );

      if (result.exists) updated++;
      else imported++;

      processed++;

      if (processed % 10 === 0) {
        console.log(
          `[${processed}/${groups.size}] ${groupKey} (${result.variantsCount} variantes) | imported=${imported} updated=${updated} failed=${failed}`
        );
      }

      log.push({
        groupKey,
        variantsCount: result.variantsCount,
        status: "OK",
      });

      await prisma.supplierLog.create({
        data: {
          syncId: syncRecord.id,
          level: "INFO",
          code: "PRODUCT_UPDATED",
          message: `${groupKey} (${result.variantsCount} variantes)`,
        },
      });
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Erro grupo ${groupKey}:`, message);

      log.push({ groupKey, variantsCount: 0, status: "ERROR" });

      await prisma.supplierLog.create({
        data: {
          syncId: syncRecord.id,
          level: "ERROR",
          code: "PRODUCT_SYNC_ERROR",
          message,
        },
      });
    }
  }

  await prisma.supplierSync.update({
    where: { id: syncRecord.id },
    data: {
      status: failed > 0 ? "FAILED" : "SUCCESS",
      totalProducts: filtered.length,
      imported,
      updated,
      failed,
      finishedAt: new Date(),
    },
  });

  const logFile = `scripts/sync-no-variants-log-${Date.now()}.json`;
  writeFileSync(logFile, JSON.stringify(log, null, 2), "utf-8");

  console.log(`\n✅ Concluído.`);
  console.log(`   Grupos processados: ${groups.size}`);
  console.log(`   Imported:           ${imported}`);
  console.log(`   Updated:            ${updated}`);
  console.log(`   Failed:             ${failed}`);
  console.log(`   Log:                ${logFile}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });