import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/product";

import { BackButton } from "@/components/product/BackButton";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const productInclude = {
  brand: true,
  images: { orderBy: { position: "asc" as const } },
  categories: { include: { category: true } },
  attributes: {
    include: {
      attributeValue: { include: { attribute: true } },
    },
  },
  variants: {
    where: { isActive: true },
    include: {
      images: { orderBy: { position: "asc" as const } },
      attributeValues: {
        include: {
          attributeValue: { include: { attribute: true } },
        },
      },
    },
  },
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
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
    include: productInclude,
    take: 50,
  });

  if (dbRelatedProducts.length < 4) {
    const remainingCount = 50 - dbRelatedProducts.length;

    const otherProducts = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        id: {
          not: dbProduct.id,
          notIn: dbRelatedProducts.map((p) => p.id),
        },
      },
      include: productInclude,
      take: remainingCount,
    });

    dbRelatedProducts = [...dbRelatedProducts, ...otherProducts];
  }

  const relatedProducts = dbRelatedProducts.map(mapProduct);

  return (
    <main className="arabesque-bg relative overflow-x-hidden w-full">
      <div className="container-custom pt-4 sm:pt-8 w-full">
        <BackButton />
      </div>

      {/* Título e categoria - visível apenas em mobile */}
      <div className="container-custom pt-4 lg:hidden w-full">
        <span className="text-xs font-medium uppercase tracking-wider text-pink-500">
          {product.category || "Produto"}
        </span>

        <h1 className="mt-2 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl break-words">
          {product.name}
        </h1>
      </div>

      {/* Produto principal — agora com wrapper cliente */}
      <section className="container-custom py-6 sm:py-12 w-full">
        <ProductDetailClient product={product} />
      </section>

      <ProductTabs product={product} />

      <section className="container-custom py-16 sm:py-20 w-full">
        <div className="mb-10 text-center">
          <p className="section-eyebrow">Avaliações</p>
          <h2 className="section-title mt-4">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              O que os clientes dizem
            </span>
          </h2>
        </div>

        <ProductReviews slug={product.slug} />
      </section>

      <RelatedProducts
        currentProductId={product.id}
        currentCategory={categoryIds.length > 0 ? product.category : undefined}
        products={relatedProducts}
      />

      <ProductActions />
    </main>
  );
}