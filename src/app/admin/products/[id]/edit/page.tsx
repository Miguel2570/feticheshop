import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { ProductEditForm } from "@/components/admin/products/ProductEditForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Converter Decimal para number
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
    stock: product.stock,
    physicalStock: product.physicalStock,
    supplierStock: product.supplierStock,
    stockMode: product.stockMode,
    status: product.status,
    isFeatured: product.isFeatured,
    isNew: product.isNew,
    isOnSale: product.isOnSale,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
            Editar Produto
          </h1>
          <p className="text-zinc-500 mt-1">{product.name}</p>
        </div>

        <Link
          href={`/admin/products/${product.id}`}
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            bg-zinc-100 text-zinc-700 hover:bg-zinc-200
          "
        >
          ← Voltar
        </Link>
      </div>

      <ProductEditForm product={plainProduct} />
    </div>
  );
}