"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, MailCheck } from "lucide-react";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !/^\d{6}$/.test(code)) {
      setError("Introduz o email e um código de 6 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível verificar o email.");
      }

      setSuccess("Email confirmado com sucesso!");

      // ✅ Guardar tokens no localStorage
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      // ✅ Redirecionar para a home com login feito
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1200);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Introduz primeiro o teu email.");
      return;
    }

    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível reenviar o código.");
      }

      setSuccess("Se a conta existir e ainda não estiver verificada, foi enviado um novo código.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm"
    >
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/10">
        <MailCheck size={36} className="text-pink-500" />
      </div>

      <h2 className="text-center font-display text-3xl text-zinc-900">
        Verificar Email
      </h2>

      <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-600">
        Introduz o código de verificação que enviámos para o teu endereço de email.
      </p>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium text-zinc-700">Email</label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="email@exemplo.pt"
          className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
        />
      </div>

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium text-zinc-700">Código de verificação</label>

        <input
          name="code"
          type="text"
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="123456"
          className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-center text-xl tracking-[0.5em] text-zinc-900 outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
        />
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-600">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-pink-500 text-sm font-semibold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:bg-pink-600 hover:shadow-[0_0_35px_rgba(255,46,136,.35)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "A verificar..." : "Verificar Email"}
        <ArrowRight size={18} />
      </button>

      <div className="mt-8 text-center">
        <p className="text-zinc-500">Não recebeste o código?</p>

        <button
          type="button"
          onClick={resendCode}
          disabled={resending}
          className="mt-2 font-semibold text-pink-500 transition hover:text-pink-600 cursor-pointer disabled:opacity-50"
        >
          {resending ? "A reenviar..." : "Reenviar código"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-500 transition hover:text-pink-500"
        >
          Voltar ao Login
        </Link>
      </div>
    </form>
  );
}