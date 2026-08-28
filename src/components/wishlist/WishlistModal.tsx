// src/components/wishlist/WishlistModal.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag, Trash2, Check } from "lucide-react";
import { useState } from "react";

import { useWishlist } from "./WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";

export function WishlistModal() {
  const { productIds, products, isOpen, closeWishlist, toggleFavorite } = useWishlist();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // ✅ Usar produtos do Provider (sem fetch, sem loading)
  const filteredProducts = products.filter((product) =>
    productIds.includes(product.id)
  );

  const handleAddToCart = async (productId: string, name: string, slug: string, image: string, price: number) => {
    const success = await addToCart(productId, 1, {
      name,
      slug,
      image,
      price: Number(price) || 0,
    });

    if (success) {
      setAddedId(productId);
      setTimeout(() => setAddedId(null), 2000);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={closeWishlist}
      />

      {/* Modal central */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div
          className="
            w-full
            max-w-7xl
            h-[92vh]
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-2xl
            flex
            flex-col
          "
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-5 sm:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                <Heart size={20} className="fill-pink-500 text-pink-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "#18181b" }}>
                  Os Meus Favoritos
                </h2>
                <p className="text-xs text-zinc-500">
                  {productIds.length} {productIds.length === 1 ? "produto" : "produtos"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWishlist}
              aria-label="Fechar"
              className="rounded-full p-2.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Conteúdo - ✅ Sem loading */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-10">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Heart size={64} className="text-zinc-300" />
                <p className="mt-6 text-xl font-semibold" style={{ color: "#18181b" }}>
                  Sem favoritos
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Adiciona produtos aos favoritos para os veres aqui.
                </p>
                <button
                  type="button"
                  onClick={closeWishlist}
                  className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-pink-500 px-8 text-sm font-bold text-white transition-colors hover:bg-pink-600 cursor-pointer"
                >
                  Continuar a comprar
                </button>
              </div>
            ) : (
              <>
                {/* Cabeçalho da tabela */}
                <div className="mb-3 hidden sm:flex items-center gap-6 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  <div className="flex-1">Nome</div>
                  <div className="w-[100px] text-left">Preço</div>
                  <div className="w-[100px] text-left">Stock</div>
                  <div className="w-[160px]"></div>
                </div>

                {/* Lista de produtos */}
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 sm:gap-6 rounded-2xl border border-pink-100 bg-zinc-50 p-3 shadow-sm transition-all duration-300 hover:border-pink-200 hover:shadow-md sm:p-4"
                    >
                      {/* Imagem */}
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeWishlist}
                        className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-white"
                      >
                        <Image
                          src={product.images?.[0]?.url ?? "/placeholder-product.png"}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </Link>

                      {/* Nome */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={closeWishlist}
                          className="line-clamp-2 text-sm font-bold hover:text-pink-500 sm:text-base"
                          style={{ color: "#18181b" }}
                        >
                          {product.name}
                        </Link>
                      </div>

                      {/* Preço */}
                      <div className="shrink-0 w-[100px]">
                        <span 
                          className="text-base font-bold sm:text-lg"
                          style={{ color: "#18181b" }}
                        >
                          €{Number(product.price || 0).toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="block text-xs text-zinc-400 line-through">
                            €{Number(product.compareAtPrice || 0).toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="shrink-0 w-[100px]">
                        {product.stock && product.stock > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            Em Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                            Esgotado
                          </span>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:gap-3 w-[160px] justify-end">
                        <button
                          type="button"
                          onClick={() => void handleAddToCart(
                            product.id,
                            product.name,
                            product.slug,
                            product.images?.[0]?.url ?? "/placeholder-product.png",
                            product.price
                          )}
                          disabled={!product.stock || product.stock === 0}
                          className="
                            flex
                            h-10
                            items-center
                            justify-center
                            gap-1.5
                            rounded-full
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            active:scale-95
                            cursor-pointer
                          "
                          style={{
                            backgroundColor: addedId === product.id ? "#10b981" : "#ec4899",
                            opacity: !product.stock || product.stock === 0 ? 0.5 : 1,
                            cursor: !product.stock || product.stock === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          {addedId === product.id ? (
                            <>
                              <Check size={14} />
                              Adicionado!
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              Adicionar
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleFavorite(product.id)}
                          aria-label="Remover dos favoritos"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-200 text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}