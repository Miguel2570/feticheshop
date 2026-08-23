"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart, CartItem as CartItemType } from "./CartProvider";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const {
    updateQuantity,
    removeItem,
  } = useCart();

  const product = item.product;

  const handleDecrease = () => {
    void updateQuantity(
      item.id,
      item.quantity - 1
    );
  };

  const handleIncrease = () => {
    void updateQuantity(
      item.id,
      item.quantity + 1
    );
  };

  const handleRemove = () => {
    void removeItem(item.id);
  };

  return (
    <article
      className="
        rounded-3xl
        border
        border-pink-100
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:border-pink-200
        hover:shadow-lg
        hover:shadow-pink-500/10
      "
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* IMAGEM */}

        <div
          className="
            relative
            h-48
            w-full
            shrink-0
            overflow-hidden
            rounded-2xl
            bg-pink-50/50
            lg:h-36
            lg:w-36
          "
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* CONTEÚDO */}

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              {product.brand}
            </p>

            <h3 className="mt-2 font-display text-2xl text-zinc-900">
              {product.name}
            </h3>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            {/* QUANTIDADE */}

            <div>
              <p className="mb-2 text-sm text-zinc-500">
                Quantidade
              </p>

              <div
                className="
                  flex
                  h-12
                  overflow-hidden
                  rounded-full
                  border
                  border-pink-200
                  bg-white
                "
              >
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="
                    flex
                    w-12
                    items-center
                    justify-center
                    text-zinc-600
                    transition
                    cursor-pointer
                    hover:bg-pink-50
                    hover:text-pink-500
                  "
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={16} />
                </button>

                <div
                  className="
                    flex
                    w-12
                    items-center
                    justify-center
                    border-x
                    border-pink-200
                    text-zinc-900
                    font-medium
                  "
                >
                  {item.quantity}
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="
                    flex
                    w-12
                    items-center
                    justify-center
                    text-zinc-600
                    transition
                    cursor-pointer
                    hover:bg-pink-50
                    hover:text-pink-500
                  "
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* PREÇO */}

            <div>
              <p className="text-sm text-zinc-500">
                Preço
              </p>

              <p className="text-xl font-bold text-zinc-900">
                €{item.price.toFixed(2)}
              </p>
            </div>

            {/* SUBTOTAL */}

            <div>
              <p className="text-sm text-zinc-500">
                Subtotal
              </p>

              <p className="text-2xl font-bold text-pink-500">
                €{item.subtotal.toFixed(2)}
              </p>
            </div>

            {/* REMOVER */}

            <button
              type="button"
              onClick={handleRemove}
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
                text-zinc-400
                transition-all
                duration-300
                cursor-pointer
                hover:border-red-400
                hover:bg-red-50
                hover:text-red-500
              "
              aria-label="Remover produto"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}