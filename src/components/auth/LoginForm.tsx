"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Introdu o email e a palavra-passe.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 403 &&
          data.code === "EMAIL_NOT_VERIFIED"
        ) {
          router.push(
            `/verify-email?email=${encodeURIComponent(
              email.trim().toLowerCase()
            )}`
          );
          return;
        }

        throw new Error(
          data.message || "Não foi possível iniciar sessão."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ocorreu um erro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-[30px]
        border
        border-pink-100
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
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

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
              Palavra-passe
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium transition"
              style={{ color: "#ec4899" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d1105a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#ec4899")}
            >
              Esqueceste-te?
            </Link>
          </div>

          <PasswordInput
            name="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="
              h-4
              w-4
              rounded
              border-pink-200
              bg-white
              accent-pink-500
              cursor-pointer
            "
          />

          <span className="text-sm" style={{ color: "#52525b" }}>
            Manter sessão iniciada
          </span>
        </label>
      </div>

      {error && (
        <div
          className="
            mt-5
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-500
          "
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
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
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "A entrar..." : "Iniciar Sessão"}

        <ArrowRight size={18} />
      </button>

      <SocialLogin />

      <div className="mt-8 text-center">
        <p style={{ color: "#71717a" }}>
          Ainda não tens conta?
        </p>

        <Link
          href="/register"
          className="mt-2 inline-block font-semibold transition"
          style={{ color: "#ec4899" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#d1105a")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#ec4899")}
        >
          Criar Conta
        </Link>
      </div>
    </form>
  );
}