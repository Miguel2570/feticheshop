// components/product/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  image?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  stock?: number;
}

const DELIVERY_BUSINESS_DAYS = 2;

function addBusinessDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return result;
}

function formatDeliveryDate(date: Date): string {
  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
  });
}

export function ProductCard({
  id,
  slug,
  name,
  brand,
  description,
  image,
  price,
  oldPrice,
  rating = 5,
  reviews = 0,
  badge,
  stock = 1,
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const favorite = isFavorite(id);
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  const deliveryDate = useMemo(() => {
    const today = new Date();
    const delivery = addBusinessDays(today, DELIVERY_BUSINESS_DAYS);
    return formatDeliveryDate(delivery);
  }, []);

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  function handleFavorite() {
    toggleFavorite(id, {
      id,
      slug,
      name,
      price,
      compareAtPrice: oldPrice ?? null,
      stock,
      brand: { name: brand },
      images: [{ url: image ?? "/placeholder-product.png" }],
    });
  }

  async function handleAddToCart() {
    if (isOutOfStock) return;

    const success = await addToCart(id, 1, {
      name,
      slug,
      image: image ?? "/placeholder-product.png",
      price,
    });

    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="relative group">
      <article
        className="
          relative z-0 overflow-hidden rounded-2xl sm:rounded-3xl
          border border-pink-100 bg-white shadow-sm
          transition-all duration-300
          hover:z-10 hover:-translate-y-1 hover:border-pink-200
          hover:shadow-[0_8px_30px_rgba(255,46,136,.10)]
        "
      >
        {/* SECÇÃO DA IMAGEM */}
        <div className="relative">
          {isOutOfStock ? (
            <div className="absolute left-2 top-2 sm:left-4 sm:top-4 z-30 rounded-full bg-zinc-900 px-3 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs font-bold text-white shadow-lg shadow-zinc-900/30">
              Esgotado
            </div>
          ) : (
            (badge || discount) && (
              <div className="absolute left-2 top-2 sm:left-4 sm:top-4 z-30 rounded-full bg-pink-500 px-3 py-1.5 text-[10px] sm:px-4 sm:py-2 sm:text-xs font-bold text-white shadow-lg shadow-pink-500/30">
                {badge ?? `-${discount}%`}
              </div>
            )
          )}

          <button
            type="button"
            onClick={handleFavorite}
            aria-label={
              favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            className={`group/fav absolute right-2 top-2 sm:right-4 sm:top-4 z-30 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-90 ${
              favorite
                ? "bg-white/80 backdrop-blur shadow-sm hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30"
                : "bg-white/80 backdrop-blur shadow-sm hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30"
            }`}
          >
            <Heart
              size={16}
              className={`sm:w-[18px] sm:h-[18px] transition-all duration-300 ${
                favorite
                  ? "fill-pink-500 text-pink-500 scale-110 group-hover/fav:fill-white group-hover/fav:text-white"
                  : "text-zinc-600 group-hover/fav:fill-white group-hover/fav:text-white"
              }`}
            />
          </button>

          <Link href={`/product/${slug}`} className="block">
            <div className="relative h-[180px] sm:h-[280px] lg:h-[320px] bg-pink-50/50">
              <Image
                src={image ?? "/images/product-placeholder.png"}
                alt={name}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className={`object-contain p-4 sm:p-8 transition-transform duration-500 group-hover:scale-105 ${
                  isOutOfStock ? "opacity-60" : ""
                }`}
              />
            </div>
          </Link>
        </div>

        {/* CONTEÚDO */}
        <div className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          <div>
            <Link href={`/product/${slug}`}>
              <h3 className="mt-1 sm:mt-2 line-clamp-2 text-sm sm:text-xl font-bold text-zinc-900 transition hover:text-pink-500">
                {name}
              </h3>
            </Link>

            <p className="mt-1 sm:mt-2 line-clamp-2 text-xs sm:text-sm text-zinc-600">
              {description}
            </p>
          </div>

          {/* Stock */}
          <div className="flex h-5 items-center gap-1.5">
            {!isOutOfStock ? (
              isLowStock ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-xs sm:text-sm font-semibold text-yellow-600">
                    Poucas unidades
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600">
                    Em stock
                  </span>
                </>
              )
            ) : (
              <span aria-hidden="true" className="h-5" />
            )}
          </div>

          {/* Entrega prevista */}
          {!isOutOfStock && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-500">
              <Truck
                size={14}
                className="shrink-0 text-pink-500 sm:w-4 sm:h-4"
              />
              <span>
                Entrega prevista{" "}
                <span className="font-semibold text-zinc-700">
                  {deliveryDate}
                </span>
              </span>
            </div>
          )}

          {/* ✅ PREÇO + BOTÃO NA MESMA LINHA */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Preço à esquerda */}
            <div className="flex items-end gap-2 min-w-0">
              <span className="text-lg sm:text-2xl font-bold text-zinc-900">
                €{price.toFixed(2)}
              </span>
              {oldPrice && (
                <span className="text-xs sm:text-base text-zinc-400 line-through">
                  €{oldPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Botão à direita — só aparece no hover */}
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleAddToCart}
                aria-label="Adicionar ao carrinho"
                className={`
                  shrink-0
                  inline-flex items-center justify-center gap-1.5
                  rounded-full
                  px-5 py-2 sm:px-9 sm:py-2.5
                  text-xs sm:text-sm font-semibold
                  text-white
                  shadow-md
                  transition-all duration-300
                  active:scale-95
                  cursor-pointer
                  ${
                    added
                      ? "bg-emerald-500 shadow-emerald-500/30"
                      : "bg-pink-500 hover:bg-pink-600 shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/40"
                  }
                  opacity-0 translate-x-2
                  group-hover:opacity-100 group-hover:translate-x-0
                  focus:opacity-100 focus:translate-x-0
                `}
              >
                {added ? (
                  <>
                    <Check size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Adicionado!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}