"use client";

import Link from "next/link";

import { ArrowRight, Lock } from "lucide-react";

import { PasswordInput } from "./PasswordInput";

export function ResetPasswordForm() {
  return (
    <form
      className="
        rounded-[30px]
        border
        border-zinc-800
        bg-[#111]
        p-8
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
        <Lock
          size={36}
          className="text-pink-500"
        />
      </div>

      <h2 className="text-center font-display text-3xl text-white">
        Nova Palavra-passe
      </h2>

      <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-400">
        Escolhe uma nova palavra-passe segura para a tua
        conta.
      </p>

      <div className="mt-10 space-y-6">

        <PasswordInput
          label="Nova Palavra-passe"
          name="password"
        />

        <PasswordInput
          label="Confirmar Palavra-passe"
          name="confirmPassword"
        />

      </div>

      <button
        type="submit"
        className="
          mt-8
          inline-flex
          h-16
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-pink-500
          font-semibold
          text-white
          transition-all
          duration-300
          hover:scale-[1.02]
          hover:bg-pink-600
          hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
        "
      >
        Alterar Palavra-passe

        <ArrowRight size={20} />
      </button>

      <div className="mt-8 text-center">

        <Link
          href="/login"
          className="
            inline-flex
            items-center
            gap-2
            text-pink-500
            transition
            hover:text-pink-400
          "
        >
          Voltar ao Login
        </Link>

      </div>
    </form>
  );
}