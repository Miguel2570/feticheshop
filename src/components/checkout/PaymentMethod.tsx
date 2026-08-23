"use client";

import {
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";

export function PaymentMethod() {
  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="font-display text-3xl" style={{ color: "#18181b" }}>
          Método de Pagamento
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#71717a" }}>
          Escolhe como pretendes efetuar o pagamento.
        </p>
      </div>

      <div className="space-y-5">
        {/* MB Way */}
        <label
          className="
            flex cursor-pointer items-center justify-between
            rounded-2xl border-2 border-pink-500 bg-pink-50/50
            p-6 transition-all
          "
        >
          <div className="flex items-center gap-5">
            <input type="radio" name="payment" defaultChecked className="hidden" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500 text-white">
              <Smartphone size={22} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "#18181b" }}>
                MB Way
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Pagamento rápido através do teu telemóvel.
              </p>
            </div>
          </div>
        </label>

        {/* Multibanco */}
        <label
          className="
            flex cursor-pointer items-center justify-between
            rounded-2xl border border-zinc-200 bg-white
            p-6 transition-all hover:border-pink-300
          "
        >
          <div className="flex items-center gap-5">
            <input type="radio" name="payment" className="hidden" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
              <Landmark size={22} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "#18181b" }}>
                Multibanco
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Referência Multibanco após finalizar a compra.
              </p>
            </div>
          </div>
        </label>

        {/* Cartão */}
        <label
          className="
            flex cursor-pointer items-center justify-between
            rounded-2xl border border-zinc-200 bg-white
            p-6 transition-all hover:border-pink-300
          "
        >
          <div className="flex items-center gap-5">
            <input type="radio" name="payment" className="hidden" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
              <CreditCard size={22} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "#18181b" }}>
                Cartão Bancário
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Visa, Mastercard e outros cartões.
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Segurança */}
      <div className="mt-8 rounded-2xl border border-pink-100 bg-pink-50/50 p-5">
        <p className="font-medium" style={{ color: "#18181b" }}>
          🔒 Pagamento 100% Seguro
        </p>
        <p className="mt-2 text-sm leading-7" style={{ color: "#71717a" }}>
          Todos os pagamentos são protegidos através de
          encriptação SSL e processados de forma segura.
        </p>
      </div>
    </section>
  );
}