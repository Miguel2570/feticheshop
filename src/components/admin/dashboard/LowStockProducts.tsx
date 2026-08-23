"use client";

import Image from "next/image";
import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  Package,
} from "lucide-react";

interface LowStockProductsProps {
  products: {
    id: string;
    name: string;
    sku: string | null;
    stock: number;
    image?: string | null;
  }[];
}

export function LowStockProducts({
  products,
}: LowStockProductsProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            Stock Baixo
          </h2>

          <p 
            className="mt-2 text-sm"
            style={{ color: "#71717a" }}
          >
            Produtos que precisam de reposição
          </p>
        </div>

        <Link
          href="/admin/products"
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-zinc-200
            bg-white
            px-5
            py-2
            text-sm
            text-zinc-700
            transition
            hover:border-pink-300
            hover:bg-pink-50
            hover:text-pink-500
          "
        >
          Ver produtos

          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-50
              p-4
              transition
              hover:border-pink-300
              hover:bg-pink-50/50
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  relative
                  h-16
                  w-16
                  overflow-hidden
                  rounded-2xl
                  bg-zinc-100
                "
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                    "
                  >
                    <Package
                      size={28}
                      className="text-zinc-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <h3 
                  className="font-semibold"
                  style={{ color: "#18181b" }}
                >
                  {product.name}
                </h3>

                <p 
                  className="mt-1 text-sm"
                  style={{ color: "#71717a" }}
                >
                  {product.sku ?? "Sem SKU"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-2
                  text-red-500
                "
              >
                <AlertTriangle size={16} />

                <span className="font-semibold">
                  {product.stock}
                </span>
              </div>

              <Link
                href={`/admin/products/${product.id}`}
                className="
                  rounded-xl
                  bg-pink-500
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                Editar
              </Link>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-zinc-300
              py-12
              text-center
            "
          >
            <Package
              className="mx-auto mb-4 text-zinc-400"
              size={40}
            />

            <h3 
              className="text-lg font-semibold"
              style={{ color: "#18181b" }}
            >
              Sem produtos críticos
            </h3>

            <p 
              className="mt-2"
              style={{ color: "#71717a" }}
            >
              Todo o stock está acima do limite definido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}