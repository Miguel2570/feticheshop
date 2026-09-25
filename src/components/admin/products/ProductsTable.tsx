// components/admin/products/ProductsTable.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Edit,
  Eye,
  Package,
  Trash2,
  Layers,      // ✅ NOVO
  Ghost,       // ✅ NOVO (órfãos)
  Crown,       // ✅ NOVO (canónicos)
} from "lucide-react";

import { Prisma } from "@prisma/client";

import { ProductStatusBadge } from "./ProductStatusBadge";
import { ToggleFeaturedButton } from "./ToggleFeaturedButton";
import { ToggleProductStatusButton } from "./ToggleProductStatusButton";

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
    };
  }>,
  "price" | "comparePrice" | "costPrice"
> & {
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  variantCount?: number;   // ✅ NOVO
  isOrphan?: boolean;      // ✅ NOVO
};

interface ProductsTableProps {
  products: ProductTableItem[];
}

function calculateMargin(salePrice: number, costPrice: number): number {
  if (costPrice === 0 || !costPrice) return 0;
  return ((salePrice - costPrice) / salePrice) * 100;
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr className="text-left">
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Produto
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Marca
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Preço Venda
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Preço Custo
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Margem
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Stock
              </th>
              <th
                className="p-4 text-center text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Variantes
              </th>
              <th
                className="p-4 text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Estado
              </th>
              <th
                className="p-4 text-center text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Visibilidade
              </th>
              <th
                className="p-4 text-center text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Destaque
              </th>
              <th
                className="p-4 text-right text-sm font-semibold"
                style={{ color: "#52525b" }}
              >
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const margin = product.costPrice
                ? calculateMargin(product.price, product.costPrice)
                : null;

              const variantCount = product.variantCount ?? 0;
              const isOrphan = product.isOrphan ?? false;

              return (
                <tr
                  key={product.id}
                  className="border-b border-zinc-100 hover:bg-pink-50/30 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-100 shrink-0">
                        {product.images.length ? (
                          <Image
                            fill
                            alt={product.name}
                            unoptimized
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
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3
                            className="truncate font-medium"
                            style={{ color: "#18181b" }}
                          >
                            {product.name}
                          </h3>

                          {/* ✅ Badge órfão */}
                          {isOrphan && (
                            <span
                              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-600"
                              title="Órfão (merged, escondido)"
                            >
                              <Ghost size={10} />
                              Órfão
                            </span>
                          )}

                          {/* ✅ Badge canónico (com 2+ variantes) */}
                          {!isOrphan && variantCount >= 2 && (
                            <span
                              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2 py-0.5 text-[10px] font-semibold text-pink-600"
                              title="Produto canónico com variantes"
                            >
                              <Crown size={10} />
                              Grupo
                            </span>
                          )}
                        </div>

                        <p
                          className="mt-0.5 text-xs"
                          style={{ color: "#a1a1aa" }}
                        >
                          {product.sku ?? "Sem SKU"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                    {product.brand?.name ?? "-"}
                  </td>

                  <td
                    className="p-4 font-semibold"
                    style={{ color: "#18181b" }}
                  >
                    €{product.price.toFixed(2)}
                  </td>

                  <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                    {product.costPrice ? (
                      <>€{product.costPrice.toFixed(2)}</>
                    ) : (
                      <span style={{ color: "#d4d4d8" }}>-</span>
                    )}
                  </td>

                  <td className="p-4">
                    {margin !== null ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                          margin >= 30
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : margin >= 15
                            ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                            : "bg-red-50 border-red-200 text-red-500"
                        }`}
                      >
                        {margin.toFixed(0)}%
                      </span>
                    ) : (
                      <span style={{ color: "#d4d4d8" }}>-</span>
                    )}
                  </td>

                  <td className="p-4">
                    {product.stock === 0 ? (
                      <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-500">
                        Sem stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 text-xs font-semibold text-yellow-600">
                        {product.stock}
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {product.stock}
                      </span>
                    )}
                  </td>

                  {/* ✅ NOVA COLUNA - VARIANTES */}
                  <td className="p-4 text-center">
                    {variantCount === 0 ? (
                      <span
                        className="inline-block text-xs font-medium"
                        style={{ color: "#d4d4d8" }}
                      >
                        —
                      </span>
                    ) : variantCount === 1 ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-600"
                        title="Só 1 variante (não é grupo)"
                      >
                        1
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-1 text-[11px] font-bold text-pink-600"
                        title={`${variantCount} variantes`}
                      >
                        <Layers size={11} />
                        {variantCount}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <ProductStatusBadge status={product.status} />
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center">
                      <ToggleProductStatusButton
                        id={product.id}
                        active={product.status === "ACTIVE"}
                      />
                    </div>
                  </td>

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
              );
            })}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="p-10 text-center"
                  style={{ color: "#71717a" }}
                >
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