"use client";

import {
  Heart,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { useState } from "react";

import { Product } from "@/types/product";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { isFavorite, toggleFavorite } = useWishlist();

  const inStock = product.stock === true;
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const oldPrice = product.oldPrice || null;
  const favorite = isFavorite(product.id);

  // ✅ Obter a primeira imagem de forma segura
  const productImage = Array.isArray(product.images) && product.images.length > 0
    ? typeof product.images[0] === "string"
      ? product.images[0]
      : (product.images[0] as { url?: string })?.url ?? "/placeholder-product.png"
    : "/placeholder-product.png";

  function handleToggleFavorite() {
    toggleFavorite(product.id, {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      compareAtPrice: oldPrice ?? null,
      stock: 10,
      brand: { name: product.brand ?? "Sem marca" },
      images: [{ url: productImage }],
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Categoria */}
      <span className="text-xs font-medium uppercase tracking-wider text-pink-500">
        {product.category || "Produto"}
      </span>

      {/* Título */}
      <h1 className="text-xl font-bold leading-tight text-zinc-900 md:text-2xl lg:text-3xl">
        {product.name}
      </h1>

      {/* Marca */}
      {product.brand && (
        <p className="text-sm text-zinc-500">{product.brand}</p>
      )}

      {/* Avaliação */}
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              fill={index < Math.round(rating) ? "#FF2E88" : "transparent"}
              className={index < Math.round(rating) ? "text-pink-500" : "text-zinc-300"}
            />
          ))}
        </div>

        <span className="text-xs text-zinc-500">
          {rating.toFixed(1)} ({reviews})
        </span>
      </div>

      {/* Preço */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-zinc-900 md:text-4xl">
          €{product.price.toFixed(2)}
        </span>

        {oldPrice && oldPrice > product.price && (
          <span className="pb-0.5 text-lg text-zinc-400 line-through md:text-xl">
            €{oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock */}
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

      {/* Ações */}
      {inStock && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Quantidade */}
          <div className="flex h-11 overflow-hidden rounded-full border border-pink-200 bg-white md:h-12">
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

          {/* Adicionar ao carrinho */}
          <button
            className="
              flex-1
              rounded-full
              bg-pink-500
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-pink-600
              hover:shadow-[0_0_40px_rgba(255,46,136,.3)]
              md:px-8
              md:py-3.5
            "
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Adicionar ao Carrinho
            </span>
          </button>

          {/* Botão favorito */}
          <button
            onClick={handleToggleFavorite}
            className={`
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              transition-all
              duration-300
              cursor-pointer
              md:h-12
              md:w-12
              ${
                favorite
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "border border-pink-200 bg-white text-zinc-700 hover:border-pink-500 hover:text-pink-500"
              }
            `}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              size={18}
              className={favorite ? "fill-white" : ""}
            />
          </button>
        </div>
      )}

      {/* Benefícios */}
      <div className="space-y-3 rounded-xl border border-pink-100 bg-pink-50/50 p-4">
        <div className="flex items-center gap-3">
          <Truck size={18} className="shrink-0 text-pink-500" />
          <div>
            <p className="text-sm font-medium text-zinc-900">Entrega Discreta</p>
            <p className="text-xs text-zinc-600">Embalagem totalmente anónima.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck size={18} className="shrink-0 text-pink-500" />
          <div>
            <p className="text-sm font-medium text-zinc-900">Compra 100% Segura</p>
            <p className="text-xs text-zinc-600">Pagamentos protegidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}