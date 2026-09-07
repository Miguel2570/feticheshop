"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Introduz o teu email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar email");
      }

      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm"
    >
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/10">
        <Mail size={36} className="text-pink-500" />
      </div>

      <h2 className="text-center font-display text-3xl text-zinc-900">
        Recuperar Palavra-passe
      </h2>

      <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-600">
        Introduz o teu endereço de email e enviaremos um
        link para redefinires a tua palavra-passe.
      </p>

      {success ? (
        /* ✅ Sucesso */
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-zinc-900">
            Email enviado!
          </h3>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Verifica a tua caixa de entrada. Enviámos um link para redefinires a tua palavra-passe.
          </p>

          <p className="mt-2 text-xs text-zinc-500">
            O link expira em 30 minutos.
          </p>

          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setEmail("");
            }}
            className="mt-6 text-sm font-semibold text-pink-500 hover:text-pink-600 cursor-pointer"
          >
            Usar outro email
          </button>
        </div>
      ) : (
        /* Formulário */
        <>
          <div className="mt-10">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.pt"
              className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-pink-500 text-sm font-semibold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-pink-600 hover:shadow-[0_0_35px_rgba(255,46,136,.35)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "A enviar..." : "Enviar Link"}
            <ArrowRight size={18} />
          </button>
        </>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-semibold text-pink-500 transition hover:text-pink-600"
        >
          Voltar ao Login
        </Link>
      </div>
    </form>
  );
}