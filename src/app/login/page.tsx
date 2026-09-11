import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      {/* ✅ BOTÃO VOLTAR - responsivo */}
      <div className="container-custom pt-4 sm:pt-8">
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            rounded-full border border-zinc-700 bg-zinc-900
            px-3 py-1.5 text-xs
            sm:px-4 sm:py-2 sm:text-sm
            font-semibold text-white
            transition-all
            hover:border-pink-500 hover:bg-pink-500
            cursor-pointer
          "
        >
          <ArrowLeft size={14} className="sm:size-4" />
          <span>Voltar</span>
          <span className="hidden sm:inline">à Página Inicial</span>
        </Link>
      </div>

      <section className="container-custom flex min-h-[75vh] items-center justify-center pt-6 pb-12 sm:pb-20">
        <div className="w-full max-w-xl">
          <div className="mb-8 sm:mb-12 text-center">
            <p className="section-eyebrow">
              Bem-vindo de volta
            </p>

            <h1 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Iniciar Sessão
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-zinc-600">
              Acede à tua conta para acompanhar encomendas,
              favoritos e muito mais.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}