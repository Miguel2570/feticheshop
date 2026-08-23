import { prisma } from "@/lib/prisma";

async function associateBrands() {
  console.log("Iniciando associação de marcas...");

  // Buscar todas as marcas
  const brands = await prisma.brand.findMany();
  console.log(`Total de marcas: ${brands.length}`);

  for (const brand of brands) {
    // Buscar produtos sem marca que podem pertencer a esta marca
    const products = await prisma.product.findMany({
      where: {
        brandId: null,
        OR: [
          { name: { contains: brand.name, mode: "insensitive" } },
          // Adicione outras condições se necessário
        ],
      },
      select: { id: true, name: true },
    });

    if (products.length > 0) {
      console.log(`Associando ${products.length} produtos à marca "${brand.name}"`);
      
      for (const product of products) {
        await prisma.product.update({
          where: { id: product.id },
          data: { brandId: brand.id },
        });
      }
    } else {
      console.log(`Nenhum produto encontrado para a marca "${brand.name}"`);
    }
  }

  // Verificar quantos produtos ainda estão sem marca
  const productsWithoutBrand = await prisma.product.count({
    where: { brandId: null },
  });
  
  console.log(`Produtos ainda sem marca: ${productsWithoutBrand}`);
  console.log("Associação concluída!");
}

associateBrands()
  .catch(console.error)
  .finally(() => prisma.$disconnect());