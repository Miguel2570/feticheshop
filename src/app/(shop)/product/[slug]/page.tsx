import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/product";

import { BackButton } from "@/components/product/BackButton";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductReviews } from "@/components/product/ProductReviews";
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
    <main className="arabesque-bg relative overflow-x-hidden w-full">
      {/* Botão voltar */}
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

      {/* Produto principal */}
      <section className="container-custom py-6 sm:py-12 w-full">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 w-full">
          <div className="w-full min-w-0 order-2 lg:order-1">
            <ProductGallery images={product.images} />
          </div>
          
          <div className="w-full min-w-0 order-3 lg:order-2">
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      {/* Tabs (sem Avaliações) */}
      <ProductTabs product={product} />

      {/* ✅ SECÇÃO DE AVALIAÇÕES SEPARADA */}
      <section className="container-custom py-16 sm:py-20 w-full">
        <div className="mb-10 text-center">
          <p className="section-eyebrow">Avaliações</p>
          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              O que os clientes dizem
            </span>
          </h2>
        </div>

        <ProductReviews slug={product.slug} />
      </section>

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