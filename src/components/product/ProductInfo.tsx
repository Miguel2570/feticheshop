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

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const inStock = product.stock === true;
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const oldPrice = product.oldPrice || null;

  return (
    <div className="flex flex-col gap-6">
      {/* Categoria */}
      <span className="text-sm font-medium uppercase tracking-wider text-pink-500">
        {product.category || "Produto"}
      </span>

      {/* Título */}
      <h1 className="text-3xl font-bold leading-tight text-zinc-900 md:text-4xl lg:text-5xl">
        {product.name}
      </h1>

      {/* Marca */}
      {product.brand && (
        <p className="text-lg text-zinc-500">{product.brand}</p>
      )}

      {/* Avaliação */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={18}
              fill={index < Math.round(rating) ? "#FF2E88" : "transparent"}
              className={index < Math.round(rating) ? "text-pink-500" : "text-zinc-300"}
            />
          ))}
        </div>

        <span className="text-sm text-zinc-500">
          {rating.toFixed(1)} ({reviews} {reviews === 1 ? "avaliação" : "avaliações"})
        </span>
      </div>

      {/* Preço */}
      <div className="flex items-end gap-4">
        <span className="text-4xl font-bold text-zinc-900 md:text-5xl">
          €{product.price.toFixed(2)}
        </span>

        {oldPrice && oldPrice > product.price && (
          <span className="pb-1 text-xl text-zinc-400 line-through md:text-2xl">
            €{oldPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock */}
      <div>
        {inStock ? (
          <span className="inline-block rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-600">
            ✓ Em Stock
          </span>
        ) : (
          <span className="inline-block rounded-full bg-red-500/15 px-4 py-2 text-sm font-medium text-red-500">
            Esgotado
          </span>
        )}
      </div>

      {/* Ações - Comprar */}
      {inStock && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-12 overflow-hidden rounded-full border border-pink-200 bg-white md:h-14">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 text-xl text-zinc-700 transition hover:bg-pink-50 hover:text-pink-500 md:w-14"
              aria-label="Diminuir quantidade"
            >
              −
            </button>

            <div className="flex w-12 items-center justify-center border-x border-pink-200 text-sm text-zinc-900 md:w-14">
              {quantity}
            </div>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-12 text-xl text-zinc-700 transition hover:bg-pink-50 hover:text-pink-500 md:w-14"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

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
              md:py-4
            "
          >
            <span className="flex items-center justify-center gap-3">
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </span>
          </button>

          <button
            onClick={() => setIsWishlist(!isWishlist)}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-pink-200
              bg-white
              text-zinc-700
              transition
              hover:border-pink-500
              hover:text-pink-500
              md:h-14
              md:w-14
            "
            aria-label={isWishlist ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              size={20}
              className={isWishlist ? "fill-pink-500 text-pink-500" : ""}
            />
          </button>
        </div>
      )}

      {/* Benefícios */}
      <div className="space-y-4 rounded-xl border border-pink-100 bg-pink-50/50 p-5">
        <div className="flex items-center gap-4">
          <Truck size={20} className="shrink-0 text-pink-500" />
          <div>
            <p className="font-medium text-zinc-900">Entrega Discreta</p>
            <p className="text-sm text-zinc-600">Embalagem totalmente anónima.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ShieldCheck size={20} className="shrink-0 text-pink-500" />
          <div>
            <p className="font-medium text-zinc-900">Compra 100% Segura</p>
            <p className="text-sm text-zinc-600">Pagamentos protegidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}