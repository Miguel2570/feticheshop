import { Search } from "lucide-react";

import { ProductGrid } from "@/components/product/ProductGrid";

export default function SearchPage() {
  return (
    <main className="bg-[#090909] text-white">

      <section className="container-custom py-20">

        <div className="mx-auto max-w-3xl text-center">

          <p className="section-eyebrow">
            Pesquisa
          </p>

          <h1 className="section-title">
            Encontra o teu{" "}
            <span className="text-gradient">
              Produto
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Pesquisa rapidamente por qualquer produto da loja.
          </p>

        </div>

        <div className="mx-auto mt-16 max-w-3xl">

          <div className="relative">

            <Search
              size={22}
              className="
                absolute
                left-6
                top-1/2
                -translate-y-1/2
                text-zinc-500
              "
            />

            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="
                h-16
                w-full
                rounded-full
                border
                border-zinc-800
                bg-[#111]
                pl-16
                pr-6
                text-white
                outline-none
                transition-all
                placeholder:text-zinc-500
                hover:border-pink-500/50
                focus:border-pink-500
              "
            />

          </div>

        </div>

        <div className="mt-20">

          <ProductGrid />

        </div>

      </section>

    </main>
  );
}