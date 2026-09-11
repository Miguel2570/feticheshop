// src/components/product/SearchInput.tsx

"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

export function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="relative md:col-span-2 xl:col-span-2">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
        Pesquisar
      </label>
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          name="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Pesquisar produto..."
          className="h-[46px] w-full rounded-xl border border-pink-200 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
        />
      </div>
    </div>
  );
}