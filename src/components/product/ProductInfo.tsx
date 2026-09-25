"use client";

import {
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Product, ProductVariant } from "@/types/product";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVariants } from "./ProductVariants";

interface ProductInfoProps {
  product: Product;
  activeVariant?: ProductVariant | null;
  overridePrice?: number;
  overrideComparePrice?: number;
  overrideStock?: boolean;
  // Props para o seletor de variantes
  selectedVariantId?: string | null;
  onVariantSelect?: (variant: ProductVariant) => void;
}

export function ProductInfo({
  product,
  activeVariant = null,
  overridePrice,
  overrideComparePrice,
  overrideStock,
  selectedVariantId = null,
  onVariantSelect,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { isFavorite, toggleFavorite } = useWishlist();
  const { addToCart, openCart } = useCart();

  const price = overridePrice ?? product.price;
  const oldPrice = overrideComparePrice ?? product.oldPrice ?? null;
  const inStock = overrideStock ?? product.stock === true;
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const favorite = isFavorite(product.id);

  // Imagem para wishlist / cart
  const variantImage =
    activeVariant && activeVariant.images.length > 0
      ? activeVariant.images[0]
      : null;

  const productImage =
    variantImage ??
    (Array.isArray(product.images) && product.images.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : (product.images[0] as { url?: string })?.url ??
          "/placeholder-product.png"
      : "/placeholder-product.png");

  function handleToggleFavorite() {
    toggleFavorite(product.id, {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: price,
      compareAtPrice: oldPrice ?? null,
      stock: 10,
      brand: { name: product.brand ?? "Sem marca" },
      images: [{ url: productImage }],
    });
  }

  async function handleAddToCart() {
    const variantSuffix = activeVariant ? ` - ${activeVariant.name}` : "";

    await addToCart(
      product.id,
      quantity,
      {
        name: `${product.name}${variantSuffix}`,
        slug: product.slug,
        image: productImage,
        price: price,
      },
      activeVariant?.id
    );

    openCart();
  }

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4 sm:gap-5">
      <span className="hidden lg:block text-xs font-medium uppercase tracking-wider text-pink-500">
        {product.category || "Produto"}
      </span>

      <h1 className="hidden lg:block break-words text-xl font-bold leading-tight text-zinc-900 md:text-2xl lg:text-3xl">
        {product.name}
      </h1>

      {product.brand && (
        <p className="text-sm text-zinc-500">{product.brand}</p>
      )}

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              fill={index < Math.round(rating) ? "#FF2E88" : "transparent"}
              className={
                index < Math.round(rating) ? "text-pink-500" : "text-zinc-300"
              }
            />
          ))}
        </div>

        <span className="text-xs text-zinc-500">
          {rating.toFixed(1)} ({reviews})
        </span>
      </div>

      {/* PREÇO */}
      <div className="flex flex-wrap items-end gap-2 sm:gap-3">
        <span className="text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl">
          €{price.toFixed(2)}
        </span>

        {oldPrice && oldPrice > price && (
          <span className="pb-0.5 text-base text-zinc-400 line-through sm:text-lg md:text-xl">
            €{oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* STOCK */}
      <div>
        {inStock ? (
          <span className="inline-block rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-600">
            ✓ Em Stock
          </span>
        ) : (
          <span className="inline-block rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-500">
            Esgotado
          </span>
        )}
      </div>

      {/* 🔥 SELETOR DE VARIANTES — agora em cima do botão de carrinho */}
      {hasVariants && onVariantSelect && (
        <div className="border-y border-pink-100 py-4">
          <ProductVariants
            variants={product.variants}
            selectedVariantId={selectedVariantId}
            onSelect={onVariantSelect}
          />
        </div>
      )}

      {/* BOTÃO ADICIONAR AO CARRINHO */}
      {inStock && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 overflow-hidden rounded-full border border-pink-200 bg-white md:h-12 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 text-lg text-zinc-700 transition hover:bg-pink-50 hover:text-pink-500 md:w-12"
                aria-label="Diminuir quantidade"
              >
                −
              </button>

              <div className="flex w-10 items-center justify-center border-x border-pink-200 text-sm text-zinc-900 md:w-12">
                {quantity}
              </div>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 text-lg text-zinc-700 transition hover:bg-pink-50 hover:text-pink-500 md:w-12"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>

            <button
              onClick={handleToggleFavorite}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 cursor-pointer shrink-0 lg:hidden ${
                favorite
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "border border-pink-200 bg-white text-zinc-700 hover:border-pink-500 hover:text-pink-500"
              }`}
              aria-label={
                favorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <Heart size={18} className={favorite ? "fill-white" : ""} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-0 rounded-full bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 hover:shadow-[0_0_40px_rgba(255,46,136,.3)] md:px-8 md:py-3.5 cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                <ShoppingCart size={18} className="shrink-0" />
                <span className="whitespace-nowrap">Adicionar ao Carrinho</span>
              </span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`hidden h-11 w-11 items-center justify-center rounded-full transition-all duration-300 cursor-pointer shrink-0 lg:flex lg:h-12 lg:w-12 ${
                favorite
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "border border-pink-200 bg-white text-zinc-700 hover:border-pink-500 hover:text-pink-500"
              }`}
              aria-label={
                favorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <Heart size={18} className={favorite ? "fill-white" : ""} />
            </button>
          </div>
        </div>
      )}

      {/* INFO EXTRA */}
      <div className="space-y-3 rounded-xl border border-pink-100 bg-pink-50/50 p-4">
        <div className="flex items-start gap-3">
          <Truck size={18} className="shrink-0 text-pink-500 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">
              Entrega Discreta
            </p>
            <p className="text-xs text-zinc-600">Embalagem totalmente anónima.</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="shrink-0 text-pink-500 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">
              Compra 100% Segura
            </p>
            <p className="text-xs text-zinc-600">Pagamentos protegidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}