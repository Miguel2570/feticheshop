"use server";

import { syncEmitter } from "@/lib/sync-emitter";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;
const PORTUGUESE_LANGUAGE_ID = 55;

type DreamloveCategory = {
  id: number;
  name: string;
  parent?: { id: number } | null;
  image?: { files?: { url: string }[] } | null;
};

type DreamloveBrand = {
  id: number;
  name: string;
  image?: { files?: { url: string }[] } | null;
};

type DreamloveProduct = {
  id: number;
  sku: string;
  name: string;
  customerPrice?: string | null;
  price: string;
  stock: string;
  images?: { image?: { files?: { url: string }[] } }[];
  barcodes?: { code: string }[];
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  const data = await response.json();
  if (!data.token) throw new Error("Token Dreamlove não recebido");
  return data.token;
}

function emitProgress(progress: number, step: string) {
  syncEmitter.emit("message", { type: "progress", progress, step });
}

function emitLog(message: string) {
  syncEmitter.emit("message", { type: "log", message });
}

async function syncMainCategories() {
  const mainCategories = [
    { name: "Vibradores", slug: "vibradores", isFeatured: true },
    { name: "Para Ele", slug: "para-ele", isFeatured: false },
    { name: "Para Ela", slug: "para-ela", isFeatured: false },
    { name: "Acessórios", slug: "acessorios", isFeatured: false },
    { name: "BDSM", slug: "bdsm", isFeatured: false },
    { name: "Roupa", slug: "roupa", isFeatured: false },
    { name: "Essenciais", slug: "essenciais", isFeatured: false },
    { name: "CBD", slug: "cbd", isFeatured: false },
  ];

  for (const cat of mainCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, isActive: true, isFeatured: cat.isFeatured },
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: true,
        isFeatured: cat.isFeatured,
        sortOrder: mainCategories.indexOf(cat),
      },
    });
  }
}

async function syncDreamloveCategories(token: string) {
  const categories: DreamloveCategory[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${API_URL}/product_categories?page=${page}&language=${PORTUGUESE_LANGUAGE_ID}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    if (!response.ok) break;
    const data = await response.json();
    const items = (data.member ?? data["hydra:member"] ?? data.items ?? data.data ?? data) as DreamloveCategory[];
    if (!Array.isArray(items) || items.length === 0) break;
    categories.push(...items);
    page++;
  }

  for (const category of categories) {
    let parentId: string | null = null;
    if (category.parent) {
      const parent = await prisma.category.findUnique({ where: { dreamloveId: category.parent.id } });
      if (parent) parentId = parent.id;
    }

    await prisma.category.upsert({
      where: { dreamloveId: category.id },
      update: {
        name: category.name,
        parentId,
        image: category.image?.files?.[0]?.url ?? null,
      },
      create: {
        dreamloveId: category.id,
        name: category.name,
        slug: `${createSlug(category.name)}-${category.id}`,
        parentId,
        image: category.image?.files?.[0]?.url ?? null,
      },
    });
  }
}

async function syncBrands(token: string) {
  const brands: DreamloveBrand[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${API_URL}/brands?page=${page}&language=${PORTUGUESE_LANGUAGE_ID}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    if (!response.ok) break;
    const data = await response.json();
    const items = (data.member ?? data["hydra:member"] ?? data.items ?? data.data ?? data) as DreamloveBrand[];
    if (!Array.isArray(items) || items.length === 0) break;
    brands.push(...items);
    page++;
  }

  for (const brand of brands) {
    const name = brand.name?.trim() || `Marca ${brand.id}`;
    await prisma.brand.upsert({
      where: { dreamloveId: brand.id },
      update: { name, slug: createSlug(name) },
      create: {
        dreamloveId: brand.id,
        name,
        slug: createSlug(`${name}-${brand.id}`),
        logo: brand.image?.files?.[0]?.url ?? null,
      },
    });
  }
}

async function syncProducts(token: string) {
  const products: DreamloveProduct[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(
      `${API_URL}/products?page=${page}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    if (!response.ok) break;
    const data = await response.json();
    const items = (Array.isArray(data) ? data : data.items ?? data.products ?? data.data ?? []) as DreamloveProduct[];
    if (items.length === 0) break;
    products.push(...items);
    page++;
  }

  const supplier = await prisma.supplier.findFirst({ where: { slug: "dreamlove" } });
  if (!supplier) throw new Error("Fornecedor Dreamlove não existe");

  let imported = 0;
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const price = Number(item.customerPrice ?? item.price);
    const stock = Number(item.stock);
    const image = item.images?.find((img) => img.image?.files?.length)?.image?.files?.[0]?.url ?? null;
    const ean = item.barcodes?.find((b) => b.code.length === 13)?.code ?? null;

    const exists = await prisma.product.findUnique({ where: { dreamloveId: item.id } });

    const product = await prisma.product.upsert({
      where: { dreamloveId: item.id },
      update: { name: item.name, stock, price, status: "ACTIVE", ean },
      create: {
        dreamloveId: item.id,
        slug: createSlug(`${item.sku}-${item.id}`),
        sku: item.sku,
        name: item.name,
        stock,
        price,
        status: "ACTIVE",
        ean,
        images: image ? { create: [{ url: image, isPrimary: true }] } : undefined,
      },
    });

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
        supplierPrice: price,
        supplierStock: stock,
        lastSyncAt: new Date(),
      },
      create: {
        supplierId: supplier.id,
        productId: product.id,
        supplierProductId: String(item.id),
        supplierSku: item.sku,
        supplierPrice: price,
        supplierStock: stock,
        lastSyncAt: new Date(),
      },
    });

    if (exists) updated++;
    else imported++;

    const progress = 60 + Math.round(((i + 1) / products.length) * 40);
    emitProgress(progress, `${i + 1}/${products.length} • ${item.name}`);
  }

  emitLog(`Importados: ${imported} | Atualizados: ${updated}`);
}

export async function syncDreamlove(): Promise<void> {
  emitProgress(0, "A iniciar sincronização...");

  try {
    const token = await loginDreamlove();

    emitProgress(5, "Sincronizar categorias principais...");
    await syncMainCategories();

    emitProgress(15, "Sincronizar categorias...");
    await syncDreamloveCategories(token);

    emitProgress(30, "Sincronizar marcas...");
    await syncBrands(token);

    emitProgress(60, "Sincronizar produtos...");
    await syncProducts(token);

    emitProgress(100, "Sincronização concluída");
    syncEmitter.emit("message", { type: "done" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    emitLog(message);
    syncEmitter.emit("message", { type: "error", message });
    throw error;
  }
}