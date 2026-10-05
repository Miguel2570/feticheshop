// lib/sync-stock.ts
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

const SETTING_KEY = "supplier-stock:lastSyncAt";

// Nº de updates por batch
const BATCH_SIZE = 500;

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
  variantsUpdated: number;
  productsRecalculated: number;
  orphansCleaned: number;
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
  let orphansCleaned = 0;
  let errors = 0;

  // Map<dreamloveId, stock>
  const newStocksByDreamloveId = new Map<number, number>();

  // Set com TODOS os dreamloveIds vistos nesta sync
  const seenDreamloveIds = new Set<number>();

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

    // 3. Iterar páginas
    const MAX_PAGES = 20;
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

      // 4. Acumular stocks + registar todos os IDs vistos
      for (const item of items) {
        const dreamloveId = extractDreamloveId(item.product);
        if (!dreamloveId) {
          errors++;
          continue;
        }
        newStocksByDreamloveId.set(dreamloveId, item.available);
        seenDreamloveIds.add(dreamloveId);
      }

      if (items.length < 1000) {
        console.log(`   Última página (${items.length} < 1000)`);
        break;
      }

      page++;
    }

    console.log(
      `\n📊 ${newStocksByDreamloveId.size} dreamloveIds a processar na BD`
    );

    // 5. Carregar TODAS as variantes com dreamloveId
    const dreamloveIds = Array.from(newStocksByDreamloveId.keys());

    console.log(`🔍 A carregar variantes da BD...`);
    const variants = await prisma.productVariant.findMany({
      where: { dreamloveId: { in: dreamloveIds } },
      select: {
        id: true,
        productId: true,
        dreamloveId: true,
        stock: true,
      },
    });

    console.log(`   ${variants.length} variantes encontradas`);

    // 6. Filtrar só as que mudaram
    const toUpdate: Array<{ id: string; stock: number }> = [];
    const affectedProductIds = new Set<string>();

    for (const v of variants) {
      if (v.dreamloveId == null) continue;
      const newStock = newStocksByDreamloveId.get(v.dreamloveId);
      if (newStock === undefined) continue;

      affectedProductIds.add(v.productId);

      if (v.stock !== newStock) {
        toUpdate.push({ id: v.id, stock: newStock });
      }
    }

    console.log(`   ${toUpdate.length} variantes com stock alterado`);
    console.log(`   ${affectedProductIds.size} produtos afetados\n`);

    // 7. Updates em batch
    if (toUpdate.length > 0) {
      console.log(`🔄 A atualizar variantes em batches de ${BATCH_SIZE}...`);

      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE);

        try {
          await prisma.$transaction(
            batch.map((u) =>
              prisma.productVariant.update({
                where: { id: u.id },
                data: { stock: u.stock },
              })
            )
          );

          variantsUpdated += batch.length;

          const done = Math.min(i + BATCH_SIZE, toUpdate.length);
          console.log(`   ${done}/${toUpdate.length}...`);
        } catch (err) {
          console.error(`   ❌ Erro no batch ${i}:`, err);
          errors += batch.length;
        }
      }
    }

    // 8. Recalcular stocks dos produtos afetados
    console.log(
      `\n🔄 A recalcular stock de ${affectedProductIds.size} produtos...`
    );

    const affectedArray = Array.from(affectedProductIds);

    const aggregates = await prisma.productVariant.groupBy({
      by: ["productId"],
      where: {
        productId: { in: affectedArray },
        isActive: true,
      },
      _sum: { stock: true },
    });

    console.log(`   ${aggregates.length} produtos agregados`);

    let productsRecalculated = 0;

    for (let i = 0; i < aggregates.length; i += BATCH_SIZE) {
      const batch = aggregates.slice(i, i + BATCH_SIZE);

      try {
        const values = batch.map(
          (a) => Prisma.sql`(${a.productId}, ${a._sum.stock ?? 0})`
        );

        await prisma.$executeRaw`
          UPDATE "Product" AS p
          SET 
            stock = v.stock,
            "supplierStock" = v.stock
          FROM (VALUES ${Prisma.join(values)}) AS v(id, stock)
          WHERE p.id = v.id
        `;

        productsRecalculated += batch.length;

        const done = Math.min(i + BATCH_SIZE, aggregates.length);
        console.log(`   ${done}/${aggregates.length}...`);
      } catch (err) {
        console.error(`   ❌ Erro no batch de produtos ${i}:`, err);
        errors += batch.length;
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 9. LIMPEZA — SÓ corre em FULL SYNC
    //
    // ⚠️ IMPORTANTE: em modo incremental, a API devolve apenas os
    //    itens que MUDARAM desde a última sync. Não podemos assumir
    //    que "o que não veio é órfão" — isso zeraria stocks válidos.
    //
    //    Só corremos a limpeza quando a resposta é COMPLETA
    //    (lastSyncAt === null → full sync).
    // ═══════════════════════════════════════════════════════════

    if (lastSyncAt === null) {
      console.log(
        `\n🧹 FULL SYNC — a procurar variantes órfãs (já não existem na Dreamlove)...`
      );

      const orphanVariants = await prisma.productVariant.findMany({
        where: {
          dreamloveId: { not: null },
          NOT: { dreamloveId: { in: Array.from(seenDreamloveIds) } },
        },
        select: {
          id: true,
          productId: true,
          dreamloveId: true,
          stock: true,
        },
      });

      console.log(`   ${orphanVariants.length} variantes órfãs na BD`);

      const orphansToClean = orphanVariants.filter((v) => v.stock > 0);

      console.log(
        `   ${orphansToClean.length} variantes órfãs com stock > 0 para limpar`
      );

      const affectedByOrphans = new Set<string>();

      if (orphansToClean.length > 0) {
        console.log(`\n🔄 A zerar stock de variantes órfãs em batches...`);

        for (let i = 0; i < orphansToClean.length; i += BATCH_SIZE) {
          const batch = orphansToClean.slice(i, i + BATCH_SIZE);
          const ids = batch.map((v) => v.id);

          try {
            await prisma.productVariant.updateMany({
              where: { id: { in: ids } },
              data: {
                stock: 0,
                isActive: false,
              },
            });

            orphansCleaned += batch.length;
            batch.forEach((v) => affectedByOrphans.add(v.productId));

            const done = Math.min(i + BATCH_SIZE, orphansToClean.length);
            console.log(`   ${done}/${orphansToClean.length}...`);
          } catch (err) {
            console.error(`   ❌ Erro no batch de órfãs ${i}:`, err);
            errors += batch.length;
          }
        }

        // Recalcular stock dos produtos afetados pela limpeza
        if (affectedByOrphans.size > 0) {
          console.log(
            `\n🔄 A recalcular stock de ${affectedByOrphans.size} produtos afetados pela limpeza...`
          );

          const orphanAggregates = await prisma.productVariant.groupBy({
            by: ["productId"],
            where: {
              productId: { in: Array.from(affectedByOrphans) },
              isActive: true,
            },
            _sum: { stock: true },
          });

          for (let i = 0; i < orphanAggregates.length; i += BATCH_SIZE) {
            const batch = orphanAggregates.slice(i, i + BATCH_SIZE);

            try {
              const values = batch.map(
                (a) => Prisma.sql`(${a.productId}, ${a._sum.stock ?? 0})`
              );

              await prisma.$executeRaw`
                UPDATE "Product" AS p
                SET 
                  stock = v.stock,
                  "supplierStock" = v.stock
                FROM (VALUES ${Prisma.join(values)}) AS v(id, stock)
                WHERE p.id = v.id
              `;
            } catch (err) {
              console.error(
                `   ❌ Erro no batch de produtos órfãos ${i}:`,
                err
              );
              errors += batch.length;
            }
          }
        }
      }
    } else {
      console.log(
        `\n⏭️  Sync incremental — limpeza de órfãos ignorada (só corre em full sync)`
      );
    }

    // 10. Guardar data da última sync
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
    console.log(`Variantes órfãs limpas:    ${orphansCleaned}`);
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
      orphansCleaned,
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
      orphansCleaned: 0,
      errors: errors + 1,
      message,
    };
  }
}