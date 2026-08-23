import Link from "next/link";

import {
  ArrowLeft,
  Search,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[80vh] items-center justify-center py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="
              mx-auto
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-pink-500/10
              text-pink-500
            "
          >
            <Search size={52} />
          </div>

          <p className="mt-10 text-8xl font-black text-pink-500">
            404
          </p>

          <h1 className="mt-6 font-display text-5xl" style={{ color: "#18181b" }}>
            Página não encontrada
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8" style={{ color: "#52525b" }}>
            A página que procuras não existe, foi removida
            ou o endereço introduzido está incorreto.
          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-5">
            {/* VOLTAR À HOME - rosa sólido */}
            <Link
              href="/"
              className="
                inline-flex
                h-14
                items-center
                justify-center
                rounded-full
                bg-pink-500
                px-10
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                cursor-pointer
                hover:scale-105
                hover:bg-pink-600
                hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
              "
            >
              Voltar à Página Inicial
            </Link>

            {/* VER PRODUTOS - rosa sólido também */}
            <Link
              href="/product"
              className="
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
                cursor-pointer
                hover:scale-105
                hover:bg-pink-600
                hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
              "
            >
              <ArrowLeft size={18} />
              Ver Produtos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}