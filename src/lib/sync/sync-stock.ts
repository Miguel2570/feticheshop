// lib/sync-stock.ts
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

const SETTING_KEY = "supplier-stock:lastSyncAt";
const SUPPLIER_SLUG = "dreamlove";

const BATCH_SIZE = 500;
const PAGE_SIZE = 1000;
const MAX_PAGES = 100; // limite de segurança (não funcional)
const FETCH_TIMEOUT_MS = 30_000;

// ═══════════════════════════════════════════════════════════════
// Tipos
// ═══════════════════════════════════════════════════════════════

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
  productsUpdated: number;
  errors: number;
  message?: string;
};

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

async function loginDreamlove(): Promise<string> {
  const res = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`Erro no login Dreamlove: ${res.status}`);
  }

  const data = await res.json();
  if (!data.token) {
    throw new Error("Token Dreamlove não recebido");
  }

  return data.token;
}

async function getLastSyncAt(): Promise<Date | null> {
  const setting = await prisma.setting.findUnique({
    where: { key: SETTING_KEY },
  });

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
  if (updatedAfterDate) {
    params.set("updatedAfterDate", updatedAfterDate.toISOString());
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_URL}/available_stocks?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Erro página ${page}: ${res.status}`);
    }

    const data = await res.json();
    const items: AvailableStockItem[] = Array.isArray(data)
      ? data
      : data["hydra:member"] ?? data.items ?? data.data ?? [];

    return items;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Extrai o dreamloveId do campo `product` (ex.: "/products/23" → 23).
 * Usa regex robusto e fallback para número direto.
 */
function extractDreamloveId(productRef: string): number | null {
  const m = productRef.match(/\/products\/(\d+)/);
  if (m) return Number(m[1]);
  const n = Number(productRef);
  return Number.isFinite(n) ? n : null;
}

// ═══════════════════════════════════════════════════════════════
// Sync principal
// ═══════════════════════════════════════════════════════════════

export async function syncStock(): Promise<SyncResult> {
  const startedAt = new Date();
  const startTime = Date.now();

  console.log("═══════════════════════════════════════════");
  console.log("🔄 SYNC STOCK — INÍCIO");
  console.log("═══════════════════════════════════════════\n");

  let pagesProcessed = 0;
  let itemsProcessed = 0;
  let productsUpdated = 0;
  let errors = 0;

  // Verificar supplier
  const supplier = await prisma.supplier.findUnique({
    where: { slug: SUPPLIER_SLUG },
  });

  if (!supplier) {
    throw new Error(`Supplier "${SUPPLIER_SLUG}" não encontrado`);
  }

  // Registar início da sync
  const sync = await prisma.supplierSync.create({
    data: { supplierId: supplier.id, status: "RUNNING" },
  });

  // Map<dreamloveId, stock agregado>
  const stockByProductId = new Map<number, number>();

  try {
    // 1. Login
    console.log("🔐 Login Dreamlove...");
    const token = await loginDreamlove();
    console.log("✅ Login OK\n");

    // 2. Última sync
    const lastSyncAt = await getLastSyncAt();
    if (lastSyncAt) {
      console.log(`📅 Última sync: ${lastSyncAt.toISOString()} (incremental)`);
    } else {
      console.log("📅 Primeira sync (full)");
    }
    console.log("");

    // 3. Iterar páginas até resposta vazia
    let page = 1;
    let reachedEnd = false;

    while (page <= MAX_PAGES) {
      console.log(`📦 A carregar página ${page}...`);
      const items = await fetchAvailableStocksPage(token, page, lastSyncAt);

      if (items.length === 0) {
        console.log(`   Página ${page} vazia — fim.`);
        reachedEnd = true;
        break;
      }

      pagesProcessed++;
      itemsProcessed += items.length;

      console.log(`   ${items.length} itens`);

      // 4. Acumular stock por produto (soma se houver múltiplos armazéns)
      for (const item of items) {
        const dreamloveId = extractDreamloveId(item.product);
        if (!dreamloveId) {
          errors++;
          continue;
        }
        stockByProductId.set(
          dreamloveId,
          (stockByProductId.get(dreamloveId) ?? 0) + item.available
        );
      }

      // Fim natural: menos que PAGE_SIZE
      if (items.length < PAGE_SIZE) {
        console.log(`   Última página (${items.length} < ${PAGE_SIZE})`);
        reachedEnd = true;
        break;
      }

      page++;
    }

    if (!reachedEnd) {
      console.warn(
        `⚠️  Atingido MAX_PAGES (${MAX_PAGES}) — sync pode estar incompleta.`
      );
    }

    console.log(`\n📊 ${stockByProductId.size} produtos a processar`);

    // 5. Lookup em PRODUCT (não em ProductVariant!)
    const dreamloveIds = Array.from(stockByProductId.keys());

    console.log(`🔍 A carregar produtos da BD...`);
    const products = await prisma.product.findMany({
      where: {
        dreamloveId: { in: dreamloveIds },
        stockMode: "SUPPLIER",
      },
      select: {
        id: true,
        dreamloveId: true,
        stock: true,
        status: true,
      },
    });

    console.log(
      `   ${products.length} produtos encontrados (stockMode=SUPPLIER)`
    );

    // 6. Preparar updates
    type UpdateRow = {
      id: string;
      stock: number;
      supplierStock: number;
      status: string;
    };

    const toUpdate: UpdateRow[] = [];

    for (const p of products) {
      if (p.dreamloveId == null) continue;

      const newStock = stockByProductId.get(p.dreamloveId);
      if (newStock === undefined) continue;

      // Repor status quando há stock
      let newStatus = p.status;
      if (newStock > 0 && p.status === "OUT_OF_STOCK") {
        newStatus = "ACTIVE";
      } else if (newStock === 0 && p.status === "ACTIVE") {
        newStatus = "OUT_OF_STOCK";
      }

      if (p.stock !== newStock || p.status !== newStatus) {
        toUpdate.push({
          id: p.id,
          stock: newStock,
          supplierStock: newStock,
          status: newStatus,
        });
      }
    }

    console.log(`   ${toUpdate.length} produtos com alterações\n`);

    // 7. Updates em batch
    if (toUpdate.length > 0) {
      console.log(`🔄 A atualizar em batches de ${BATCH_SIZE}...`);

      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE);

        try {
          const values = batch.map(
            (u) =>
              Prisma.sql`(${u.id}, ${u.stock}, ${u.supplierStock}, ${u.status}::"ProductStatus")`
          );

          await prisma.$executeRaw`
            UPDATE "Product" AS p
            SET
              stock = v.stock,
              "supplierStock" = v."supplierStock",
              status = v.status
            FROM (VALUES ${Prisma.join(values)}) AS v(id, stock, "supplierStock", status)
            WHERE p.id = v.id
          `;

          productsUpdated += batch.length;

          const done = Math.min(i + BATCH_SIZE, toUpdate.length);
          console.log(`   ${done}/${toUpdate.length}...`);
        } catch (err) {
          console.error(`   ❌ Erro no batch ${i}:`, err);
          errors += batch.length;
        }
      }
    }

    // 8. Atualizar SupplierProduct (auditoria — não falha a sync se der erro)
    const supplierProductIds = dreamloveIds.map(String);

    for (let i = 0; i < supplierProductIds.length; i += BATCH_SIZE) {
      const batch = supplierProductIds.slice(i, i + BATCH_SIZE);

      try {
        await prisma.supplierProduct.updateMany({
          where: {
            supplierId: supplier.id,
            supplierProductId: { in: batch },
          },
          data: { lastSyncAt: new Date() },
        });
      } catch (err) {
        console.warn(
          `   ⚠️  Erro a atualizar SupplierProduct batch ${i}:`,
          errorMessage(err)
        );
      }
    }

    // 9. Fechar registo de sync
    await prisma.supplierSync.update({
      where: { id: sync.id },
      data: {
        status: errors === 0 ? "SUCCESS" : "FAILED",
        totalProducts: itemsProcessed,
        updated: productsUpdated,
        failed: errors,
        finishedAt: new Date(),
      },
    });

    // 10. Guardar lastSyncAt APENAS se a sync chegou ao fim
    if (reachedEnd) {
      await setLastSyncAt(startedAt);
      console.log("✅ lastSyncAt atualizado");
    } else {
      console.warn("⚠️  lastSyncAt NÃO atualizado (sync incompleta)");
    }

    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;

    console.log("\n═══════════════════════════════════════════");
    console.log("✅ SYNC CONCLUÍDO");
    console.log("═══════════════════════════════════════════\n");
    console.log(`Páginas processadas:     ${pagesProcessed}`);
    console.log(`Itens processados:       ${itemsProcessed}`);
    console.log(`Produtos atualizados:    ${productsUpdated}`);
    console.log(`Erros:                   ${errors}`);
    console.log(`Duração:                 ${(durationMs / 1000).toFixed(2)}s`);
    console.log("");

    return {
      success: reachedEnd && errors === 0,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      pagesProcessed,
      itemsProcessed,
      productsUpdated,
      errors,
    };
  } catch (error) {
    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;
    const message = errorMessage(error);

    console.error("\n❌ SYNC FALHOU");
    console.error(message);

    // Fechar registo de sync como falhado
    try {
      await prisma.supplierSync.update({
        where: { id: sync.id },
        data: {
          status: "FAILED",
          message,
          finishedAt: new Date(),
        },
      });
    } catch (dbErr) {
      console.error(
        "   ⚠️  Não foi possível atualizar SupplierSync:",
        errorMessage(dbErr)
      );
    }

    return {
      success: false,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      pagesProcessed,
      itemsProcessed,
      productsUpdated,
      errors: errors + 1,
      message,
    };
  }
}