// components/admin/products/ProductsTable.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Star,
  Trash2,
} from "lucide-react";

import { Prisma } from "@prisma/client";

import { ProductStatusBadge } from "./ProductStatusBadge";
import { ToggleFeaturedButton } from "./ToggleFeaturedButton";

// Tipo atualizado para converter Decimal para number
type ProductTableItem = Omit<
  Prisma.ProductGetPayload<{
    include: {
      brand: true;
      images: {
        where: { isPrimary: true };
        take: 1;
      };
      categories: {
        include: { category: true };
      };
      variants: true;
    };
  }>,
  'price' | 'comparePrice' | 'costPrice'
> & {
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
};

interface ProductsTableProps {
  products: ProductTableItem[];
}

export function ProductsTable({
  products,
}: ProductsTableProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-zinc-200
        bg-white
        shadow-sm
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr className="text-left">
              <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                Produto
              </th>
              <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                Marca
              </th>
              <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                Preço
              </th>
              <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                Stock
              </th>
              <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                Estado
              </th>
              <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>
                Destaque
              </th>
              <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-zinc-100 hover:bg-pink-50/30 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-100">
                      {product.images.length ? (
                        <Image
                          fill
                          alt={product.name}
                          src={product.images[0].url}
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package className="text-zinc-400" size={22} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: "#18181b" }}>
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs" style={{ color: "#a1a1aa" }}>
                        {product.sku ?? "Sem SKU"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                  {product.brand?.name ?? "-"}
                </td>

                <td className="p-4 font-semibold" style={{ color: "#18181b" }}>
                  €{product.price.toFixed(2)}
                </td>

                <td className="p-4">
                  {product.stock === 0 ? (
                    <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-500">
                      Sem stock
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-600">
                      {product.stock} (baixo)
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {product.stock}
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <ProductStatusBadge status={product.status} />
                </td>

                {/* ✅ COLUNA DE DESTAQUE */}
                <td className="p-4">
                  <div className="flex justify-center">
                    <ToggleFeaturedButton
                      id={product.id}
                      featured={product.isFeatured}
                    />
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
                      title="Ver"
                    >
                      <Eye size={15} />
                    </Link>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
                      title="Editar"
                    >
                      <Edit size={15} />
                    </Link>

                    <button
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white text-zinc-700 border border-zinc-200 hover:border-red-300 hover:text-red-500 transition"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center" style={{ color: "#71717a" }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}