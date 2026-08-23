// scripts/reassign-main-categories.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { findMainCategory } from "@/lib/category-mapping";

const prisma = new PrismaClient();

const FRONTEND_CATEGORY_SLUGS = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
];

async function reassignMainCategories() {
  console.log("🔄 A re-associar categorias do frontend...");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  let assigned = 0;
  let removed = 0;

  for (const product of products) {
    const text = `${product.name} ${product.description ?? ""}`;
    const categorySlug = findMainCategory(text);

    if (!categorySlug) {
      continue;
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      continue;
    }

    // Remove associações antigas com categorias do frontend
    const removedCount = await prisma.productCategory.deleteMany({
      where: {
        productId: product.id,
        category: {
          slug: { in: FRONTEND_CATEGORY_SLUGS },
        },
      },
    });

    removed += removedCount.count;

    // Cria a associação correta
    await prisma.productCategory.upsert({
      where: {
        productId_categoryId: {
          productId: product.id,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        productId: product.id,
        categoryId: category.id,
      },
    });

    assigned++;
    console.log(`✅ ${product.name} → ${category.name}`);
  }

  console.log(`\n🎉 Concluído! ${assigned} produtos re-associados, ${removed} associações antigas removidas.`);
}

reassignMainCategories()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });