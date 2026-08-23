"use client";

import { Tag } from "lucide-react";

export function CouponForm() {
  return (
    <div
      className="
        rounded-[28px]
        border
        border-pink-100
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-pink-500/10
            text-pink-500
          "
        >
          <Tag size={20} />
        </div>

        <div>
          <h3 className="font-semibold text-zinc-900">
            Cupão de desconto
          </h3>

          <p className="text-sm text-zinc-500">
            Tens algum código?
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Introduz o cupão"
          className="
            h-12
            flex-1
            rounded-full
            border
            border-pink-200
            bg-white
            px-5
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

        <button
          type="submit"
          className="
            h-12
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
            hover:shadow-[0_0_30px_rgba(255,46,136,.35)]
          "
        >
          Aplicar
        </button>
      </form>
    </div>
  );
}