"use client";

import { Check } from "lucide-react";

export function ShippingMethod() {
  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="font-display text-3xl" style={{ color: "#18181b" }}>
          Método de Envio
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#71717a" }}>
          Escolhe a forma como pretendes receber a tua encomenda.
        </p>
      </div>

      <div className="space-y-5">
        {/* Standard */}
        <label
          className="
            flex cursor-pointer items-center justify-between
            rounded-2xl border-2 border-pink-500 bg-pink-50/50
            p-6 transition-all
          "
        >
          <div className="flex items-center gap-5">
            <input type="radio" name="shipping" defaultChecked className="hidden" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white">
              <Check size={18} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "#18181b" }}>
                Envio Standard
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Entrega prevista entre 2 e 4 dias úteis.
              </p>
            </div>
          </div>
          <span className="text-lg font-bold" style={{ color: "#059669" }}>
            Grátis
          </span>
        </label>

        {/* Expresso */}
        <label
          className="
            flex cursor-pointer items-center justify-between
            rounded-2xl border border-zinc-200 bg-white
            p-6 transition-all hover:border-pink-300
          "
        >
          <div className="flex items-center gap-5">
            <input type="radio" name="shipping" className="hidden" />
            <div className="h-10 w-10 rounded-full border-2 border-zinc-300" />
            <div>
              <h3 className="font-semibold" style={{ color: "#18181b" }}>
                Envio Expresso
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Recebe amanhã (dias úteis).
              </p>
            </div>
          </div>
          <span className="text-lg font-bold" style={{ color: "#18181b" }}>
            €6.90
          </span>
        </label>
      </div>
    </section>
  );
}