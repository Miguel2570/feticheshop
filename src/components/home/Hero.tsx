"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Clock,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Imagem de Fundo - MOBILE (tamanho natural) */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/images/hero_telemovel2.png"
          alt="Pleasure Shop"
          fill
          priority
          className="object-contain object-top"
          sizes="100vw"
        />
      </div>

      {/* Imagem de Fundo - DESKTOP */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/hero-bg2.png"
          alt="Pleasure Shop"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Glow */}
      <div className="absolute left-[-250px] top-[-200px] h-[550px] w-[550px] rounded-full bg-pink-500/20 blur-[180px]" />
      <div className="absolute bottom-[-150px] right-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-700/20 blur-[180px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-24">
        {/* Texto */}
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-pink-400">
            Nova Coleção
          </span>

          <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
            <span className="text-white">Prazer sem limites</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-300">
            Descobre uma seleção premium de produtos para bem-estar íntimo,
            prazer e experiências únicas, sempre com envio totalmente discreto.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/product"
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-pink-500
                px-8
                py-4
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:scale-105
                hover:bg-pink-600
              "
            >
              Comprar Agora
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/product"
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-zinc-600
                bg-black/20
                px-8
                py-4
                text-sm
                font-semibold
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-pink-500
                hover:bg-white/10
              "
            >
              Explorar
            </Link>
          </div>

          {/* BENEFÍCIOS */}
          <div className="mt-50 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {/* Item 1 */}
            <div className="flex items-center gap-2">
              <Truck size={16} className="shrink-0 text-pink-500" />
              <div>
                <p className="text-xs font-medium text-white">Entrega Discreta</p>
                <p className="text-[10px] text-zinc-400">Embalagem sem identificação</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0 text-pink-500" />
              <div>
                <p className="text-xs font-medium text-white">Compra Segura</p>
                <p className="text-[10px] text-zinc-400">Pagamentos protegidos</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-2">
              <Clock size={16} className="shrink-0 text-pink-500" />
              <div>
                <p className="text-xs font-medium text-white">Entrega Rápida</p>
                <p className="text-[10px] text-zinc-400">24-48h em Portugal</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-2">
              <Headphones size={16} className="shrink-0 text-pink-500" />
              <div>
                <p className="text-xs font-medium text-white">Apoio ao Cliente</p>
                <p className="text-[10px] text-zinc-400">Suporte personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}