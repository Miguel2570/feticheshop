"use client";

import { useState } from "react";

export function BillingForm() {
  const [saving, setSaving] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email") || null,
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || null,
      postalCode: formData.get("postalCode"),
      city: formData.get("city"),
      country: formData.get("country") || "Portugal",
    };

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao guardar morada");
      }

      const address = await response.json();
      setSavedAddressId(address.id);

      // Notificar o checkout
      window.dispatchEvent(
        new CustomEvent("address-saved", { detail: address })
      );
    } catch (error) {
      alert("Erro ao guardar morada");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="font-display text-3xl" style={{ color: "#18181b" }}>
          Dados de Faturação
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#71717a" }}>
          Introduz os teus dados para finalizar a compra.
        </p>
      </div>

      <form onSubmit={handleSaveAddress} className="grid gap-6 md:grid-cols-2">
        {/* Primeiro Nome */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Primeiro Nome
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="João"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Último Nome */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Último Nome
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="Silva"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email@exemplo.pt"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Telemóvel */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Telemóvel
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+351 912 345 678"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Morada */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Morada
          </label>
          <input
            type="text"
            name="addressLine1"
            placeholder="Rua Exemplo nº 10"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Código Postal */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Código Postal
          </label>
          <input
            type="text"
            name="postalCode"
            placeholder="2400-000"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Cidade
          </label>
          <input
            type="text"
            name="city"
            placeholder="Leiria"
            required
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* País */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            País
          </label>
          <select
            name="country"
            defaultValue="Portugal"
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          >
            <option className="text-zinc-900">Portugal</option>
            <option className="text-zinc-900">Espanha</option>
          </select>
        </div>

        {/* NIF */}
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            NIF (Opcional)
          </label>
          <input
            type="text"
            name="vatNumber"
            placeholder="123456789"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Botão Guardar */}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex h-11 px-6 text-sm font-semibold rounded-xl
              bg-pink-500 text-white hover:bg-pink-600
              transition-all disabled:opacity-50 cursor-pointer
            "
          >
            {saving
              ? "A guardar..."
              : savedAddressId
                ? "✓ Morada Guardada"
                : "Guardar Morada"}
          </button>
        </div>
      </form>
    </section>
  );
}