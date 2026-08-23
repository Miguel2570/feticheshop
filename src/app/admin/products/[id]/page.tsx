import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { mapProduct } from "@/lib/mappers/product";
import { ProductStatus } from "@prisma/client";

import { ToggleProductStatusButton } from "@/actions/products/ToggleProductStatusButton";
import { ToggleFeaturedButton } from "@/actions/products/ToggleFeaturedButton";
import { TabsView } from "@/components/admin/products/TabsView";

import { ArrowLeft, Package, Star } from "lucide-react";

// Categorias do frontend
const FRONTEND_CATEGORY_SLUGS = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
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

  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      images: {
        orderBy: { position: "asc" },
      },
      categories: {
        include: { category: true },
      },
      attributes: {
        include: {
          attributeValue: {
            include: { attribute: true },
          },
        },
      },
      variants: {
        include: {
          attributeValues: {
            include: {
              attributeValue: {
                include: { attribute: true },
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

  const primaryImage =
    dbProduct.images.find((img) => img.isPrimary)?.url ??
    dbProduct.images[0]?.url ??
    null;

  const otherImages = dbProduct.images.filter(
    (img) => img.url !== primaryImage
  );

  const statusLabels: Record<ProductStatus, string> = {
    DRAFT: "Rascunho",
    ACTIVE: "Ativo",
    HIDDEN: "Oculto",
    OUT_OF_STOCK: "Sem Stock",
    ARCHIVED: "Arquivado",
  };

  const statusBadgeColors: Record<ProductStatus, string> = {
    DRAFT: "bg-zinc-50 text-zinc-600 border-zinc-200",
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    HIDDEN: "bg-yellow-50 text-yellow-600 border-yellow-200",
    OUT_OF_STOCK: "bg-red-50 text-red-500 border-red-200",
    ARCHIVED: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="
                flex items-center gap-1.5
                h-9 px-4 text-xs font-semibold rounded-lg
                transition-all duration-200 cursor-pointer
                bg-pink-500 text-white
                hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
            "
            >
            <ArrowLeft size={14} />
            Voltar
            </Link>

          <div>
            <h1 className="text-xl font-bold" style={{ color: "#18181b" }}>
              {product.name}
            </h1>
            <p className="text-xs" style={{ color: "#71717a" }}>
              {product.sku || "Sem SKU"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ToggleFeaturedButton
            id={dbProduct.id}
            featured={dbProduct.isFeatured}
          />
          <ToggleProductStatusButton
            id={dbProduct.id}
            active={dbProduct.status === "ACTIVE"}
          />
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* ESQUERDA - GALERIA */}
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="relative w-full overflow-hidden rounded-lg">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-contain w-full h-auto"
                  priority
                />
              ) : (
                <div className="flex h-48 items-center justify-center">
                  <Package size={40} className="text-zinc-300" />
                </div>
              )}
            </div>
          </div>

          {otherImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherImages.map((image) => (
                <div
                  key={image.id}
                  className="relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200 bg-white"
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-1.5"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIREITA - INFORMAÇÕES */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-pink-500">
            {product.category || "Produto"}
          </span>

          <h2 className="text-2xl font-bold leading-tight" style={{ color: "#18181b" }}>
            {product.name}
          </h2>

          {product.brand && (
            <p className="text-sm" style={{ color: "#71717a" }}>
              {product.brand}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  fill={index < Math.round(product.rating || 0) ? "#FF2E88" : "transparent"}
                  className={
                    index < Math.round(product.rating || 0)
                      ? "text-pink-500"
                      : "text-zinc-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs" style={{ color: "#71717a" }}>
              {(product.rating || 0).toFixed(1)} ({product.reviews || 0})
            </span>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold" style={{ color: "#18181b" }}>
              €{product.price.toFixed(2)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="pb-0.5 text-base text-zinc-400 line-through">
                €{product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {product.stock ? (
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 border border-emerald-200">
                ✓ Em Stock
              </span>
            ) : (
              <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500 border border-red-200">
                Esgotado
              </span>
            )}

            <span
              className={`
                inline-flex rounded-full border px-3 py-1 text-xs font-semibold
                ${statusBadgeColors[dbProduct.status]}
              `}
            >
              {statusLabels[dbProduct.status]}
            </span>
          </div>

          <div className="border-t border-zinc-100 pt-3 space-y-1.5">
            <p className="text-xs" style={{ color: "#71717a" }}>
              Criado: {new Date(dbProduct.createdAt).toLocaleDateString("pt-PT")}
            </p>
            <p className="text-xs" style={{ color: "#71717a" }}>
              Atualizado: {new Date(dbProduct.updatedAt).toLocaleDateString("pt-PT")}
            </p>
            <p className="text-xs" style={{ color: "#71717a" }}>
              SKU: {product.sku || "-"} | EAN: {dbProduct.ean ?? "-"}
            </p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
        <TabsView product={product} />
      </div>

      {/* CATEGORIAS - apenas do frontend */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold" style={{ color: "#18181b" }}>
          Categorias
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dbProduct.categories.filter(
            ({ category }) => FRONTEND_CATEGORY_SLUGS.includes(category.slug)
          ).length > 0 ? (
            dbProduct.categories
              .filter(({ category }) => FRONTEND_CATEGORY_SLUGS.includes(category.slug))
              .map(({ category }) => (
                <span
                  key={category.id}
                  className="rounded-full bg-pink-50 border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600"
                >
                  {category.name}
                </span>
              ))
          ) : (
            <span className="text-xs" style={{ color: "#71717a" }}>
              Sem categoria principal
            </span>
          )}
        </div>
      </div>

      {/* VARIANTES */}
      {dbProduct.variants.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold" style={{ color: "#18181b" }}>
            Variantes ({dbProduct.variants.length})
          </h2>
          <div className="mt-3 space-y-2">
            {dbProduct.variants.map((variant) => (
              <div
                key={variant.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-3.5 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#18181b" }}>
                    {variant.name}
                  </p>
                  <p className="text-xs" style={{ color: "#71717a" }}>
                    {variant.attributeValues
                      .map((av) => av.attributeValue.value)
                      .join(" / ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "#18181b" }}>
                    €{Number(variant.price ?? dbProduct.price).toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      variant.stock === 0 ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {variant.stock} em stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}