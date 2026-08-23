"use client";

import { useState } from "react";
import { Save, User } from "lucide-react";

interface SettingsFormProps {
  defaultValues?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate?: string;
  };
}

export function SettingsForm({
  defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
  },
}: SettingsFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      // TODO: await updateProfileAction(formData)
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-pink-100 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Dados Pessoais</h2>
          <p className="text-sm text-zinc-500">Atualiza as informações da tua conta.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Primeiro Nome
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={defaultValues.firstName}
            className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Último Nome
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={defaultValues.lastName}
            className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={defaultValues.email}
            className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Telemóvel
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={defaultValues.phone}
            className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            name="birthDate"
            defaultValue={defaultValues.birthDate}
            className="h-12 w-full rounded-xl border border-pink-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 cursor-pointer"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-pink-500 px-6 text-sm font-semibold text-white transition-all hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25 cursor-pointer disabled:opacity-50"
        >
          <Save size={17} />
          {loading ? "A guardar..." : "Guardar Alterações"}
        </button>
      </div>
    </form>
  );
}