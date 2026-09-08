"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface NewAddressFormProps {
  onClose: () => void;
}

export function NewAddressForm({ onClose }: NewAddressFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  // ✅ ESTILO PARA FORÇAR TEXTO PRETO
  const inputStyle = {
    color: "#18181b !important",
    WebkitTextFillColor: "#18181b !important",
    caretColor: "#18181b !important",
    backgroundColor: "#ffffff !important",
  } as React.CSSProperties;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      type: "SHIPPING",
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email") || null,
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || null,
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country") || "Portugal",
      vatNumber: formData.get("vatNumber") || null,
    };

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao guardar morada");
      }

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao guardar morada");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
    >
      {/* CABEÇALHO */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">
            Nova Morada
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            Preenche os dados da tua morada.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            shrink-0 rounded-full p-2
            text-zinc-400
            transition-colors
            hover:bg-zinc-100
            hover:text-zinc-600
            cursor-pointer
          "
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>

      {/* CAMPOS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* PRIMEIRO NOME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Primeiro Nome
          </label>

          <input
            type="text"
            name="firstName"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="João"
          />
        </div>

        {/* ÚLTIMO NOME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Último Nome
          </label>

          <input
            type="text"
            name="lastName"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="Silva"
          />
        </div>

        {/* TELEMÓVEL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Telemóvel
          </label>

          <input
            type="tel"
            name="phone"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="+351 912 345 678"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            className={inputClass}
            style={inputStyle}
            placeholder="email@exemplo.pt"
          />
        </div>

        {/* MORADA */}
        <div className="sm:col-span-2 lg:col-span-4">
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Morada
          </label>

          <input
            type="text"
            name="addressLine1"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="Rua Exemplo nº 10"
          />
        </div>

        {/* CÓDIGO POSTAL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Código Postal
          </label>

          <input
            type="text"
            name="postalCode"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="2400-000"
          />
        </div>

        {/* CIDADE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Cidade
          </label>

          <input
            type="text"
            name="city"
            required
            className={inputClass}
            style={inputStyle}
            placeholder="Leiria"
          />
        </div>

        {/* PAÍS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            País
          </label>

          <select
            name="country"
            defaultValue="Portugal"
            className={`${inputClass} cursor-pointer`}
            style={inputStyle}
          >
            <option className="text-zinc-900">Portugal</option>
          </select>
        </div>

        {/* NIF */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            NIF (Opcional)
          </label>

          <input
            type="text"
            name="vatNumber"
            className={inputClass}
            style={inputStyle}
            placeholder="123456789"
          />
        </div>
      </div>

      {/* BOTÕES */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="
            inline-flex h-10
            w-full sm:w-auto
            items-center justify-center
            rounded-xl
            bg-pink-500
            px-5
            text-sm font-semibold
            text-white
            transition-all
            hover:bg-pink-600
            disabled:cursor-not-allowed
            disabled:opacity-50
            cursor-pointer
          "
        >
          {saving ? "A guardar..." : "Guardar Morada"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="
            inline-flex h-10
            w-full sm:w-auto
            items-center justify-center
            rounded-xl
            bg-zinc-100
            px-5
            text-sm font-semibold
            text-zinc-700
            transition-all
            hover:bg-zinc-200
            cursor-pointer
          "
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}