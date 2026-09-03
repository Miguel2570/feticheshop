"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { PasswordInput } from "./PasswordInput";
import { SocialLogin } from "./SocialLogin";

export function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Preenche todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    if (password.length < 8) {
      setError("A palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }

    if (!terms) {
      setError("Tens de aceitar os Termos e Condições e a Política de Privacidade.");
      return;
    }

    setLoading(true);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Não foi possível criar a conta.");
      }

      // ✅ Redirecionar para verificação de email
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
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
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Primeiro Nome
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            placeholder="João"
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
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Último Nome
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            placeholder="Silva"
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

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </label>

          <input
            type="email"
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

        <div className="md:col-span-2">
          <PasswordInput
            label="Palavra-passe"
            name="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="md:col-span-2">
          <PasswordInput
            label="Confirmar Palavra-passe"
            name="confirmPassword"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={terms}
          onChange={(event) => setTerms(event.target.checked)}
          className="
            mt-0.5
            h-4
            w-4
            rounded
            border-pink-200
            bg-white
            accent-pink-500
            cursor-pointer
          "
        />

        <span className="text-sm leading-6 text-zinc-600">
          Li e aceito os{" "}
          <Link
            href="/terms"
            className="text-pink-500 transition hover:text-pink-600 font-medium"
          >
            Termos e Condições
          </Link>{" "}
          e a{" "}
          <Link
            href="/privacy"
            className="text-pink-500 transition hover:text-pink-600 font-medium"
          >
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

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
        {loading ? "A criar conta..." : "Criar Conta"}

        <ArrowRight size={18} />
      </button>

      <SocialLogin />

      <div className="mt-8 text-center">
        <p className="text-zinc-500">
          Já tens conta?
        </p>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="
            mt-2
            inline-block
            font-semibold
            text-pink-500
            transition
            cursor-pointer
            hover:text-pink-600
            hover:underline
          "
        >
          Iniciar Sessão
        </button>
      </div>
    </form>
  );
}