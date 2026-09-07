"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { PasswordInput } from "./PasswordInput";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token inválido ou em falta.");
      return;
    }

    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token, 
          newPassword: password  // ← CORRIGIDO AQUI
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir palavra-passe");
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-[30px] border border-pink-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-zinc-900">
          Palavra-passe alterada!
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          A redirecionar para o login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm"
    >
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/10">
        <Lock size={36} className="text-pink-500" />
      </div>

      <h2 className="text-center font-display text-3xl text-zinc-900">
        Nova Palavra-passe
      </h2>

      <p className="mx-auto mt-4 max-w-md text-center leading-7 text-zinc-600">
        Escolhe uma nova palavra-passe segura para a tua conta.
      </p>

      <div className="mt-10 space-y-6">
        <PasswordInput
          label="Nova Palavra-passe"
          name="password"
          value={password}
          onChange={setPassword}
        />

        <PasswordInput
          label="Confirmar Palavra-passe"
          name="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
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
        {loading ? "A alterar..." : "Alterar Palavra-passe"}
        <ArrowRight size={18} />
      </button>

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