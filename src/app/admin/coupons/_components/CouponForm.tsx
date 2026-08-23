"use client";

import { useState } from "react";

import { Prisma } from "@prisma/client";

import {
  CreateCoupon,
} from "@/actions/coupons/CreateCoupon";

import {
  UpdateCoupon,
} from "@/actions/coupons/UpdateCoupon";

type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountValue: Prisma.Decimal;
  isPercentage: boolean;
  maximumDiscount: Prisma.Decimal | null;
  minimumAmount: Prisma.Decimal | null;
  usageLimit: number | null;
  usagePerUser: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

type Props = {
  coupon?: Coupon;
};

export function CouponForm({ coupon }: Props) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!coupon;

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      if (isEditing) {
        await UpdateCoupon(coupon.id, formData);
      } else {
        await CreateCoupon(formData);
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  const labelClass = "text-sm font-medium";

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Código */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Código
          </label>
          <input
            name="code"
            required
            defaultValue={coupon?.code}
            placeholder="VERAO10"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Nome */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Nome
          </label>
          <input
            name="name"
            required
            defaultValue={coupon?.name}
            placeholder="Campanha de Verão"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1.5 md:col-span-2">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Descrição
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={coupon?.description ?? ""}
            className={`${inputClass} resize-none`}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Tipo de desconto */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Tipo de desconto
          </label>
          <select
            name="isPercentage"
            defaultValue={coupon?.isPercentage ? "true" : "false"}
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          >
            <option value="true" className="text-zinc-900">Percentagem</option>
            <option value="false" className="text-zinc-900">Valor Fixo (€)</option>
          </select>
        </div>

        {/* Valor do desconto */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Valor do desconto
          </label>
          <input
            type="number"
            step="0.01"
            name="discountValue"
            required
            defaultValue={coupon?.discountValue?.toString()}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Compra mínima */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Compra mínima (€)
          </label>
          <input
            type="number"
            step="0.01"
            name="minimumAmount"
            defaultValue={coupon?.minimumAmount?.toString()}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Desconto máximo */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Desconto máximo (€)
          </label>
          <input
            type="number"
            step="0.01"
            name="maximumDiscount"
            defaultValue={coupon?.maximumDiscount?.toString()}
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Limite de utilizações */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Limite de utilizações
          </label>
          <input
            type="number"
            name="usageLimit"
            defaultValue={coupon?.usageLimit ?? ""}
            placeholder="100"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Limite por utilizador */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Limite por utilizador
          </label>
          <input
            type="number"
            name="usagePerUser"
            defaultValue={coupon?.usagePerUser ?? ""}
            placeholder="1"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Data de início */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Data de início
          </label>
          <input
            type="datetime-local"
            name="startsAt"
            defaultValue={
              coupon?.startsAt
                ? new Date(coupon.startsAt).toISOString().slice(0, 16)
                : ""
            }
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Data de fim */}
        <div className="space-y-1.5">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Data de fim
          </label>
          <input
            type="datetime-local"
            name="endsAt"
            defaultValue={
              coupon?.endsAt
                ? new Date(coupon.endsAt).toISOString().slice(0, 16)
                : ""
            }
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          />
        </div>

        {/* Estado */}
        <div className="space-y-1.5 md:col-span-2">
          <label className={labelClass} style={{ color: "#3f3f46" }}>
            Estado
          </label>
          <select
            name="isActive"
            defaultValue={coupon?.isActive ? "true" : "false"}
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          >
            <option value="true" className="text-zinc-900">Ativo</option>
            <option value="false" className="text-zinc-900">Inativo</option>
          </select>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
        <button
          type="button"
          onClick={() => history.back()}
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            border-2 border-pink-500 text-pink-500
            hover:bg-pink-50
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            bg-pink-500 text-white
            hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "A guardar..." : isEditing ? "Guardar alterações" : "Criar cupão"}
        </button>
      </div>
    </form>
  );
}