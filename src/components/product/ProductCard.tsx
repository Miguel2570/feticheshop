"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
} from "lucide-react";
import { useState } from "react";

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
}: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const favorite = isFavorite(id);

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
      stock: 10,
      brand: { name: brand },
      images: [{ url: image ?? "/placeholder-product.png" }],
    });
  }

  async function handleAddToCart() {
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
    <article
      className="
        group
        relative
        z-0
        overflow-hidden
        rounded-2xl
        sm:rounded-3xl
        border
        border-pink-100
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:z-10
        hover:-translate-y-1
        hover:border-pink-200
        hover:shadow-[0_8px_30px_rgba(255,46,136,.10)]
      "
    >
      {/* SECÇÃO DA IMAGEM */}
      <div className="relative">
        {/* Badge de desconto / promoção */}
        {(badge || discount) && (
          <div
            className="
              absolute
              left-2
              top-2
              sm:left-4
              sm:top-4
              z-20
              rounded-full
              bg-pink-500
              px-3
              py-1.5
              text-[10px]
              sm:px-4
              sm:py-2
              sm:text-xs
              font-bold
              text-white
              shadow-lg
              shadow-pink-500/30
            "
          >
            {badge ?? `-${discount}%`}
          </div>
        )}

        {/* Botão favorito */}
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={
            favorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
          className={`
            group/fav
            absolute
            right-2
            top-2
            sm:right-4
            sm:top-4
            z-20
            flex
            h-8
            w-8
            sm:h-10
            sm:w-10
            items-center
            justify-center
            rounded-full
            transition-all
            duration-300
            hover:scale-110
            active:scale-90
            ${
              favorite
                ? "bg-white/80 backdrop-blur shadow-sm hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30"
                : "bg-white/80 backdrop-blur shadow-sm hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30"
            }
          `}
        >
          <Heart
            size={16}
            className={`
              sm:w-[18px]
              sm:h-[18px]
              transition-all
              duration-300
              ${
                favorite 
                  ? "fill-pink-500 text-pink-500 scale-110 group-hover/fav:fill-white group-hover/fav:text-white"
                  : "text-zinc-600 group-hover/fav:fill-white group-hover/fav:text-white"
              }
            `}
          />
        </button>

        {/* Imagem do produto */}
        <Link href={`/product/${slug}`}>
          <div className="relative h-[180px] sm:h-[280px] lg:h-[320px] bg-pink-50/50">
            <Image
              src={image ?? "/images/product-placeholder.png"}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="
                object-contain
                p-4
                sm:p-8
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          </div>
        </Link>
      </div>

      {/* CONTEÚDO */}
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-500">
            {brand}
          </p>

          <Link href={`/product/${slug}`}>
            <h3
              className="
                mt-1
                sm:mt-2
                line-clamp-2
                text-sm
                sm:text-xl
                font-bold
                text-zinc-900
                transition
                hover:text-pink-500
              "
            >
              {name}
            </h3>
          </Link>

          <p className="mt-1 sm:mt-2 line-clamp-2 text-xs sm:text-sm text-zinc-600">
            {description}
          </p>
        </div>

        {/* Avaliações */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={14}
                fill={
                  index < Math.round(rating) ? "#ec4899" : "transparent"
                }
                className="text-pink-500"
              />
            ))}
          </div>

          <span className="text-sm sm:text-base font-semibold text-zinc-900">
            {rating.toFixed(1)}
          </span>

          <span className="text-xs sm:text-sm text-zinc-500">
            ({reviews})
          </span>
        </div>

        {/* Preço */}
        <div className="flex items-end gap-2 sm:gap-3">
          <span className="text-lg sm:text-2xl font-bold text-zinc-900">
            €{price.toFixed(2)}
          </span>

          {oldPrice && (
            <span className="text-xs sm:text-base text-zinc-400 line-through">
              €{oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Botão adicionar ao carrinho - ÚNICO BOTÃO */}
        <button
          type="button"
          onClick={() => void handleAddToCart()}
          className={`
            flex
            w-full
            items-center
            justify-center
            gap-1
            sm:gap-2
            rounded-full
            py-2
            sm:py-3
            text-sm
            sm:text-base
            font-semibold
            text-white
            transition-all
            duration-300
            active:scale-95
            cursor-pointer
            ${
              added
                ? "bg-emerald-500 scale-[1.02]"
                : "bg-pink-500 hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02]"
            }
          `}
        >
          {added ? (
            <>
              <Check size={16} className="sm:w-[18px] sm:h-[18px] animate-bounce" />
              Adicionado!
            </>
          ) : (
            <>
              <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
              Adicionar ao carrinho
            </>
          )}
        </button>
      </div>
    </article>
  );
}