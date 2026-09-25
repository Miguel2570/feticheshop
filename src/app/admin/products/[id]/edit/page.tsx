// app/admin/products/[id]/edit/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { ProductEditForm } from "@/components/admin/products/ProductEditForm";
import { ProductImagesManager } from "@/components/admin/products/ProductImagesManager";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  if (!product) notFound();

  // Todas as categorias ativas (raiz + filhas)
  const categories = await prisma.category.findMany({
    where: { deletedAt: null, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const currentCategoryIds = product.categories.map((c) => c.categoryId);

  const plainProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    ean: product.ean,
    shortDescription: product.shortDescription,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    stock: product.stock,
    physicalStock: product.physicalStock,
    supplierStock: product.supplierStock,
    stockMode: product.stockMode,
    status: product.status,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
    // NOVOS
    categoryIds: currentCategoryIds,
    categorySource: product.categorySource,
    categoryReason: product.categoryReason,
  };

  const plainImages = product.images.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    position: img.position,
    isPrimary: img.isPrimary,
  }));

  return (
    <div className="space-y-6 text-zinc-900" style={{ color: "#18181b" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Editar Produto</h1>
          <p className="mt-1 text-zinc-500">{product.name}</p>
        </div>

        <Link
          href={`/admin/products/${product.id}`}
          className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
        >
          ← Voltar
        </Link>
      </div>

      <ProductEditForm
        product={plainProduct}
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parentId: c.parentId,
        }))}
      />

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              Imagens do Produto ({plainImages.length})
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Define qual é a imagem principal e remove as que não queres.
            </p>
          </div>
        </div>

        <ProductImagesManager productId={product.id} images={plainImages} />
      </div>
    </div>
  );
}