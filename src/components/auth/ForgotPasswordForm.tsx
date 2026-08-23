"use client";

import Link from "next/link";

import {
  ArrowRight,
  Mail,
} from "lucide-react";

export function ForgotPasswordForm() {
  return (
    <form
      className="
        rounded-[30px]
        border
        border-pink-100
        bg-white
        p-8
        shadow-sm
      "
    >
      <div
        className="
          mx-auto
          mb-8
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-pink-500/10
        "
      >
        <Mail
          size={36}
          className="text-pink-500"
        />
      </div>

      <h2 className="text-center font-display text-3xl text-zinc-900">
        Recuperar Palavra-passe
      </h2>

      <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-600">
        Introduz o teu endereço de email e enviaremos um
        link para redefinires a tua palavra-passe.
      </p>

      <div className="mt-10">
        <label className="mb-2 block text-sm font-medium text-zinc-700">
          Email
        </label>

        <input
          type="email"
          placeholder="email@exemplo.pt"
          className="
            h-12
            w-full
            rounded-xl
            border
            border-pink-200
            bg-white
            px-4
            text-sm
            text-zinc-900
            outline-none
            transition-all
            placeholder:text-zinc-400
            hover:border-pink-300
            focus:border-pink-500
            focus:ring-2
            focus:ring-pink-200
          "
        />
      </div>

      <button
        type="submit"
        className="
          mt-8
          inline-flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-pink-500
          text-sm
          font-semibold
          text-white
          transition-all
          duration-300
          cursor-pointer
          hover:scale-[1.02]
          hover:bg-pink-600
          hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
        "
      >
        Enviar Link

        <ArrowRight size={18} />
      </button>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="
            inline-flex
            items-center
            gap-2
            font-semibold
            text-pink-500
            transition
            hover:text-pink-600
          "
        >
          Voltar ao Login
        </Link>
      </div>
    </form>
  );
}