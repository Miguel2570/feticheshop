"use client";

import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

export function Search() {
  const [value, setValue] = useState("");

  return (
    <div className="relative">

      <SearchIcon
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-zinc-500
        "
      />

      <input
        type="text"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        placeholder="Pesquisar produtos..."
        className="
          h-12
          w-full
          rounded-full
          border
          border-zinc-800
          bg-zinc-900
          pl-11
          pr-4
          text-sm
          text-white
          outline-none
          transition-all
          duration-300
          placeholder:text-zinc-500
          focus:border-pink-500
          focus:ring-2
          focus:ring-pink-500/20
        "
      />

      {value.length > 0 && (
        <div
          className="
            absolute
            left-0
            right-0
            top-14
            overflow-hidden
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-950
            shadow-2xl
          "
        >
          <div className="p-4 text-sm text-zinc-400">
            A pesquisa em tempo real será ligada à API.
          </div>
        </div>
      )}

    </div>
  );
}