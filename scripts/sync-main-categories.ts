// scripts/sync-main-categories.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  console.log("🎉 Categorias principais sincronizadas!");
}

syncMainCategories()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });