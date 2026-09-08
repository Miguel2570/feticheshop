"use client";

import { useState } from "react";
import {
  Landmark,
  Smartphone,
  Check,
} from "lucide-react";

type PaymentMethod = "MBWAY" | "MULTIBANCO";

interface PaymentMethodProps {
  onSelect: (method: PaymentMethod, details?: {
    phoneNumber?: string;
  }) => void;
}

export function PaymentMethod({ onSelect }: PaymentMethodProps) {
  const [selected, setSelected] = useState<PaymentMethod>("MBWAY");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const inputStyle = {
    color: "#18181b !important",
    WebkitTextFillColor: "#18181b !important",
    caretColor: "#18181b !important",
    backgroundColor: "#ffffff !important",
  } as React.CSSProperties;

  const handleSelect = (method: PaymentMethod) => {
    setSelected(method);
    setPhoneError("");

    if (method === "MBWAY") {
      onSelect(method, { phoneNumber });
    } else {
      onSelect(method);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setPhoneError("");

    if (selected === "MBWAY") {
      onSelect("MBWAY", { phoneNumber: value });
    }
  };

  const validatePhone = (): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length !== 9) {
      setPhoneError("O número de telemóvel deve ter 9 dígitos.");
      return false;
    }

    return true;
  };

  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
      <div className="mb-5 sm:mb-6 md:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl" style={{ color: "#18181b" }}>
          Método de Pagamento
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm" style={{ color: "#71717a" }}>
          Escolhe como pretendes efetuar o pagamento.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {/* MB Way */}
        <div>
          <button
            type="button"
            onClick={() => handleSelect("MBWAY")}
            className={`
              flex w-full cursor-pointer items-center gap-3 sm:gap-5
              rounded-2xl border-2 p-3.5 sm:p-5 md:p-6 transition-all text-left
              ${selected === "MBWAY"
                ? "border-pink-500 bg-pink-50/50"
                : "border-zinc-200 bg-white hover:border-pink-300"
              }
            `}
          >
            <div
              className={`
                flex h-10 w-10 sm:h-12 sm:w-12
                shrink-0
                items-center justify-center
                rounded-xl
                ${selected === "MBWAY" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"}
              `}
            >
              <Smartphone size={18} className="sm:size-[22px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold" style={{ color: "#18181b" }}>
                MB Way
              </h3>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-5 sm:leading-6" style={{ color: "#71717a" }}>
                Pagamento rápido através do teu telemóvel.
              </p>
            </div>

            <div
              className={`
                flex h-5 w-5
                shrink-0
                items-center justify-center
                rounded-full border-2
                ${selected === "MBWAY" ? "border-pink-500" : "border-zinc-300"}
              `}
            >
              {selected === "MBWAY" && (
                <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
              )}
            </div>
          </button>

          {/* Campo de telemóvel para MB Way */}
          {selected === "MBWAY" && (
            <div className="mt-3 rounded-xl border border-pink-200 bg-pink-50/50 p-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Número de Telemóvel
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={validatePhone}
                placeholder="912 345 678"
                maxLength={9}
                className="
                  w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm
                  outline-none transition-all
                  placeholder:text-zinc-400
                  hover:border-pink-300
                  focus:border-pink-500 focus:ring-2 focus:ring-pink-200
                "
                style={inputStyle}
              />
              {phoneError ? (
                <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>
              ) : (
                <p className="mt-1.5 text-xs text-zinc-500">
                  Irás receber uma notificação no teu telemóvel para confirmares o pagamento.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Multibanco */}
        <div>
          <button
            type="button"
            onClick={() => handleSelect("MULTIBANCO")}
            className={`
              flex w-full cursor-pointer items-center gap-3 sm:gap-5
              rounded-2xl border-2 p-3.5 sm:p-5 md:p-6 transition-all text-left
              ${selected === "MULTIBANCO"
                ? "border-pink-500 bg-pink-50/50"
                : "border-zinc-200 bg-white hover:border-pink-300"
              }
            `}
          >
            <div
              className={`
                flex h-10 w-10 sm:h-12 sm:w-12
                shrink-0
                items-center justify-center
                rounded-xl
                ${selected === "MULTIBANCO" ? "bg-pink-500 text-white" : "bg-zinc-100 text-zinc-600"}
              `}
            >
              <Landmark size={18} className="sm:size-[22px]" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold" style={{ color: "#18181b" }}>
                Multibanco
              </h3>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-5 sm:leading-6" style={{ color: "#71717a" }}>
                Referência Multibanco após finalizar a compra.
              </p>
            </div>

            <div
              className={`
                flex h-5 w-5
                shrink-0
                items-center justify-center
                rounded-full border-2
                ${selected === "MULTIBANCO" ? "border-pink-500" : "border-zinc-300"}
              `}
            >
              {selected === "MULTIBANCO" && (
                <div className="h-2.5 w-2.5 rounded-full bg-pink-500" />
              )}
            </div>
          </button>

          {/* Info Multibanco */}
          {selected === "MULTIBANCO" && (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs text-zinc-600">
                Após finalizares a compra, iremos gerar uma referência Multibanco e enviar para o teu email.
                Podes pagar num multibanco ou homebanking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Segurança */}
      <div className="mt-5 sm:mt-6 md:mt-8 rounded-2xl border border-pink-100 bg-pink-50/50 p-4 sm:p-5">
        <p className="text-sm sm:text-base font-medium" style={{ color: "#18181b" }}>
          Pagamento 100% Seguro
        </p>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-7" style={{ color: "#71717a" }}>
          Todos os pagamentos são protegidos através de
          encriptação SSL e processados de forma segura.
        </p>
      </div>
    </section>
  );
}