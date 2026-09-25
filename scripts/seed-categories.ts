// scripts/seed-categories.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Estrutura nova de categorias
const STRUCTURE: Array<{
  name: string;
  slug: string;
  children: Array<{ name: string; slug: string }>;
}> = [
  {
    name: "Brinquedos",
    slug: "brinquedos",
    children: [
      { name: "Anéis para o pénis", slug: "aneis-para-o-penis" },
      { name: "Bombas para o pénis", slug: "bombas-para-o-penis" },
      { name: "Bombas vaginais", slug: "bombas-vaginais" },
      { name: "Brinquedos anais", slug: "brinquedos-anais" },
      { name: "Dildos", slug: "dildos" },
      { name: "Estimuladores da próstata", slug: "estimuladores-da-prostata" },
      { name: "Estimuladores vaginais e clitorianos", slug: "estimuladores-vaginais-e-clitorianos" },
      { name: "Insufláveis", slug: "insuflaveis" },
      { name: "Masturbadores masculinos", slug: "masturbadores-masculinos" },
      { name: "Ovos e balas vibratórias", slug: "ovos-e-balas-vibratorias" },
      { name: "Strap-ons", slug: "strap-ons" },
      { name: "Vibradores", slug: "vibradores" },
    ],
  },
  {
    name: "Saúde e Bem-Estar",
    slug: "saude-e-bem-estar",
    children: [
      { name: "Afrodisíacos", slug: "afrodisiacos" },
      { name: "Intensificadores de orgasmo", slug: "intensificadores-de-orgasmo" },
      { name: "Desenvolvimento peniano", slug: "desenvolvimento-peniano" },
      { name: "Loções corporais", slug: "locoes-corporais" },
      { name: "Higiene íntima", slug: "higiene-intima" },
      { name: "Lubrificantes", slug: "lubrificantes" },
      { name: "Óleos, cremes e velas de massagem", slug: "oleos-cremes-e-velas-de-massagem" },
      { name: "Perfumes", slug: "perfumes" },
      { name: "Prazer oral", slug: "prazer-oral" },
      { name: "Preservativos", slug: "preservativos" },
      { name: "Relaxantes e anestesiantes", slug: "relaxantes-e-anestesiantes" },
      { name: "Retardantes", slug: "retardantes" },
      { name: "Volumizadores de esperma", slug: "volumizadores-de-esperma" },
    ],
  },
  {
    name: "Fetiche & BDSM",
    slug: "fetiche-bdsm",
    children: [
      { name: "Algemas, cordas e restrições", slug: "algemas-cordas-e-restricoes" },
      { name: "Vendas, máscaras e mordaças", slug: "vendas-mascaras-e-mordacas" },
      { name: "Chicotes, paddles e plumas", slug: "chicotes-paddles-e-plumas" },
      { name: "Coleiras, trelas e pinças", slug: "coleiras-trelas-e-pincas" },
      { name: "Kits BDSM", slug: "kits-bdsm" },
    ],
  },
  {
    name: "Lingerie Feminina",
    slug: "lingerie-feminina",
    children: [
      { name: "Conjuntos", slug: "conjuntos" },
      { name: "Bodys", slug: "bodys" },
      { name: "Babydolls", slug: "babydolls" },
      { name: "Camisas de noite e vestidos", slug: "camisas-de-noite-e-vestidos" },
      { name: "Catsuits e bodystockings", slug: "catsuits-e-bodystockings" },
      { name: "Cuecas", slug: "cuecas" },
      { name: "Meias e ligas", slug: "meias-e-ligas" },
    ],
  },
  {
    name: "Lingerie Masculina",
    slug: "lingerie-masculina",
    children: [
      { name: "Boxers, slips, tangas e strings", slug: "boxers-slips-tangas-e-strings" },
      { name: "Jockstraps", slug: "jockstraps" },
      { name: "Bodys e peças sensuais", slug: "bodys-e-pecas-sensuais" },
      { name: "Arneses e acessórios", slug: "arneses-e-acessorios" },
      { name: "Fantasias", slug: "fantasias" },
    ],
  },
  {
    name: "Jogos e Diversão",
    slug: "jogos-e-diversao",
    children: [
      { name: "Jogos eróticos", slug: "jogos-eroticos" },
      { name: "Comestíveis", slug: "comestiveis" },
      { name: "Aventais e artigos divertidos", slug: "aventais-e-artigos-divertidos" },
      { name: "Pintura corporal", slug: "pintura-corporal" },
      { name: "Bonecas e insufláveis", slug: "bonecas-e-insuflaveis" },
    ],
  },
];

async function main() {
  console.log("═══════════════════════════════════════");
  console.log("🌱 A criar estrutura de categorias");
  console.log("═══════════════════════════════════════\n");

  let createdRoots = 0;
  let createdChildren = 0;
  let existing = 0;

  for (let i = 0; i < STRUCTURE.length; i++) {
    const root = STRUCTURE[i];

    // Criar ou atualizar raiz
    let rootCat = await prisma.category.findUnique({ where: { slug: root.slug } });

    if (!rootCat) {
      rootCat = await prisma.category.create({
        data: {
          name: root.name,
          slug: root.slug,
          isActive: true,
          sortOrder: i,
        },
      });
      createdRoots++;
      console.log(`\n📁 ${root.name} (criada)`);
    } else {
      existing++;
      console.log(`\n📁 ${root.name} (já existe)`);
    }

    // Criar filhas
    for (let j = 0; j < root.children.length; j++) {
      const child = root.children[j];
      const existingChild = await prisma.category.findUnique({
        where: { slug: child.slug },
      });

      if (existingChild) {
        console.log(`   ✓ ${child.name} (já existe)`);
        existing++;
        continue;
      }

      await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          parentId: rootCat.id,
          isActive: true,
          sortOrder: j,
        },
      });
      createdChildren++;
      console.log(`   ✅ ${child.name}`);
    }
  }

  const total = await prisma.category.count({
    where: { deletedAt: null, isActive: true },
  });

  console.log("\n═══════════════════════════════════════");
  console.log("✅ CONCLUÍDO");
  console.log("═══════════════════════════════════════");
  console.log(`📊 Raízes criadas: ${createdRoots}`);
  console.log(`📊 Subcategorias criadas: ${createdChildren}`);
  console.log(`📊 Já existiam: ${existing}`);
  console.log(`📊 Total de categorias ativas: ${total}`);
  console.log("═══════════════════════════════════════");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());