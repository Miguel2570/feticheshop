"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ServiceUnavailableProps {
  title?: string;
  description?: string;
}

export function ServiceUnavailable({
  title = "Serviço temporariamente indisponível",
  description = "De momento não conseguimos ligar aos nossos serviços. Estamos a trabalhar para resolver o problema.",
}: ServiceUnavailableProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909] px-6 text-white">
      <section className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-pink-500/10">
          <AlertTriangle
            size={44}
            className="text-pink-500"
          />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
          Pleasure Shop
        </p>

        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          {title}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
          {description}
        </p>

        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-zinc-800 bg-[#111] p-6 text-left">
          <p className="font-medium text-white">
            Podes tentar:
          </p>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-500">
            <li>
              • Atualizar a página
            </li>

            <li>
              • Aguardar alguns instantes
            </li>

            <li>
              • Tentar novamente mais tarde
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="
            mt-8
            inline-flex
            h-14
            items-center
            justify-center
            gap-2
            rounded-full
            bg-pink-500
            px-8
            font-semibold
            text-white
            transition-all
            duration-300
            hover:bg-pink-600
            hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
          "
        >
          <RefreshCw size={18} />
          Tentar novamente
        </button>
      </section>
    </main>
  );
}