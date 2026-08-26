"use client";

import { useState } from "react";
import {
  Landmark,
  Smartphone,
} from "lucide-react";

type PaymentMethod = "MBWAY" | "MULTIBANCO";

interface PaymentMethodProps {
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethod({ onSelect }: PaymentMethodProps) {
  const [selected, setSelected] = useState<PaymentMethod>("MBWAY");

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    onSelect(method);
  };

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
        <button
          type="button"
          onClick={() => handleSelect("MBWAY")}
          className={`
            flex w-full cursor-pointer items-center justify-between
            rounded-2xl border-2 p-6 transition-all text-left
            ${selected === "MBWAY"
              ? "border-pink-500 bg-pink-50/50"
              : "border-zinc-200 bg-white hover:border-pink-300"
            }
          `}
        >
          <div className="flex items-center gap-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected === "MBWAY" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"}`}>
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

          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected === "MBWAY" ? "border-pink-500" : "border-zinc-300"}`}>
            {selected === "MBWAY" && (
              <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
            )}
          </div>
        </button>

        {/* Multibanco */}
        <button
          type="button"
          onClick={() => handleSelect("MULTIBANCO")}
          className={`
            flex w-full cursor-pointer items-center justify-between
            rounded-2xl border-2 p-6 transition-all text-left
            ${selected === "MULTIBANCO"
              ? "border-pink-500 bg-pink-50/50"
              : "border-zinc-200 bg-white hover:border-pink-300"
            }
          `}
        >
          <div className="flex items-center gap-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${selected === "MULTIBANCO" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"}`}>
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

          <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected === "MULTIBANCO" ? "border-pink-500" : "border-zinc-300"}`}>
            {selected === "MULTIBANCO" && (
              <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
            )}
          </div>
        </button>
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