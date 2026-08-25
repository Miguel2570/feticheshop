"use client";

import { useState } from "react";

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

  discountValue: string | number;
  isPercentage: boolean;

  maximumDiscount: string | number | null;
  minimumAmount: string | number | null;

  usageLimit: number | null;
  usagePerUser: number | null;

  startsAt: Date | string | null;
  endsAt: Date | string | null;

  isActive: boolean;
};

type Props = {
  coupon?: Coupon;
};

export function CouponForm({ coupon }: Props) {
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(coupon);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    try {
      if (isEditing && coupon) {
        await UpdateCoupon(coupon.id, formData);
      } else {
        await CreateCoupon(formData);
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  const labelClass =
    "text-sm font-medium text-zinc-700";

  return (
    <form
      action={handleSubmit}
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2">

        {/* Código */}
        <div className="space-y-1.5">
          <label
            htmlFor="code"
            className={labelClass}
          >
            Código
          </label>

          <input
            id="code"
            name="code"
            required
            defaultValue={coupon?.code ?? ""}
            placeholder="VERAO10"
            className={inputClass}
          />
        </div>

        {/* Nome */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className={labelClass}
          >
            Nome
          </label>

          <input
            id="name"
            name="name"
            required
            defaultValue={coupon?.name ?? ""}
            placeholder="Campanha de Verão"
            className={inputClass}
          />
        </div>

        {/* Descrição */}
        <div className="space-y-1.5 md:col-span-2">
          <label
            htmlFor="description"
            className={labelClass}
          >
            Descrição
          </label>

          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={coupon?.description ?? ""}
            placeholder="Descrição do cupão..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Tipo de desconto */}
        <div className="space-y-1.5">
          <label
            htmlFor="isPercentage"
            className={labelClass}
          >
            Tipo de desconto
          </label>

          <select
            id="isPercentage"
            name="isPercentage"
            defaultValue={
              coupon?.isPercentage
                ? "true"
                : "false"
            }
            className={`${inputClass} cursor-pointer`}
          >
            <option value="true">
              Percentagem
            </option>

            <option value="false">
              Valor Fixo (€)
            </option>
          </select>
        </div>

        {/* Valor do desconto */}
        <div className="space-y-1.5">
          <label
            htmlFor="discountValue"
            className={labelClass}
          >
            Valor do desconto
          </label>

          <input
            id="discountValue"
            type="number"
            step="0.01"
            min="0.01"
            name="discountValue"
            required
            defaultValue={
              coupon?.discountValue?.toString() ?? ""
            }
            placeholder="10"
            className={inputClass}
          />
        </div>

        {/* Compra mínima */}
        <div className="space-y-1.5">
          <label
            htmlFor="minimumAmount"
            className={labelClass}
          >
            Compra mínima (€)
          </label>

          <input
            id="minimumAmount"
            type="number"
            step="0.01"
            min="0"
            name="minimumAmount"
            defaultValue={
              coupon?.minimumAmount?.toString() ?? ""
            }
            placeholder="50"
            className={inputClass}
          />
        </div>

        {/* Desconto máximo */}
        <div className="space-y-1.5">
          <label
            htmlFor="maximumDiscount"
            className={labelClass}
          >
            Desconto máximo (€)
          </label>

          <input
            id="maximumDiscount"
            type="number"
            step="0.01"
            min="0"
            name="maximumDiscount"
            defaultValue={
              coupon?.maximumDiscount?.toString() ?? ""
            }
            placeholder="20"
            className={inputClass}
          />
        </div>

        {/* Limite de utilizações */}
        <div className="space-y-1.5">
          <label
            htmlFor="usageLimit"
            className={labelClass}
          >
            Limite de utilizações
          </label>

          <input
            id="usageLimit"
            type="number"
            min="1"
            name="usageLimit"
            defaultValue={
              coupon?.usageLimit ?? ""
            }
            placeholder="100"
            className={inputClass}
          />
        </div>

        {/* Limite por utilizador */}
        <div className="space-y-1.5">
          <label
            htmlFor="usagePerUser"
            className={labelClass}
          >
            Limite por utilizador
          </label>

          <input
            id="usagePerUser"
            type="number"
            min="1"
            name="usagePerUser"
            defaultValue={
              coupon?.usagePerUser ?? ""
            }
            placeholder="1"
            className={inputClass}
          />
        </div>

        {/* Data de início */}
        <div className="space-y-1.5">
          <label
            htmlFor="startsAt"
            className={labelClass}
          >
            Data de início
          </label>

          <input
            id="startsAt"
            type="datetime-local"
            name="startsAt"
            defaultValue={
              coupon?.startsAt
                ? new Date(coupon.startsAt)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            className={`${inputClass} cursor-pointer`}
          />
        </div>

        {/* Data de fim */}
        <div className="space-y-1.5">
          <label
            htmlFor="endsAt"
            className={labelClass}
          >
            Data de fim
          </label>

          <input
            id="endsAt"
            type="datetime-local"
            name="endsAt"
            defaultValue={
              coupon?.endsAt
                ? new Date(coupon.endsAt)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            className={`${inputClass} cursor-pointer`}
          />
        </div>

        {/* Estado */}
        <div className="space-y-1.5 md:col-span-2">
          <label
            htmlFor="isActive"
            className={labelClass}
          >
            Estado
          </label>

          <select
            id="isActive"
            name="isActive"
            defaultValue={
              coupon?.isActive
                ? "true"
                : "false"
            }
            className={`${inputClass} cursor-pointer`}
          >
            <option value="true">
              Ativo
            </option>

            <option value="false">
              Inativo
            </option>
          </select>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="
            inline-flex h-10 items-center justify-center
            rounded-xl border-2 border-pink-500
            px-5 text-sm font-semibold
            text-pink-500
            transition-all duration-200
            hover:bg-pink-50
            cursor-pointer
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            inline-flex h-10 items-center justify-center
            rounded-xl bg-pink-500
            px-5 text-sm font-semibold text-white
            transition-all duration-200
            hover:bg-pink-600
            hover:shadow-lg hover:shadow-pink-500/25
            disabled:cursor-not-allowed
            disabled:opacity-50
            cursor-pointer
          "
        >
          {loading
            ? "A guardar..."
            : isEditing
              ? "Guardar alterações"
              : "Criar cupão"}
        </button>
      </div>
    </form>
  );
}