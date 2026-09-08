"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export function ShippingMethod() {
  const [selectedMethod, setSelectedMethod] = useState<"standard" | "express">("standard");

  // ✅ Emitir evento quando o método muda
  useEffect(() => {
    const shippingCost = selectedMethod === "express" ? 6.90 : 0;
    
    window.dispatchEvent(
      new CustomEvent("shipping-change", { 
        detail: { 
          method: selectedMethod, 
          cost: shippingCost 
        } 
      })
    );
  }, [selectedMethod]);

  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-display text-2xl sm:text-3xl" style={{ color: "#18181b" }}>
          Método de Envio
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#71717a" }}>
          Escolhe a forma como pretendes receber a tua encomenda.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Standard */}
        <label
          className={`
            flex cursor-pointer items-center gap-3 sm:gap-5
            rounded-2xl border-2
            p-4 sm:p-6 transition-all
            ${selectedMethod === "standard" ? "border-pink-500 bg-pink-50/50" : "border-zinc-200 bg-white hover:border-pink-300"}
          `}
          onClick={() => setSelectedMethod("standard")}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedMethod === "standard"}
            onChange={() => setSelectedMethod("standard")}
            className="sr-only"
          />
          
          <div
            className={`
              flex h-8 w-8 sm:h-10 sm:w-10
              shrink-0
              items-center justify-center
              rounded-full
              transition-all
              ${selectedMethod === "standard" ? "bg-pink-500 text-white" : "border-2 border-zinc-300"}
            `}
          >
            {selectedMethod === "standard" && <Check size={16} />}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: "#18181b" }}>
              Envio Standard
            </h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm" style={{ color: "#71717a" }}>
              Entrega prevista entre 2 e 4 dias úteis.
            </p>
          </div>
          
          <span className="shrink-0 text-base sm:text-lg font-bold" style={{ color: "#059669" }}>
            Grátis
          </span>
        </label>

        {/* Expresso */}
        <label
          className={`
            flex cursor-pointer items-center gap-3 sm:gap-5
            rounded-2xl border-2
            p-4 sm:p-6 transition-all
            ${selectedMethod === "express" ? "border-pink-500 bg-pink-50/50" : "border-zinc-200 bg-white hover:border-pink-300"}
          `}
          onClick={() => setSelectedMethod("express")}
        >
          <input
            type="radio"
            name="shipping"
            checked={selectedMethod === "express"}
            onChange={() => setSelectedMethod("express")}
            className="sr-only"
          />
          
          <div
            className={`
              flex h-8 w-8 sm:h-10 sm:w-10
              shrink-0
              items-center justify-center
              rounded-full
              transition-all
              ${selectedMethod === "express" ? "bg-pink-500 text-white" : "border-2 border-zinc-300"}
            `}
          >
            {selectedMethod === "express" && <Check size={16} />}
          </div>
          
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-semibold" style={{ color: "#18181b" }}>
              Envio Expresso
            </h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm" style={{ color: "#71717a" }}>
              Recebe amanhã (dias úteis).
            </p>
          </div>
          
          <span className="shrink-0 text-base sm:text-lg font-bold" style={{ color: "#18181b" }}>
            €6.90
          </span>
        </label>
      </div>
    </section>
  );
}