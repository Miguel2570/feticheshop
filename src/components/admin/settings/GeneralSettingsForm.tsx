"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { UpdateGeneralSettings } from "@/actions/settings/UpdateGeneralSettings";

type Props = {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  vat: number;
  currency: string;
  freeShipping: number;
  shippingPrice: number;
};

type ActionState = {
  success?: boolean;
  error?: string;
} | null;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        inline-flex items-center justify-center
        h-10 px-6 text-sm font-semibold rounded-xl
        transition-all duration-200 cursor-pointer
        bg-pink-500 text-white
        hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {pending ? "A guardar..." : "Guardar Definições"}
    </button>
  );
}

export function GeneralSettingsForm({
  storeName,
  storeEmail,
  storePhone,
  storeAddress,
  vat,
  currency,
  freeShipping,
  shippingPrice,
}: Props) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    UpdateGeneralSettings,
    null
  );

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nome da Loja */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Nome da Loja
          </label>
          <input
            name="store_name"
            defaultValue={storeName}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Email
          </label>
          <input
            type="email"
            name="store_email"
            defaultValue={storeEmail}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Telefone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Telefone
          </label>
          <input
            name="store_phone"
            defaultValue={storePhone}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Morada */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Morada
          </label>
          <input
            name="store_address"
            defaultValue={storeAddress}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* IVA */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            IVA (%)
          </label>
          <input
            type="number"
            step="0.01"
            name="vat"
            defaultValue={vat}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Moeda */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Moeda
          </label>
          <input
            name="currency"
            defaultValue={currency}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Portes Grátis */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Portes Grátis Acima de (€)
          </label>
          <input
            type="number"
            step="0.01"
            name="free_shipping"
            defaultValue={freeShipping}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Preço dos Portes */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" style={{ color: "#3f3f46" }}>
            Preço dos Portes (€)
          </label>
          <input
            type="number"
            step="0.01"
            name="shipping_price"
            defaultValue={shippingPrice}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>
      </div>

      {/* MENSAGENS DE FEEDBACK */}
      {state?.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          ❌ {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
          ✅ Definições guardadas com sucesso!
        </div>
      )}

      {/* Botões */}
      <div className="flex justify-end border-t border-zinc-100 pt-5">
        <SubmitButton />
      </div>
    </form>
  );
}