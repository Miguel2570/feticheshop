// lib/sync/sync-stock.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

const SETTING_KEY = "supplier-stock:lastSyncAt";
const SUPPLIER_SLUG = "dreamlove";

const BATCH_SIZE = 500;
const PAGE_SIZE = 1000;
const MAX_PAGES = 100;
const FETCH_TIMEOUT_MS = 30_000;

type AvailableStockItem = {
  id: string;
  warehouse: string;
  product: string;
  available: number;
  updatedAt: string;
  inventoryFree: boolean;
  lots: Array<Record<string, number>>;
};

type SyncResult = {
  success: boolean;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  pagesProcessed: number;
  itemsProcessed: number;
  variantsUpdated: number;
  notificationsSent: number;
  errors: number;
  message?: string;
};

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

async function loginDreamlove(): Promise<string> {
  const res = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  if (!res.ok) throw new Error(`Erro no login Dreamlove: ${res.status}`);
  const data = await res.json();
  if (!data.token) throw new Error("Token Dreamlove não recebido");
  return data.token;
}

async function getLastSyncAt(): Promise<Date | null> {
  const setting = await prisma.setting.findUnique({ where: { key: SETTING_KEY } });
  if (!setting) return null;
  const value = setting.value as { iso?: string } | null;
  if (!value?.iso) return null;
  const date = new Date(value.iso);
  return isNaN(date.getTime()) ? null : date;
}

async function setLastSyncAt(date: Date): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SETTING_KEY },
    update: { value: { iso: date.toISOString() } },
    create: {
      key: SETTING_KEY,
      value: { iso: date.toISOString() },
      description: "Data da última sincronização de stock do fornecedor",
      category: "supplier",
    },
  });
}

async function fetchAvailableStocksPage(
  token: string,
  page: number,
  updatedAfterDate: Date | null
): Promise<AvailableStockItem[]> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (updatedAfterDate) params.set("updatedAfterDate", updatedAfterDate.toISOString());

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/available_stocks?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Erro página ${page}: ${res.status}`);

    const data = await res.json();
    return Array.isArray(data) ? data : data["hydra:member"] ?? data.items ?? data.data ?? [];
  } finally {
    clearTimeout(timeout);
  }
}

function extractDreamloveId(productRef: string): number | null {
  const m = productRef.match(/\/products\/(\d+)/);
  if (m) return Number(m[1]);
  const n = Number(productRef);
  return Number.isFinite(n) ? n : null;
}

export async function syncStock(): Promise<SyncResult> {
  const startedAt = new Date();
  const startTime = Date.now();

  console.log("═══════════════════════════════════════════");
  console.log("🔄 SYNC STOCK (Variantes) — INÍCIO");
  console.log("═══════════════════════════════════════════\n");

  let pagesProcessed = 0;
  let itemsProcessed = 0;
  let variantsUpdated = 0;
  let notificationsSent = 0;
  let errors = 0;

  const supplier = await prisma.supplier.findUnique({ where: { slug: SUPPLIER_SLUG } });
  if (!supplier) throw new Error(`Supplier "${SUPPLIER_SLUG}" não encontrado`);

  const sync = await prisma.supplierSync.create({
    data: { supplierId: supplier.id, status: "RUNNING" },
  });

  const stockByProductId = new Map<number, number>();

  try {
    console.log("🔐 Login Dreamlove...");
    const token = await loginDreamlove();
    console.log("✅ Login OK\n");

    const lastSyncAt = await getLastSyncAt();
    if (lastSyncAt) console.log(`📅 Última sync: ${lastSyncAt.toISOString()} (incremental)`);
    else console.log("📅 Primeira sync (full)");
    console.log("");

    let page = 1;
    let reachedEnd = false;

    while (page <= MAX_PAGES) {
      console.log(`📦 A carregar página ${page}...`);
      const items = await fetchAvailableStocksPage(token, page, lastSyncAt);

      if (items.length === 0) {
        reachedEnd = true;
        break;
      }

      pagesProcessed++;
      itemsProcessed += items.length;

      for (const item of items) {
        const dreamloveId = extractDreamloveId(item.product);
        if (!dreamloveId) { errors++; continue; }
        stockByProductId.set(dreamloveId, (stockByProductId.get(dreamloveId) ?? 0) + item.available);
      }

      if (items.length < PAGE_SIZE) {
        reachedEnd = true;
        break;
      }
      page++;
    }

    const dreamloveIds = Array.from(stockByProductId.keys());

    // 1. Atualizar as VARIANTES
    console.log(`\n🔍 A procurar variantes na BD...`);
    const variants = await prisma.productVariant.findMany({
      where: { dreamloveId: { in: dreamloveIds } },
      select: { id: true, dreamloveId: true, stock: true, productId: true }
    });

    type VUpdate = { id: string; stock: number };
    const toUpdate: VUpdate[] = [];
    const productIdsThatGotStock = new Set<string>();

    // Para notificações, precisamos de saber o stock do Produto Pai antes
    const affectedProductIds = Array.from(new Set(variants.map(v => v.productId)));
    const productsBefore = await prisma.product.findMany({
      where: { id: { in: affectedProductIds } },
      select: { id: true, stock: true, status: true }
    });
    const oldProductStock = new Map(productsBefore.map(p => [p.id, p.stock]));

    for (const v of variants) {
      if (v.dreamloveId == null) continue;
      const newStock = stockByProductId.get(v.dreamloveId);
      if (newStock !== undefined && v.stock !== newStock) {
        toUpdate.push({ id: v.id, stock: newStock });
      }
    }

    if (toUpdate.length > 0) {
      console.log(`🔄 A atualizar ${toUpdate.length} variantes...`);
      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE);
        await prisma.$transaction(
          batch.map((u) => prisma.productVariant.update({
            where: { id: u.id },
            data: { stock: u.stock }
          }))
        );
        variantsUpdated += batch.length;
      }
    }

    // 2. Recalcular Produtos Pais via SQL Rápido
    console.log(`\n🔄 A recalcular stock dos Produtos Pai...`);
    await prisma.$executeRaw`
      UPDATE "Product" AS p
      SET stock = sub."total_stock"
      FROM (
        SELECT "productId", SUM(stock) as "total_stock"
        FROM "ProductVariant"
        GROUP BY "productId"
      ) AS sub
      WHERE p.id = sub."productId";
    `;

    // 3. Verificar se algum produto voltou a ter stock (para notificações)
    const productsAfter = await prisma.product.findMany({
      where: { id: { in: affectedProductIds }, stock: { gt: 0 } },
      select: { id: true, status: true }
    });

    for (const p of productsAfter) {
      const before = oldProductStock.get(p.id) ?? 0;
      if (before <= 0) productIdsThatGotStock.add(p.id);
    }

    // 4. Atualizar status ACTIVE / OUT_OF_STOCK nos Produtos Pai
    await prisma.$executeRaw`
      UPDATE "Product"
      SET status = CASE
        WHEN stock > 0 AND status = 'OUT_OF_STOCK' THEN 'ACTIVE'::"ProductStatus"
        WHEN stock = 0 AND status = 'ACTIVE' THEN 'OUT_OF_STOCK'::"ProductStatus"
        ELSE status
      END
      WHERE "id" IN (${Prisma.join(affectedProductIds.map(id => Prisma.sql`${id}`))});
    `;

    // 5. Fechar sync
    await prisma.supplierSync.update({
      where: { id: sync.id },
      data: {
        status: errors === 0 ? "SUCCESS" : "FAILED",
        totalProducts: itemsProcessed,
        updated: variantsUpdated,
        failed: errors,
        finishedAt: new Date(),
      },
    });

    if (reachedEnd) await setLastSyncAt(startedAt);

    // 6. Notificações de Stock
    if (productIdsThatGotStock.size > 0) {
      const notificacoes = await prisma.stockNotification.findMany({
        where: { productId: { in: Array.from(productIdsThatGotStock) }, notified: false },
        include: { product: true }
      });
      
      for (const notif of notificacoes) {
        // await enviarEmail(notif.email, notif.product.name);
        await prisma.stockNotification.update({
          where: { id: notif.id },
          data: { notified: true, notifiedAt: new Date() },
        });
        notificationsSent++;
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(`\n✅ SYNC CONCLUÍDO em ${(durationMs / 1000).toFixed(2)}s. Variantes atualizadas: ${variantsUpdated}`);

    return {
      success: reachedEnd && errors === 0,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs,
      pagesProcessed,
      itemsProcessed,
      variantsUpdated,
      notificationsSent,
      errors,
    };
  } catch (error) {
    const message = errorMessage(error);
    console.error("\n❌ SYNC FALHOU", message);
    await prisma.supplierSync.update({
      where: { id: sync.id },
      data: { status: "FAILED", message, finishedAt: new Date() },
    });
    return {
      success: false,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      pagesProcessed, itemsProcessed, variantsUpdated, notificationsSent,
      errors: errors + 1,
      message,
    };
  }
}