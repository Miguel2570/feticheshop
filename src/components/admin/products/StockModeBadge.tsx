"use client";

import { useState } from "react";

type StockMode = "PHYSICAL" | "SUPPLIER" | "BOTH";

interface StockModeBadgeProps {
  productId: string;
  currentMode: StockMode;
}

export function StockModeBadge({ productId, currentMode }: StockModeBadgeProps) {
  const [mode, setMode] = useState<StockMode>(currentMode);

  const handleClick = async () => {
    const nextMode: StockMode = 
      mode === "PHYSICAL" ? "SUPPLIER" :
      mode === "SUPPLIER" ? "BOTH" :
      "PHYSICAL";

    setMode(nextMode);

    try {
      await fetch(`/api/admin/products/${productId}/stock-mode`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: nextMode }),
      });
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const styles = {
    PHYSICAL: "bg-emerald-50 text-emerald-600 border-emerald-200",
    SUPPLIER: "bg-sky-50 text-sky-600 border-sky-200",
    BOTH: "bg-pink-50 text-pink-600 border-pink-200",
  };

  const labels = {
    PHYSICAL: "🏪 Loja",
    SUPPLIER: "🚚 Fornecedor",
    BOTH: "🔄 Ambos",
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        rounded-full border px-3 py-1 text-xs font-semibold
        cursor-pointer transition-all
        ${styles[mode]}
      `}
      title="Clique para mudar o modo"
    >
      {labels[mode]}
    </button>
  );
}