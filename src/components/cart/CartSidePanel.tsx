// src/components/cart/CartSidePanel.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

import { useCart } from "./CartProvider";

export function CartSidePanel() {
  const { 
    items, 
    itemCount, 
    total, 
    isOpen, 
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed
          inset-0
          z-[70]
          bg-black/50
          transition-opacity
          duration-200
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeCart}
        aria-hidden={!isOpen}
      />

      {/* Painel deslizante */}
      <div
        className={`
          fixed
          right-0
          top-0
          z-[80]
          h-full
          w-full
          max-w-md
          bg-white
          shadow-2xl
          will-change-transform
          transition-transform
          duration-300
          ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-pink-500" />
            <h2 className="text-lg font-bold text-zinc-900">
              Carrinho ({itemCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <ShoppingBag size={48} className="text-zinc-300" />
            <p className="mt-4 text-lg font-semibold text-zinc-900">
              Carrinho vazio
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Adiciona produtos para começares a comprar.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-pink-500 px-6 text-sm font-bold text-white transition-colors hover:bg-pink-600 cursor-pointer"
            >
              Continuar a comprar
            </button>
          </div>
        ) : (
          <>
            {/* Lista de produtos */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-zinc-200 p-3"
                >
                  {/* Imagem - ✅ Usar item.product */}
                  <Link href={`/product/${item.product.slug}`} onClick={closeCart}>
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-pink-50/50">
                      <Image
                        src={item.product.image ?? "/placeholder-product.png"}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link 
                      href={`/product/${item.product.slug}`} 
                      onClick={closeCart}
                      className="text-sm font-semibold text-zinc-900 line-clamp-2 hover:text-pink-500"
                    >
                      {item.product.name}
                    </Link>

                    <p className="mt-1 text-sm font-bold text-pink-500">
                      €{item.product.price.toFixed(2)}
                    </p>

                    {/* Quantidade + Remover */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-pink-500 hover:text-pink-500 cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition-colors hover:border-pink-500 hover:text-pink-500 cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remover produto"
                        className="text-zinc-400 transition-colors hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-200 px-6 py-5 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">
                  Subtotal
                </span>
                <span className="text-xl font-bold text-zinc-900">
                  €{total.toFixed(2)}
                </span>
              </div>

              <p className="text-xs text-zinc-500">
                Envio e descontos calculados no checkout.
              </p>

              {/* Botões */}
              <div className="space-y-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pink-500 text-sm font-bold text-white transition-colors hover:bg-pink-600"
                >
                  <ShoppingBag size={18} />
                  Ir para o Carrinho
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}