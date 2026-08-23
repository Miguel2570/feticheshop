"use client";

import Link from "next/link";

import {
  ArrowRight,
  Heart,
} from "lucide-react";

export function EmptyWishlist() {
  return (
    <section className="py-20">

      <div
        className="
          mx-auto
          max-w-3xl
          rounded-[40px]
          border
          border-zinc-800
          bg-[#111]
          px-8
          py-20
          text-center
        "
      >

        <div
          className="
            mx-auto
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            bg-pink-500/10
          "
        >

          <Heart
            size={44}
            className="text-pink-500"
          />

        </div>

        <p className="section-eyebrow mt-10">
          Wishlist
        </p>

        <h2 className="section-title mt-4">
          Ainda não tens
          <br />

          <span className="text-gradient">
            favoritos
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
          Guarda os produtos que mais gostas na tua
          wishlist para os encontrares rapidamente
          quando quiseres.
        </p>

        <Link
          href="/product"
          className="
            mt-12
            inline-flex
            h-16
            items-center
            justify-center
            gap-2
            rounded-full
            bg-pink-500
            px-10
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

          <ArrowRight size={20} />

        </Link>

      </div>

    </section>
  );
}