// scripts/sync-main-categories.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mainCategories = [
  { name: "Sex Toys", slug: "sex-toys", isFeatured: false },
  { name: "Para o Pénis", slug: "para-ele", isFeatured: false },
  { name: "Saúde e Bem-Estar", slug: "essenciais", isFeatured: false },
  { name: "Lingerie", slug: "roupa", isFeatured: false },
  { name: "BDSM", slug: "bdsm", isFeatured: false },
];

async function syncMainCategories() {
  console.log("🔄 A sincronizar categorias principais...");

  for (const cat of mainCategories) {
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        isActive: true,
        isFeatured: cat.isFeatured,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: true,
        isFeatured: cat.isFeatured,
        sortOrder: mainCategories.indexOf(cat),
      },
    });

    console.log(`✅ ${saved.name} (${saved.slug})`);
  }

  // ✅ CRIAR SUBCATEGORIAS
  const subcategories = [
    // Sex Toys
    { parent: "sex-toys", name: "Vibradores", slug: "vibradores" },
    { parent: "sex-toys", name: "Dildos", slug: "dildos" },
    { parent: "sex-toys", name: "Sugadores", slug: "sugadores" },
    { parent: "sex-toys", name: "Bolas Anales", slug: "bolas-anales" },
    { parent: "sex-toys", name: "Estimuladores", slug: "estimuladores" },

    // Para o Pénis
    { parent: "para-ele", name: "Masturbadores", slug: "masturbadores" },
    { parent: "para-ele", name: "Anéis Penianos", slug: "aneis-penianos" },
    { parent: "para-ele", name: "Estimulantes", slug: "estimulantes" },

    // Saúde e Bem-Estar
    { parent: "essenciais", name: "Lubrificantes", slug: "lubrificantes" },
    { parent: "essenciais", name: "Afrodisíacos", slug: "afrodisiacos" },

    // Lingerie
    { parent: "roupa", name: "Lingerie Sexy", slug: "lingerie-sexy" },
    { parent: "roupa", name: "Bodystocking", slug: "bodystocking" },
    { parent: "roupa", name: "Bikinis", slug: "bikinis" },

    // BDSM
    { parent: "bdsm", name: "Bondage", slug: "bondage" },
  ];

  console.log("\n📂 A criar subcategorias...");

  for (const sub of subcategories) {
    const parent = await prisma.category.findUnique({
      where: { slug: sub.parent },
    });

    if (!parent) {
      console.log(`❌ Parent não encontrado: ${sub.parent}`);
      continue;
    }

    const saved = await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {
        name: sub.name,
        parentId: parent.id,
        isActive: true,
      },
      create: {
        name: sub.name,
        slug: sub.slug,
        parentId: parent.id,
        isActive: true,
      },
    });

    console.log(`✅ ${saved.name} → ${parent.name}`);
  }

  console.log("🎉 Tudo sincronizado!");
}

syncMainCategories()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });