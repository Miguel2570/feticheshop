"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useState } from "react";

export function ProductToolbar() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const updateParam = (
    key: string,
    value: string,
  ) => {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(
      `/admin/products?${params.toString()}`,
    );
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-[#111]
        p-6
      "
    >
      <div className="flex flex-wrap gap-4">

        {/* Pesquisa */}

        <div className="relative min-w-[320px] flex-1">

          <Search
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
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam(
                  "search",
                  search,
                );
              }
            }}
            placeholder="Pesquisar produtos..."
            className="
              w-full
              rounded-2xl
              border
              border-zinc-700
              bg-zinc-900
              py-3
              pl-12
              pr-4
              text-white
              outline-none
              transition
              focus:border-pink-500
            "
          />

        </div>

        {/* Estado */}

        <select
          defaultValue={
            searchParams.get("status") ?? ""
          }
          onChange={(e) =>
            updateParam(
              "status",
              e.target.value,
            )
          }
          className="
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            text-white
            outline-none
          "
        >
          <option value="">
            Todos Estados
          </option>

          <option value="ACTIVE">
            Ativos
          </option>

          <option value="DRAFT">
            Rascunhos
          </option>

          <option value="OUT_OF_STOCK">
            Sem Stock
          </option>

          <option value="HIDDEN">
            Ocultos
          </option>

          <option value="ARCHIVED">
            Arquivados
          </option>

        </select>

        {/* Ordenação */}

        <select
          defaultValue={
            searchParams.get("sort") ??
            "newest"
          }
          onChange={(e) =>
            updateParam(
              "sort",
              e.target.value,
            )
          }
          className="
            rounded-2xl
            border
            border-zinc-700
            bg-zinc-900
            px-4
            text-white
            outline-none
          "
        >
          <option value="newest">
            Mais recentes
          </option>

          <option value="oldest">
            Mais antigos
          </option>

          <option value="priceAsc">
            Preço ↑
          </option>

          <option value="priceDesc">
            Preço ↓
          </option>

          <option value="stockAsc">
            Stock ↑
          </option>

          <option value="stockDesc">
            Stock ↓
          </option>

          <option value="name">
            Nome
          </option>

        </select>

        {/* Botão filtros */}

        <button
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-zinc-700
            px-5
            text-zinc-300
            transition
            hover:border-pink-500
            hover:text-white
          "
        >
          <SlidersHorizontal
            size={18}
          />

          Filtros

        </button>

        {/* Limpar */}

        <button
          onClick={() =>
            router.push("/admin/products")
          }
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-red-500/20
            px-5
            text-red-400
            transition
            hover:bg-red-500/10
          "
        >
          <X size={18} />

          Limpar

        </button>

      </div>
    </div>
  );
}