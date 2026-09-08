// src/components/cart/CartSidePanel.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Star } from "lucide-react";

import { useCart } from "./CartProvider";

const FREE_SHIPPING_THRESHOLD = 50;

interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
}

export function CartSidePanel() {
  const { 
    items, 
    itemCount, 
    total, 
    isOpen, 
    closeCart,
    removeFromCart,
    updateQuantity,
    addToCart,
  } = useCart();

  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const controller = new AbortController();

    async function fetchRecommended() {
      setLoadingRecommended(true);

      try {
        const response = await fetch("/api/products/recommended", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (data.success && data.products && data.products.length > 0) {
          setRecommendedProducts(data.products);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao buscar recomendados:", error);
        }
      } finally {
        setLoadingRecommended(false);
      }
    }

    fetchRecommended();

    return () => {
      controller.abort();
    };
  }, [isOpen]);

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  const progressPercent = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = total >= FREE_SHIPPING_THRESHOLD;

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
          max-w-3xl
          shadow-2xl
          will-change-transform
          transition-transform
          duration-300
          ease-out
          flex
          flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ backgroundColor: "#ffffff" }}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-pink-500" />
            <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
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

        {/* Barra de Portes Grátis */}
          <div 
            className="border-b border-zinc-200 px-6 py-4 shrink-0"
            style={{ backgroundColor: "#fdf2f8" }}
          >
            <div className="flex items-center gap-2">
              <Truck 
                size={18} 
                style={{ color: hasFreeShipping ? "#059669" : "#db2777" }}
              />
              <p className="text-sm font-medium" style={{ color: "#27272a" }}>
                {hasFreeShipping ? (
                  <span style={{ color: "#059669", fontWeight: "bold" }}>
                    🎉 Tens portes grátis!
                  </span>
                ) : (
                  <>
                    Faltam{" "}
                    <span style={{ color: "#db2777", fontWeight: "bold" }}>
                      €{remainingForFreeShipping.toFixed(2)}
                    </span>{" "}
                    para portes grátis
                  </>
                )}
              </p>
            </div>

            <div 
              className="mt-3 h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#d4d4d8" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercent}%`,
                  background: hasFreeShipping
                    ? "linear-gradient(90deg, #10b981, #059669)"
                    : "linear-gradient(90deg, #ec4899, #db2777)"
                }}
              />
            </div>

            <p className="mt-2 text-xs font-medium" style={{ color: "#52525b" }}>
              {hasFreeShipping
                ? "Portes grátis aplicados!"
                : `Adiciona mais €${remainingForFreeShipping.toFixed(2)} para teres portes grátis`}
            </p>
          </div>
          
        {/* Conteúdo principal - DUAS COLUNAS */}
        <div className="flex-1 flex overflow-hidden">
          {/* Coluna Esquerda - Produtos do Carrinho */}
          <div className="flex-1 overflow-y-auto border-r border-zinc-200">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                <ShoppingBag size={40} className="text-zinc-300" />
                <p className="mt-3 text-base font-semibold" style={{ color: "#18181b" }}>
                  Carrinho vazio
                </p>
                <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                  Adiciona produtos para começares a comprar.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-bold text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  Continuar a comprar
                </button>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl border border-zinc-200 p-3"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <Link href={`/product/${item.product.slug}`} onClick={closeCart}>
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-pink-50/50">
                        <Image
                          src={item.product.image ?? "/placeholder-product.png"}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-contain p-2"
                        />
                      </div>
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link 
                        href={`/product/${item.product.slug}`} 
                        onClick={closeCart}
                        className="text-xs font-semibold line-clamp-2 hover:text-pink-500"
                        style={{ color: "#18181b" }}
                      >
                        {item.product.name}
                      </Link>

                      <p className="mt-1 text-sm font-bold" style={{ color: "#db2777" }}>
                        €{item.product.price.toFixed(2)}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:border-pink-500 hover:text-pink-500 cursor-pointer"
                            style={{ color: "#52525b" }}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-semibold" style={{ color: "#18181b" }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 transition-colors hover:border-pink-500 hover:text-pink-500 cursor-pointer"
                            style={{ color: "#52525b" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remover produto"
                          className="transition-colors hover:text-red-500 cursor-pointer"
                          style={{ color: "#a1a1aa" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer - botões de ação */}
            {items.length > 0 && (
              <div className="border-t border-zinc-200 px-4 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "#52525b" }}>
                    Subtotal
                  </span>
                  <span className="text-lg font-bold" style={{ color: "#18181b" }}>
                    €{total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors"
                    style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
                  >
                    <ShoppingBag size={16} />
                    Ir para o Carrinho
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-colors"
                    style={{ backgroundColor: "#18181b", color: "#ffffff" }}
                  >
                    Finalizar Compra
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita - Recomendados */}
          <div className="w-90 shrink-0 overflow-y-auto px-4 py-4" style={{ backgroundColor: "#ffffff" }}>
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#18181b" }}>
              Melhora a tua Encomenda
            </h3>

            {loadingRecommended ? (
              <div className="mt-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-zinc-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full rounded bg-zinc-200" />
                      <div className="h-3 w-1/2 rounded bg-zinc-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="mt-4">
                {recommendedProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className={`
                      ${index < recommendedProducts.length - 1 ? "border-b border-zinc-200" : ""}
                    `}
                  >
                    <div className="flex gap-3 py-3">
                      {/* Imagem à esquerda */}
                      <Link href={`/product/${product.slug}`} onClick={closeCart} className="shrink-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-pink-50">
                          <Image
                            src={product.image || "/images/product-placeholder.png"}
                            alt={product.name}
                            unoptimized
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Nome à direita */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold line-clamp-2 hover:text-pink-500"
                          style={{ color: "#18181b" }}
                        >
                          {product.name}
                        </Link>

                        {/* Preço por baixo */}
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-sm font-bold" style={{ color: "#db2777" }}>
                            €{product.price.toFixed(2)}
                          </span>

                          <button
                            type="button"
                            onClick={() => addToCart(product.id)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer hover:scale-110"
                            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
                            aria-label={`Adicionar ${product.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm" style={{ color: "#71717a" }}>
                Sem produtos recomendados de momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}