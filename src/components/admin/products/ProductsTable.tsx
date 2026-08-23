"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Trash2,
} from "lucide-react";

import { Prisma } from "@prisma/client";

import { ProductStatusBadge } from "./ProductStatusBadge";

type ProductTableItem = Prisma.ProductGetPayload<{
  include: {
    brand: true;

    images: {
      where: {
        isPrimary: true;
      };
      take: 1;
    };

    categories: {
      include: {
        category: true;
      };
    };

    variants: true;
  };
}>;

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
        rounded-3xl
        border
        border-zinc-800
        bg-[#111]
      "
    >
      <table className="w-full">
        <thead className="border-b border-zinc-800">
          <tr className="text-left">
            <th className="w-12 p-5">
              <input
                type="checkbox"
                className="rounded"
              />
            </th>

            <th className="p-5 text-sm font-semibold text-zinc-400">
              Produto
            </th>

            <th className="p-5 text-sm font-semibold text-zinc-400">
              Marca
            </th>

            <th className="p-5 text-sm font-semibold text-zinc-400">
              Preço
            </th>

            <th className="p-5 text-sm font-semibold text-zinc-400">
              Stock
            </th>

            <th className="p-5 text-sm font-semibold text-zinc-400">
              Estado
            </th>

            <th className="w-40 p-5" />
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="
                border-b
                border-zinc-800
                transition
                hover:bg-zinc-900/40
              "
            >
              <td className="p-5">
                <input
                  type="checkbox"
                  className="rounded"
                />
              </td>

              <td className="p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      relative
                      h-16
                      w-16
                      overflow-hidden
                      rounded-2xl
                      bg-zinc-900
                    "
                  >
                    {product.images.length ? (
                      <Image
                        fill
                        alt={product.name}
                        src={product.images[0].url}
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                        "
                      >
                        <Package
                          className="text-zinc-600"
                          size={24}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {product.sku ?? "Sem SKU"}
                    </p>
                  </div>
                </div>
              </td>

              <td className="p-5 text-zinc-300">
                {product.brand?.name ?? "-"}
              </td>

              <td className="p-5 font-semibold text-white">
                €{Number(product.price).toFixed(2)}
              </td>

              <td className="p-5">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    product.stock <= 5
                      ? "bg-red-500/10 text-red-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {product.stock}
                </span>
              </td>

              <td className="p-5">
                <ProductStatusBadge
                  status={product.status}
                />
              </td>

              <td className="p-5">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="
                      rounded-xl
                      border
                      border-zinc-700
                      p-2
                      text-zinc-300
                      transition
                      hover:border-pink-500
                      hover:text-white
                    "
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="
                      rounded-xl
                      border
                      border-zinc-700
                      p-2
                      text-zinc-300
                      transition
                      hover:border-sky-500
                      hover:text-white
                    "
                  >
                    <Edit size={18} />
                  </Link>

                  <button
                    className="
                      rounded-xl
                      border
                      border-zinc-700
                      p-2
                      text-zinc-300
                      transition
                      hover:border-red-500
                      hover:text-red-400
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    className="
                      rounded-xl
                      border
                      border-zinc-700
                      p-2
                      text-zinc-300
                    "
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}