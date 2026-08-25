// components/admin/products/ProductsMobile.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { ProductStatus } from "@prisma/client";

import { ProductStatusBadge } from "./ProductStatusBadge";
import { ToggleFeaturedButton } from "./ToggleFeaturedButton";
import { ToggleProductStatusButton } from "./ToggleProductStatusButton";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  status: ProductStatus;
  isFeatured: boolean;
  brand: {
    name: string;
  } | null;
  categories: {
    category: {
      name: string;
    };
  }[];
  images: {
    url: string;
  }[];
}

interface ProductsMobileProps {
  products: Product[];
}

export function ProductsMobile({
  products,
}: ProductsMobileProps) {
  // =========================================================
  // SEM PRODUTOS
  // =========================================================

  if (products.length === 0) {
    return (
      <div
        className="
          flex
          min-h-[180px]
          w-full
          items-center
          justify-center
          px-4
          py-10
          text-center
          text-sm
        "
        style={{
          color: "#71717a",
        }}
      >
        Nenhum produto encontrado.
      </div>
    );
  }

  // =========================================================
  // LISTA
  // =========================================================

  return (
    <div className="w-full min-w-0 divide-y divide-zinc-100">
      {products.map((product) => (
        <div
          key={product.id}
          className="
            w-full
            min-w-0
            p-3
            sm:p-5
          "
        >
          {/* =================================================
              TOPO DO PRODUTO
          ================================================= */}

          <div
            className="
              flex
              w-full
              min-w-0
              items-start
              gap-3
            "
          >
            {/* -------------------------------------------------
                IMAGEM
            ------------------------------------------------- */}

            <div
              className="
                relative
                h-12
                w-12
                shrink-0
                overflow-hidden
                rounded-xl
                bg-zinc-100

                sm:h-14
                sm:w-14
              "
            >
              {product.images.length > 0 ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="
                    (max-width: 639px) 48px,
                    56px
                  "
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
                    text-zinc-400
                  "
                >
                  <Package
                    size={22}
                  />
                </div>
              )}
            </div>

            {/* -------------------------------------------------
                INFORMAÇÃO PRINCIPAL
            ------------------------------------------------- */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              {/* NOME */}

              <p
                className="
                  truncate
                  text-sm
                  font-semibold
                  leading-5

                  sm:text-base
                "
                style={{
                  color: "#18181b",
                }}
                title={product.name}
              >
                {product.name}
              </p>

              {/* SKU */}

              <p
                className="
                  mt-0.5
                  truncate
                  text-xs
                "
                style={{
                  color: "#a1a1aa",
                }}
                title={product.sku ?? "Sem SKU"}
              >
                {product.sku ?? "Sem SKU"}
              </p>

              {/* PREÇO */}

              <p
                className="
                  mt-1
                  text-sm
                  font-bold

                  sm:text-base
                "
                style={{
                  color: "#18181b",
                }}
              >
                €{product.price.toFixed(2)}
              </p>
            </div>

            {/* -------------------------------------------------
                ESTADO
            ------------------------------------------------- */}

            <div
              className="
                shrink-0
                max-w-[100px]
                sm:max-w-none
              "
            >
              <ProductStatusBadge
                status={product.status}
              />
            </div>
          </div>

          {/* =================================================
              INFORMAÇÃO
          ================================================= */}

          <div
            className="
              mt-4
              grid
              w-full
              min-w-0
              grid-cols-1
              gap-3
              rounded-xl
              bg-zinc-50
              p-3

              sm:grid-cols-2
              sm:p-4
            "
          >
            {/* -------------------------------------------------
                CATEGORIA
            ------------------------------------------------- */}

            <div className="min-w-0">
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                "
                style={{
                  color: "#a1a1aa",
                }}
              >
                Categoria
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                "
                style={{
                  color: "#52525b",
                }}
                title={
                  product.categories[0]
                    ?.category.name ?? "-"
                }
              >
                {product.categories[0]
                  ?.category.name ?? "-"}
              </p>
            </div>

            {/* -------------------------------------------------
                MARCA
            ------------------------------------------------- */}

            <div className="min-w-0">
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                "
                style={{
                  color: "#a1a1aa",
                }}
              >
                Marca
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                "
                style={{
                  color: "#52525b",
                }}
                title={
                  product.brand?.name ?? "-"
                }
              >
                {product.brand?.name ?? "-"}
              </p>
            </div>

            {/* -------------------------------------------------
                STOCK
            ------------------------------------------------- */}

            <div className="min-w-0">
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                "
                style={{
                  color: "#a1a1aa",
                }}
              >
                Stock
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-bold
                "
                style={{
                  color:
                    product.stock === 0
                      ? "#ef4444"
                      : product.stock <= 3
                      ? "#ca8a04"
                      : "#22c55e",
                }}
              >
                {product.stock === 0
                  ? "Sem stock"
                  : `${product.stock} unidades`}
              </p>
            </div>

            {/* -------------------------------------------------
                DESTAQUE
            ------------------------------------------------- */}

            <div className="min-w-0">
              <p
                className="
                  text-[11px]
                  font-medium
                  uppercase
                  tracking-wide
                "
                style={{
                  color: "#a1a1aa",
                }}
              >
                Destaque
              </p>

              <div className="mt-1">
                <ToggleFeaturedButton
                  id={product.id}
                  featured={
                    product.isFeatured
                  }
                />
              </div>
            </div>
          </div>
          <div
            className="
              mt-4
              grid
              w-full
              min-w-0
              grid-cols-1
              gap-2

              sm:flex
              sm:items-center
            "
          >
            {/* -------------------------------------------------
                VER PRODUTO
            ------------------------------------------------- */}

            <Link
              href={`/admin/products/${product.id}`}
              className="
                inline-flex
                h-10
                w-full
                min-w-0
                items-center
                justify-center
                rounded-xl
                bg-pink-500
                px-4
                text-sm
                font-semibold
                text-white
                transition-colors
                hover:bg-pink-600

                sm:flex-1
              "
            >
              Ver produto
            </Link>

            {/* -------------------------------------------------
                EDITAR + ESTADO
            ------------------------------------------------- */}

            <div
              className="
                grid
                w-full
                grid-cols-2
                gap-2

                sm:w-auto
                sm:flex
                sm:shrink-0
              "
            >
              {/* EDITAR */}

              <Link
                href={`/admin/products/${product.id}/edit`}
                className="
                  inline-flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-zinc-100
                  px-3
                  text-sm
                  font-semibold
                  text-zinc-700
                  transition-colors
                  hover:bg-zinc-200

                  sm:w-auto
                  sm:px-4
                "
              >
                Editar
              </Link>

              {/* ATIVAR / DESATIVAR */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  justify-center
                "
              >
                <ToggleProductStatusButton
                  id={product.id}
                  active={
                    product.status ===
                    "ACTIVE"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}