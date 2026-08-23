"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  brand?: {
    name: string;
  } | null;
  images: {
    url: string;
  }[];
}

interface Props {
  products: Product[];
}

export function RecentProducts({
  products,
}: Props) {
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
            Últimos Produtos
          </h2>

          <p 
            className="mt-2 text-sm"
            style={{ color: "#71717a" }}
          >
            Produtos adicionados recentemente
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
          Ver todos

          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
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
                {product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package
                      size={26}
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
                  {product.brand?.name ?? "Sem marca"}
                </p>

                <p 
                  className="text-xs"
                  style={{ color: "#a1a1aa" }}
                >
                  {product.sku ?? "Sem SKU"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p 
                  className="text-sm"
                  style={{ color: "#71717a" }}
                >
                  Stock
                </p>

                <p 
                  className="font-semibold"
                  style={{ color: "#18181b" }}
                >
                  {product.stock}
                </p>
              </div>

              <div className="text-right">
                <p 
                  className="text-sm"
                  style={{ color: "#71717a" }}
                >
                  Preço
                </p>

                <p className="font-semibold text-pink-500">
                  €{Number(product.price).toFixed(2)}
                </p>
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
              size={40}
              className="mx-auto mb-4 text-zinc-400"
            />

            <h3 
              className="text-lg font-semibold"
              style={{ color: "#18181b" }}
            >
              Sem produtos
            </h3>

            <p 
              className="mt-2"
              style={{ color: "#71717a" }}
            >
              Ainda não existem produtos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}