"use client";

import { useState } from "react";

interface PaginationGotoProps {
  currentPage: number;
  totalPages: number;
  /** Query string sem "?" e sem "page" — ex: "brand=abc&sort=name" */
  baseQuery: string;
}

export function PaginationGoto({
  currentPage,
  totalPages,
  baseQuery,
}: PaginationGotoProps) {
  const [pageInput, setPageInput] = useState(String(currentPage));

  const handleGo = () => {
    const p = Math.max(1, Math.min(totalPages, Number(pageInput) || 1));
    const params = new URLSearchParams(baseQuery);
    params.set("page", String(p));
    window.location.href = `/admin/products?${params.toString()}`;
  };

  return (
    <div className="flex h-10 items-center gap-2 rounded-xl border-2 border-pink-200 bg-white px-3">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => e.key === "Enter" && handleGo()}
        onBlur={handleGo}
        className="h-8 w-14 rounded-lg border border-pink-100 bg-pink-50/50 px-2 text-center text-sm font-bold text-zinc-900 outline-none focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200"
        aria-label="Ir para página"
      />
      <span className="text-xs font-medium text-zinc-400">/ {totalPages}</span>
    </div>
  );
}