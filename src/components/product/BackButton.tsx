// src/components/product/BackButton.tsx

"use client";

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="
        inline-flex
        items-center
        gap-1.5
        text-sm
        font-semibold
        transition-colors
        hover:text-pink-500
      "
      style={{ color: "#18181b" }}
    >
      <ArrowLeft size={14} />
      Voltar
    </button>
  );
}