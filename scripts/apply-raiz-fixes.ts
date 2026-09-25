// scripts/apply-raiz-fixes.ts
//
// Lê todos os produtos, classifica com classify(), compara com a raiz atual.
// Se a raiz atual != raiz esperada → regista para mover.
// Com --apply, aplica. Sem --apply, só mostra (dry-run).

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { writeFileSync, mkdirSync } from "fs";
import { classify } from "./rules/raiz-rules";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

interface Move {
  productId: string;
  productName: string;
  currentRootSlug: string | null;
  currentRootName: string | null;
  currentSubSlug: string | null;
  currentSubName: string | null;
  expectedRoot: string;
  expectedSub: string | undefined;
  reason: string;
}

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("🔧 Aplicar correções de RAIZ");
  console.log(`   Modo: ${APPLY ? "APLICAR" : "DRY-RUN"}`);
  console.log("═══════════════════════════════════════\n");

  // Carregar todas as categorias
  const allCats = await prisma.category.findMany({
    where: { deletedAt: null, isActive: true },
    select: { id: true, name: true, slug: true, parentId: true },
  });
  const catBySlug = new Map(allCats.map((c) => [c.slug, c]));

  // Produtos com categorias
  const products = await prisma.product.findMany({
    where: { deletedAt: null, status: { not: "ARCHIVED" } },
    include: {
      categories: {
        include: {
          category: {
            include: { parent: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  console.log(`📦 ${products.length} produtos a analisar`);

  const moves: Move[] = [];
  let skippedNoHint = 0;
  let skippedAlreadyOk = 0;

  for (const p of products) {
    const hint = classify(p.name);
    if (!hint) {
      skippedNoHint++;
      continue;
    }

    // Descobrir raiz atual
    let currentRootSlug: string | null = null;
    let currentRootName: string | null = null;
    let currentSubSlug: string | null = null;
    let currentSubName: string | null = null;

    for (const pc of p.categories) {
      const c = pc.category;
      if (c.parentId === null) {
        currentRootSlug = c.slug;
        currentRootName = c.name;
      } else {
        currentSubSlug = c.slug;
        currentSubName = c.name;
        if (c.parent) {
          currentRootSlug = c.parent.slug;
          currentRootName = c.parent.name;
        }
      }
    }

    if (currentRootSlug === hint.root) {
      skippedAlreadyOk++;
      continue;
    }

    moves.push({
      productId: p.id,
      productName: p.name,
      currentRootSlug,
      currentRootName,
      currentSubSlug,
      currentSubName,
      expectedRoot: hint.root,
      expectedSub: hint.sub,
      reason: hint.reason,
    });
  }

  console.log(`✅ ${skippedAlreadyOk} já estão na raiz correta`);
  console.log(`⏭️  ${skippedNoHint} sem marca reconhecida`);
  console.log(`🎯 ${moves.length} a mover\n`);

  // ─── Agrupar por (raiz atual → raiz esperada)
  const groups = new Map<string, Move[]>();
  for (const m of moves) {
    const key = `${m.currentRootName ?? "(sem raiz)"} → ${m.expectedRoot}`;
    const list = groups.get(key) ?? [];
    list.push(m);
    groups.set(key, list);
  }

  // ─── Escrever relatório
  mkdirSync("scripts/output", { recursive: true });
  const ts = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const file = `scripts/output/raiz-moves-${ts}.txt`;

  const out: string[] = [];
  out.push("═══════════════════════════════════════");
  out.push("🔧 MOVES DE RAIZ");
  out.push(`📅 ${new Date().toISOString()}`);
  out.push("═══════════════════════════════════════\n");
  out.push(`Total de produtos a mover: ${moves.length}\n`);

  for (const [key, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
    out.push("──────────────────────────────");
    out.push(`📦 ${key}  (${list.length} produtos)`);
    out.push("──────────────────────────────");
    for (const m of list) {
      const subTarget = m.expectedSub ? ` > ${m.expectedSub}` : "";
      out.push(`  • ${m.productName}`);
      out.push(`      destino: ${m.expectedRoot}${subTarget}`);
    }
    out.push("");
  }

  writeFileSync(file, out.join("\n"), "utf-8");
  console.log(`📄 Relatório: ${file}\n`);

  if (!APPLY) {
    console.log("═══════════════════════════════════════");
    console.log("🚫 DRY-RUN — nada foi alterado.");
    console.log("   Para aplicar: npx tsx scripts/apply-raiz-fixes.ts --apply");
    console.log("═══════════════════════════════════════");
    return;
  }

  // ─── APLICAR
  console.log("═══════════════════════════════════════");
  console.log("🚀 A APLICAR...");
  console.log("═══════════════════════════════════════\n");

  let applied = 0;
  let errors = 0;

  for (const m of moves) {
    try {
      // Remover TODAS as categorias atuais
      await prisma.productCategory.deleteMany({
        where: { productId: m.productId },
      });

      // Determinar categoria destino
      const destSlug = m.expectedSub ?? m.expectedRoot;
      const destCat = catBySlug.get(destSlug);
      if (!destCat) {
        console.error(`❌ Slug destino não existe: ${destSlug}`);
        errors++;
        continue;
      }

      await prisma.productCategory.create({
        data: {
          productId: m.productId,
          categoryId: destCat.id,
        },
      });

      applied++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`❌ ${m.productName}: ${msg}`);
      errors++;
    }
  }

  console.log("\n═══════════════════════════════════════");
  console.log(`✅ Aplicado: ${applied}`);
  console.log(`❌ Erros: ${errors}`);
  console.log("═══════════════════════════════════════");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());