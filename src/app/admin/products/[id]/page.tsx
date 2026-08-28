// app/admin/products/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/product";
import { ProductStatus } from "@prisma/client";

import { ToggleProductStatusButton } from "@/components/admin/products/ToggleProductStatusButton";
import { ToggleFeaturedButton } from "@/components/admin/products/ToggleFeaturedButton";
import { TabsView } from "@/components/admin/products/TabsView";

import {
  ArrowLeft,
  Package,
  Star,
} from "lucide-react";

// =========================================================
// CATEGORIAS DO FRONTEND
// =========================================================

const FRONTEND_CATEGORY_SLUGS = [
  "sex-toys",
  "para-ele",
  "essenciais",
  "roupa",
  "bdsm",
  "vibradores",
  "dildos",
  "sugadores",
  "bolas-anales",
  "estimuladores",
  "masturbadores",
  "aneis-penianos",
  "estimulantes",
  "lubrificantes",
  "afrodisiacos",
  "jogos-eroticos",
  "lingerie-sexy",
  "bodystocking",
  "bikinis",
  "bondage",
  "acessorios-bdsm",
  "baterias-acessorios",
  "vapers-eletronicos",
];

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // =========================================================
  // PRODUTO
  // =========================================================

  const dbProduct =
    await prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        brand: true,

        images: {
          orderBy: {
            position: "asc",
          },
        },

        categories: {
          include: {
            category: true,
          },
        },

        attributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },

        variants: {
          include: {
            attributeValues: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!dbProduct) {
    notFound();
  }

  const product = mapProduct(dbProduct);

  // =========================================================
  // IMAGENS
  // =========================================================

  const primaryImage =
    dbProduct.images.find(
      (img) => img.isPrimary
    )?.url ??
    dbProduct.images[0]?.url ??
    null;

  const otherImages =
    dbProduct.images.filter(
      (img) => img.url !== primaryImage
    );

  // =========================================================
  // ESTADOS
  // =========================================================

  const statusLabels: Record<
    ProductStatus,
    string
  > = {
    DRAFT: "Rascunho",
    ACTIVE: "Ativo",
    HIDDEN: "Oculto",
    OUT_OF_STOCK: "Sem Stock",
    ARCHIVED: "Arquivado",
  };

  const statusBadgeColors: Record<
    ProductStatus,
    string
  > = {
    DRAFT:
      "bg-zinc-50 text-zinc-600 border-zinc-200",

    ACTIVE:
      "bg-emerald-50 text-emerald-600 border-emerald-200",

    HIDDEN:
      "bg-yellow-50 text-yellow-600 border-yellow-200",

    OUT_OF_STOCK:
      "bg-red-50 text-red-500 border-red-200",

    ARCHIVED:
      "bg-slate-50 text-slate-500 border-slate-200",
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        space-y-4

        sm:space-y-5

        lg:space-y-6
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          flex-col
          gap-3

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* ---------------------------------------------------
            TÍTULO + VOLTAR
        --------------------------------------------------- */}

        <div
          className="
            flex
            min-w-0
            max-w-full
            items-center
            gap-3
          "
        >
          <Link
            href="/admin/products"
            className="
              inline-flex
              h-9
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              bg-pink-500
              px-3
              text-xs
              font-semibold
              text-white
              transition-all
              duration-200

              hover:bg-pink-600
              hover:shadow-lg
              hover:shadow-pink-500/25
            "
          >
            <ArrowLeft size={14} />
            <span>Voltar</span>
          </Link>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-lg
                font-bold

                sm:text-xl
              "
              style={{
                color: "#18181b",
              }}
            >
              {product.name}
            </h1>

            <p
              className="
                truncate
                text-xs
              "
              style={{
                color: "#71717a",
              }}
            >
              {product.sku || "Sem SKU"}
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------
            AÇÕES
        --------------------------------------------------- */}

        <div
          className="
            flex
            w-full
            min-w-0
            flex-wrap
            items-center
            gap-2

            sm:w-auto
            sm:shrink-0
          "
        >
          <ToggleFeaturedButton
            id={dbProduct.id}
            featured={dbProduct.isFeatured}
          />

          <ToggleProductStatusButton
            id={dbProduct.id}
            active={
              dbProduct.status === "ACTIVE"
            }
          />
        </div>
      </div>

      {/* =====================================================
          GRID PRINCIPAL
      ===================================================== */}

      <div
        className="
          grid
          w-full
          min-w-0
          max-w-full
          gap-4

          lg:grid-cols-[280px_minmax(0,1fr)]
          lg:gap-5
        "
      >
        {/* ===================================================
            ESQUERDA — GALERIA
        =================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
            space-y-3
          "
        >
          {/* IMAGEM PRINCIPAL */}

          <div
            className="
              w-full
              min-w-0
              overflow-hidden
              rounded-xl
              border
              border-zinc-200
              bg-white
              p-3
              shadow-sm
            "
          >
            <div
              className="
                relative
                w-full
                max-w-full
                overflow-hidden
                rounded-lg
              "
            >
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="
                    h-auto
                    w-full
                    max-w-full
                    object-contain
                  "
                  priority
                />
              ) : (
                <div
                  className="
                    flex
                    h-48
                    w-full
                    items-center
                    justify-center
                  "
                >
                  <Package
                    size={40}
                    className="text-zinc-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* OUTRAS IMAGENS */}

          {otherImages.length > 0 && (
            <div
              className="
                flex
                max-w-full
                flex-wrap
                gap-2
                overflow-hidden
              "
            >
              {otherImages.map(
                (image) => (
                  <div
                    key={image.id}
                    className="
                      relative
                      h-14
                      w-14
                      shrink-0
                      overflow-hidden
                      rounded-lg
                      border
                      border-zinc-200
                      bg-white

                      sm:h-16
                      sm:w-16
                    "
                  >
                    <Image
                      src={image.url}
                      alt={
                        image.alt ??
                        product.name
                      }
                      fill
                      sizes="64px"
                      className="
                        object-contain
                        p-1.5
                      "
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* ===================================================
            DIREITA — INFORMAÇÕES
        =================================================== */}

        <div
          className="
            flex
            min-w-0
            max-w-full
            flex-col
            gap-3
          "
        >
          <span
            className="
              max-w-full
              truncate
              text-xs
              font-medium
              uppercase
              tracking-wider
              text-pink-500
            "
          >
            {product.category ||
              "Produto"}
          </span>

          <h2
            className="
              break-words
              text-xl
              font-bold
              leading-tight

              sm:text-2xl
            "
            style={{
              color: "#18181b",
            }}
          >
            {product.name}
          </h2>

          {product.brand && (
            <p
              className="
                break-words
                text-sm
              "
              style={{
                color: "#71717a",
              }}
            >
              {product.brand}
            </p>
          )}

          {/* AVALIAÇÃO */}

          <div
            className="
              flex
              min-w-0
              flex-wrap
              items-center
              gap-3
            "
          >
            <div className="flex shrink-0 gap-0.5">
              {Array.from({
                length: 5,
              }).map(
                (_, index) => (
                  <Star
                    key={index}
                    size={14}
                    fill={
                      index <
                      Math.round(
                        product.rating || 0
                      )
                        ? "#FF2E88"
                        : "transparent"
                    }
                    className={
                      index <
                      Math.round(
                        product.rating || 0
                      )
                        ? "text-pink-500"
                        : "text-zinc-300"
                    }
                  />
                )
              )}
            </div>

            <span
              className="
                text-xs
              "
              style={{
                color: "#71717a",
              }}
            >
              {(product.rating || 0).toFixed(
                1
              )}{" "}
              ({product.reviews || 0})
            </span>
          </div>

          {/* PREÇO */}

          <div
            className="
              flex
              min-w-0
              flex-wrap
              items-end
              gap-3
            "
          >
            <span
              className="
                text-2xl
                font-bold

                sm:text-3xl
              "
              style={{
                color: "#18181b",
              }}
            >
              €{product.price.toFixed(2)}
            </span>

            {product.oldPrice &&
              product.oldPrice >
                product.price && (
                <span
                  className="
                    pb-0.5
                    text-sm
                    text-zinc-400
                    line-through

                    sm:text-base
                  "
                >
                  €
                  {product.oldPrice.toFixed(
                    2
                  )}
                </span>
              )}
          </div>

          {/* STOCK + ESTADO */}

          <div
            className="
              flex
              min-w-0
              flex-wrap
              items-center
              gap-2
            "
          >
            {product.stock ? (
              <span
                className="
                  inline-block
                  shrink-0
                  rounded-full
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-emerald-600
                "
              >
                ✓ Em Stock
              </span>
            ) : (
              <span
                className="
                  inline-block
                  shrink-0
                  rounded-full
                  border
                  border-red-200
                  bg-red-50
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-red-500
                "
              >
                Esgotado
              </span>
            )}

            <span
              className={`
                inline-flex
                max-w-full
                shrink-0
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-semibold

                ${statusBadgeColors[
                  dbProduct.status
                ]}
              `}
            >
              {statusLabels[
                dbProduct.status
              ]}
            </span>
          </div>

          {/* METADADOS */}

          <div
            className="
              min-w-0
              max-w-full
              space-y-1.5
              border-t
              border-zinc-100
              pt-3
            "
          >
            <p
              className="
                break-words
                text-xs
              "
              style={{
                color: "#71717a",
              }}
            >
              Criado:{" "}
              {new Date(
                dbProduct.createdAt
              ).toLocaleDateString(
                "pt-PT"
              )}
            </p>

            <p
              className="
                break-words
                text-xs
              "
              style={{
                color: "#71717a",
              }}
            >
              Atualizado:{" "}
              {new Date(
                dbProduct.updatedAt
              ).toLocaleDateString(
                "pt-PT"
              )}
            </p>

            <p
              className="
                break-all
                text-xs
              "
              style={{
                color: "#71717a",
              }}
            >
              SKU:{" "}
              {product.sku || "-"}{" "}
              | EAN:{" "}
              {dbProduct.ean ?? "-"}
            </p>
          </div>
        </div>
      </div>
            {/* =====================================================
          TABS
      ===================================================== */}

      <div
        className="
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-xl
          border
          border-pink-100
          bg-white
          p-3
          shadow-sm

          sm:p-5
        "
      >
        <div className="w-full min-w-0 max-w-full">
          <TabsView product={product} />
        </div>
      </div>

      {/* =====================================================
          CATEGORIAS
      ===================================================== */}

      <div
        className="
          w-full
          min-w-0
          max-w-full
          overflow-hidden
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-4
          shadow-sm

          sm:p-5
        "
      >
        <h2
          className="
            text-base
            font-bold
          "
          style={{
            color: "#18181b",
          }}
        >
          Categorias
        </h2>

        <div
          className="
            mt-3
            flex
            max-w-full
            flex-wrap
            gap-1.5
            overflow-hidden
          "
        >
          {dbProduct.categories.filter(
            ({ category }) =>
              FRONTEND_CATEGORY_SLUGS.includes(
                category.slug
              )
          ).length > 0 ? (
            dbProduct.categories
              .filter(
                ({ category }) =>
                  FRONTEND_CATEGORY_SLUGS.includes(
                    category.slug
                  )
              )
              .map(
                ({ category }) => (
                  <span
                    key={category.id}
                    className="
                      max-w-full
                      break-words
                      rounded-full
                      border
                      border-pink-200
                      bg-pink-50
                      px-3
                      py-1
                      text-xs
                      font-medium
                      text-pink-600
                    "
                  >
                    {category.name}
                  </span>
                )
              )
          ) : (
            <span
              className="text-xs"
              style={{
                color: "#71717a",
              }}
            >
              Sem categoria principal
            </span>
          )}
        </div>
      </div>

      {/* =====================================================
          VARIANTES
      ===================================================== */}

      {dbProduct.variants.length > 0 && (
        <div
          className="
            w-full
            min-w-0
            max-w-full
            overflow-hidden
            rounded-xl
            border
            border-zinc-200
            bg-white
            p-4
            shadow-sm

            sm:p-5
          "
        >
          <h2
            className="
              text-base
              font-bold
            "
            style={{
              color: "#18181b",
            }}
          >
            Variantes (
            {dbProduct.variants.length})
          </h2>

          <div
            className="
              mt-3
              min-w-0
              max-w-full
              space-y-2
            "
          >
            {dbProduct.variants.map(
              (variant) => (
                <div
                  key={variant.id}
                  className="
                    flex
                    min-w-0
                    max-w-full
                    flex-col
                    gap-2
                    rounded-lg
                    border
                    border-zinc-200
                    px-3
                    py-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-3.5
                    sm:py-2.5
                  "
                >
                  {/* INFORMAÇÃO DA VARIANTE */}

                  <div
                    className="
                      min-w-0
                      max-w-full
                    "
                  >
                    <p
                      className="
                        break-words
                        text-sm
                        font-medium
                      "
                      style={{
                        color: "#18181b",
                      }}
                    >
                      {variant.name}
                    </p>

                    <p
                      className="
                        break-words
                        text-xs
                      "
                      style={{
                        color: "#71717a",
                      }}
                    >
                      {variant.attributeValues
                        .map(
                          (av) =>
                            av
                              .attributeValue
                              .value
                        )
                        .join(" / ")}
                    </p>
                  </div>

                  {/* PREÇO + STOCK */}

                  <div
                    className="
                      min-w-0
                      shrink-0

                      sm:text-right
                    "
                  >
                    <p
                      className="
                        text-sm
                        font-semibold
                      "
                      style={{
                        color: "#18181b",
                      }}
                    >
                      €
                      {Number(
                        variant.price ??
                          dbProduct.price
                      ).toFixed(2)}
                    </p>

                    <p
                      className={`
                        text-xs
                        font-medium

                        ${
                          variant.stock === 0
                            ? "text-red-500"
                            : "text-emerald-600"
                        }
                      `}
                    >
                      {variant.stock}{" "}
                      em stock
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}