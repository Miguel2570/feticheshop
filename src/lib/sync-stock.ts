// lib/sync-stock.ts
import { prisma } from "@/lib/prisma";

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

const SETTING_KEY = "supplier-stock:lastSyncAt";

// ═══════════════════════════════════════════════════════════════
// Tipos
// ═══════════════════════════════════════════════════════════════

type AvailableStockItem = {
  id: string; // "69-23" (warehouseId-productId)
  warehouse: string;
  product: string; // "/products/23"
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
  productsRecalculated: number;
  errors: number;
  message?: string;
};

// ═══════════════════════════════════════════════════════════════
// Autenticação
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// Última sincronização
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// Fetch de uma página
// ═══════════════════════════════════════════════════════════════

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

  const res = await fetch(`${API_URL}/available_stocks?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Erro página ${page}: ${res.status}`);
  }

  const data = await res.json();
  const items: AvailableStockItem[] = Array.isArray(data)
    ? data
    : data["hydra:member"] ?? data.items ?? data.data ?? [];

  return items;
}

// ═══════════════════════════════════════════════════════════════
// Extrair dreamloveId do campo "product"
// ═══════════════════════════════════════════════════════════════

function extractDreamloveId(productRef: string): number | null {
  // "product" vem no formato "/products/23"
  const parts = productRef.split("/");
  const idStr = parts[parts.length - 1];
  const id = Number(idStr);
  return isNaN(id) ? null : id;
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
  let variantsUpdated = 0;
  let errors = 0;
  const affectedProductIds = new Set<string>();

  try {
    // 1. Login
    console.log("🔐 Login Dreamlove...");
    const token = await loginDreamlove();
    console.log("✅ Login OK\n");

    // 2. Última sync
    const lastSyncAt = await getLastSyncAt();
    if (lastSyncAt) {
      console.log(
        `📅 Última sync: ${lastSyncAt.toISOString()} (incremental)`
      );
    } else {
      console.log("📅 Primeira sync (full)");
    }
    console.log("");

    // 3. Iterar páginas
    const MAX_PAGES = 50; // safety guard
    let page = 1;

    while (page <= MAX_PAGES) {
      console.log(`📦 A carregar página ${page}...`);
      const items = await fetchAvailableStocksPage(token, page, lastSyncAt);

      if (items.length === 0) {
        console.log(`   Página ${page} vazia — fim.`);
        break;
      }

      pagesProcessed++;
      itemsProcessed += items.length;

      console.log(`   ${items.length} itens processados`);

      // 4. Processar cada item
      for (const item of items) {
        try {
          const dreamloveId = extractDreamloveId(item.product);
          if (!dreamloveId) {
            errors++;
            continue;
          }

          // Encontrar variante por dreamloveId
          const variant = await prisma.productVariant.findUnique({
            where: { dreamloveId },
            select: { id: true, productId: true, stock: true },
          });

          if (!variant) {
            // Não é erro — pode ser produto que não importaste
            continue;
          }

          const newStock = item.available;

          // Atualizar se mudou
          if (variant.stock !== newStock) {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: { stock: newStock },
            });
            variantsUpdated++;
          }

          affectedProductIds.add(variant.productId);
        } catch (err) {
          console.error(`   ❌ Erro no item ${item.id}:`, err);
          errors++;
        }
      }

      // Se veio menos de 1000, acabámos
      if (items.length < 1000) {
        console.log(`   Última página (${items.length} < 1000)`);
        break;
      }

      page++;
    }

    // 5. Recalcular Product.stock dos produtos afetados
    console.log(
      `\n🔄 A recalcular stock de ${affectedProductIds.size} produtos...`
    );

    let productsRecalculated = 0;

    for (const productId of affectedProductIds) {
      try {
        const variants = await prisma.productVariant.findMany({
          where: { productId, isActive: true },
          select: { stock: true },
        });

        const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: totalStock,
            supplierStock: totalStock,
          },
        });

        productsRecalculated++;
      } catch (err) {
        console.error(`   ❌ Erro no produto ${productId}:`, err);
        errors++;
      }
    }

    // 6. Guardar data da última sync
    await setLastSyncAt(startedAt);

    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;

    console.log("\n═══════════════════════════════════════════");
    console.log("✅ SYNC CONCLUÍDO");
    console.log("═══════════════════════════════════════════\n");
    console.log(`Páginas processadas:       ${pagesProcessed}`);
    console.log(`Itens processados:         ${itemsProcessed}`);
    console.log(`Variantes atualizadas:     ${variantsUpdated}`);
    console.log(`Produtos recalculados:     ${productsRecalculated}`);
    console.log(`Erros:                     ${errors}`);
    console.log(`Duração:                   ${(durationMs / 1000).toFixed(2)}s`);
    console.log("");

    return {
      success: true,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      pagesProcessed,
      itemsProcessed,
      variantsUpdated,
      productsRecalculated,
      errors,
    };
  } catch (error) {
    const finishedAt = new Date();
    const durationMs = Date.now() - startTime;
    const message = error instanceof Error ? error.message : String(error);

    console.error("\n❌ SYNC FALHOU");
    console.error(message);

    return {
      success: false,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      pagesProcessed,
      itemsProcessed,
      variantsUpdated,
      productsRecalculated: 0,
      errors: errors + 1,
      message,
    };
  }
}