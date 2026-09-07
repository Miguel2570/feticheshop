import { prisma } from "@/lib/prisma";

async function associateBrandsFromDreamlove() {
  console.log("🔗 A associar marcas via Dreamlove...");

  const supplierProducts = await prisma.supplierProduct.findMany({
    where: {
      product: { brandId: null },
    },
    select: {
      productId: true,
      rawData: true,
    },
  });

  console.log(`Produtos a processar: ${supplierProducts.length}`);

  let associated = 0;

  for (const sp of supplierProducts) {
    if (!sp.rawData || !sp.productId) continue;

    const raw = sp.rawData as Record<string, unknown>;
    const brandData = raw.brand as { id?: number; name?: string } | undefined;

    if (!brandData?.name) continue;

    const brand = await prisma.brand.findFirst({
      where: {
        OR: [
          { name: { equals: brandData.name, mode: "insensitive" } },
          ...(brandData.id ? [{ dreamloveId: brandData.id }] : []),
        ],
      },
    });

    if (brand) {
      await prisma.product.update({
        where: { id: sp.productId },
        data: { brandId: brand.id },
      });
      associated++;
    }
  }

  console.log(`✅ Marcas associadas: ${associated}`);
}

associateBrandsFromDreamlove()
  .catch(console.error)
  .finally(() => prisma.$disconnect());