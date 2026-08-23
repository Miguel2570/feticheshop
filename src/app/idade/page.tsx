"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AgeVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const redirect =
    searchParams.get("redirect") || "/";

  async function confirmAge() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/age-verification",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message ??
            "Não foi possível confirmar a idade."
        );
      }

      /*
       * Agora o cookie já foi criado.
       *
       * Usamos location.href em vez de apenas
       * router.push para garantir que o Proxy
       * volte a verificar o cookie.
       */

      window.location.href = redirect;
    } catch (error) {
      console.error(
        "Erro na confirmação de idade:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro."
      );

      setLoading(false);
    }
  }

  function leaveSite() {
    /*
     * Não permite continuar na loja.
     *
     * Em vez de mandar para outro site,
     * mostramos uma página simples de saída.
     */
    window.location.href =
      "/idade?blocked=true";
  }

  const blocked =
    searchParams.get("blocked") === "true";

  if (blocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <ShieldCheck
              size={30}
              className="text-pink-500"
            />
          </div>

          <h1 className="text-3xl font-bold">
            Acesso não permitido
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-400">
            Esta loja destina-se exclusivamente
            a maiores de 18 anos.
          </p>

          <Link
            href="/idade"
            className="
              mt-8
              inline-flex
              h-12
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              px-6
              text-sm
              font-semibold
              text-zinc-300
              transition
              hover:border-pink-500
              hover:text-pink-500
            "
          >
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6 py-12 text-white">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[600px]
            w-[600px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-pink-500/[0.035]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent_55%)]
          "
        />
      </div>

      {/* CONTENT */}

      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex flex-col items-center text-center">

          {/* LOGO */}

            <div className="relative mb-7 h-32 w-96 sm:h-36 sm:w-[500px] lg:h-40 lg:w-[600px]">
                <Image
                    src="/images/logo_sexshop2.png"
                    alt="Pleasure Shop"
                    fill
                    priority
                    className="object-contain"
                />
            </div>

          {/* EYEBROW */}

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-pink-500
            "
          >
            Bem-vindo
          </p>

          {/* TITLE */}

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              tracking-tight
              sm:text-4xl
            "
          >
            Um espaço exclusivo
            <span className="block text-pink-500">
              para maiores de 18 anos
            </span>
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-zinc-400
              sm:text-base
            "
          >
            O Pleasure Shop é uma loja online
            destinada exclusivamente a adultos.
            Confirma que tens 18 anos ou mais
            para continuar.
          </p>

          {/* AGE CONFIRMATION */}

          <div className="mt-9 w-full max-w-xl">
            <button
              type="button"
              onClick={confirmAge}
              disabled={loading}
              className="
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-pink-500
                px-6
                text-sm
                font-bold
                text-white
                shadow-[0_0_40px_rgba(236,72,153,0.12)]
                transition
                hover:bg-pink-600
                hover:shadow-[0_0_50px_rgba(236,72,153,0.2)]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              <Check size={20} />

              {loading
                ? "A confirmar..."
                : "Tenho mais de 18 anos e desejo continuar"}
            </button>

            <button
              type="button"
              onClick={leaveSite}
              className="
                mt-3
                w-full
                py-3
                text-sm
                font-medium
                text-zinc-500
                transition
                hover:text-zinc-300
              "
            >
              Não tenho 18 anos
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <p
              className="
                mt-4
                rounded-xl
                border
                border-red-500/20
                bg-red-500/5
                px-4
                py-3
                text-sm
                text-red-400
              "
            >
              {error}
            </p>
          )}

          {/* TERMS */}

          <p
            className="
              mt-7
              max-w-lg
              text-xs
              leading-6
              text-zinc-600
            "
          >
            Ao continuar, confirmas que tens
            idade legal para aceder a esta loja
            e aceitas os nossos termos de uso
            e política de privacidade.
          </p>

          {/* LOGIN */}

          <p className="mt-5 text-sm text-zinc-500">
            Já tens conta?{" "}
            <Link
              href="/login"
              className="
                font-medium
                text-pink-500
                transition
                hover:text-pink-400
              "
            >
              Iniciar sessão
            </Link>
          </p>

          {/* BENEFITS */}

          <div
            className="
              mt-12
              flex
              w-full
              max-w-xl
              flex-col
              items-center
              justify-center
              gap-4
              border-t
              border-zinc-900
              pt-7
              text-xs
              uppercase
              tracking-wider
              text-zinc-600
              sm:flex-row
              sm:gap-8
            "
          >
            <span className="flex items-center gap-2">
              <Check
                size={14}
                className="text-pink-500"
              />
              Compra discreta
            </span>

            <span className="flex items-center gap-2">
              <Check
                size={14}
                className="text-pink-500"
              />
              Pagamento seguro
            </span>

            <span className="flex items-center gap-2">
              <Check
                size={14}
                className="text-pink-500"
              />
              Privacidade
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}