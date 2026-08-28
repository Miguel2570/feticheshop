import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/product";

import { BackButton } from "@/components/product/BackButton";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { RelatedProducts } from "@/components/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      categories: { include: { category: true } },
      attributes: {
        include: {
          attributeValue: {
            include: { attribute: true },
          },
        },
      },
    },
  });

  if (!dbProduct) {
    notFound();
  }

  const product = mapProduct(dbProduct);
  const categoryIds = dbProduct.categories.map((cat) => cat.categoryId);

  let dbRelatedProducts = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      id: { not: dbProduct.id },
      categories: { some: { categoryId: { in: categoryIds } } },
    },
    include: {
      brand: true,
      images: { orderBy: { position: "asc" } },
      categories: { include: { category: true } },
      attributes: {
        include: {
          attributeValue: {
            include: { attribute: true },
          },
        },
      },
    },
    take: 8,
  });

  if (dbRelatedProducts.length < 4) {
    const remainingCount = 8 - dbRelatedProducts.length;

    const otherProducts = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: {
          not: dbProduct.id,
          notIn: dbRelatedProducts.map((p) => p.id),
        },
      },
      include: {
        brand: true,
        images: { orderBy: { position: "asc" } },
        categories: { include: { category: true } },
        attributes: {
          include: {
            attributeValue: {
              include: { attribute: true },
            },
          },
        },
      },
      take: remainingCount,
    });

    dbRelatedProducts = [...dbRelatedProducts, ...otherProducts];
  }

  const relatedProducts = dbRelatedProducts.map(mapProduct);

  return (
    <main className="arabesque-bg relative overflow-hidden">
      {/* ✅ Botão voltar - vai para a página anterior */}
      <div className="container-custom pt-8">
        <BackButton />
      </div>

      {/* Produto principal */}
      <section className="container-custom py-12">
        <div className="grid gap-16 lg:grid-cols-2">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
      </section>

      {/* Tabs */}
      <ProductTabs product={product} />

      {/* Produtos Relacionados */}
      <RelatedProducts
        currentProductId={product.id}
        currentCategory={categoryIds.length > 0 ? product.category : undefined}
        products={relatedProducts}
      />

      {/* Benefícios */}
      <ProductActions />
    </main>
  );
}