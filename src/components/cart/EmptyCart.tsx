"use client";

import Link from "next/link";

import {
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export function EmptyCart() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div
          className="
            mx-auto
            flex
            h-32
            w-32
            items-center
            justify-center
            rounded-full
            bg-pink-500/10
            text-pink-500
          "
        >
          <ShoppingBag size={54} />
        </div>

        <p className="section-eyebrow mt-10">
          O teu carrinho
        </p>

        <h1 className="section-title mt-4">
          <span 
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
            }}
          >
            Carrinho Vazio
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-zinc-600">
          Ainda não adicionaste nenhum produto ao
          carrinho. Explora a nossa loja e encontra
          produtos cuidadosamente selecionados para ti.
        </p>

        <Link
          href="/product"
          className="
            mt-12
            inline-flex
            h-14
            items-center
            justify-center
            gap-2
            rounded-full
            bg-pink-500
            px-10
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:bg-pink-600
            hover:shadow-[0_0_40px_rgba(255,46,136,.35)]
          "
        >
          Explorar Produtos

          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}