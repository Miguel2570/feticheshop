"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useRouter } from "next/navigation";

export function SecurityForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/account/change-password", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao alterar palavra-passe");
      }

      setSuccess("Palavra-passe alterada com sucesso!");
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar palavra-passe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-pink-100 bg-white p-7 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Alterar Palavra-passe</h2>
          <p className="text-sm text-zinc-500">Utiliza uma palavra-passe forte e segura.</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-600">
          {success}
        </div>
      )}

      <div className="space-y-5">
        <PasswordInput label="Palavra-passe Atual" name="currentPassword" />
        <PasswordInput label="Nova Palavra-passe" name="newPassword" />
        <PasswordInput label="Confirmar Nova Palavra-passe" name="confirmPassword" />
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-xl bg-pink-50/70 p-4">
        <Lock size={18} className="mt-0.5 shrink-0 text-pink-500" />
        <div>
          <p className="text-sm font-semibold text-zinc-800">Recomendações de segurança</p>
          <ul className="mt-2 grid gap-1.5 text-sm text-zinc-600 sm:grid-cols-2">
            <li>• Mínimo 8 caracteres</li>
            <li>• Maiúsculas e minúsculas</li>
            <li>• Pelo menos um número</li>
            <li>• Pelo menos um símbolo</li>
          </ul>
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex
            h-12
            items-center
            justify-center
            rounded-full
            bg-pink-500
            px-6
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            cursor-pointer
            hover:bg-pink-600
            hover:shadow-lg
            hover:shadow-pink-500/25
            active:scale-95
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          {loading ? "A guardar..." : "Alterar Palavra-passe"}
        </button>
      </div>
    </form>
  );
}