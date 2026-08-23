"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ProductSortProps {
  defaultSort: string;
}

export function ProductSort({ defaultSort }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/product?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-600">Ordenar:</span>

      <select
        name="sort"
        defaultValue={defaultSort}
        onChange={handleSortChange}
        className="
          rounded-xl
          border
          border-pink-200
          bg-white
          px-4
          py-2.5
          text-sm
          text-zinc-900
          outline-none
          transition
          cursor-pointer
          hover:border-pink-300
          focus:border-pink-500
          focus:ring-2
          focus:ring-pink-200
        "
      >
        <option value="newest" className="bg-white text-zinc-900">
          Mais recentes
        </option>
        <option value="price_asc" className="bg-white text-zinc-900">
          Preço crescente
        </option>
        <option value="price_desc" className="bg-white text-zinc-900">
          Preço decrescente
        </option>
        <option value="best_sellers" className="bg-white text-zinc-900">
          Mais vendidos
        </option>
      </select>
    </div>
  );
}