// components/admin/products/ProductToolbar.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

export function ProductToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );

  const updateParam = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Quando alteramos um filtro,
    // voltamos sempre para a primeira página.
    params.delete("page");

    router.push(
      `/admin/products?${params.toString()}`
    );
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/admin/products");
  };

  return (
    <div
      className="
        w-full
        min-w-0
        rounded-xl
        border
        border-zinc-200
        bg-white
        p-3
        shadow-sm

        sm:rounded-2xl
        sm:p-4

        lg:p-5
      "
    >
      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-3

          sm:grid-cols-2

          lg:flex
          lg:flex-wrap
          lg:items-center
        "
      >
        {/* =================================================
            PESQUISA
        ================================================= */}

        <div
          className="
            relative
            w-full
            min-w-0

            lg:min-w-[250px]
            lg:flex-1
          "
        >
          <Search
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-zinc-400

              sm:left-4
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam(
                  "search",
                  search
                );
              }
            }}
            placeholder="Pesquisar produtos..."
            className="
              h-10
              w-full
              min-w-0
              rounded-xl
              border-2
              border-zinc-200
              bg-zinc-50
              pl-10
              pr-3
              text-sm
              text-zinc-900
              outline-none
              transition

              placeholder:text-zinc-400

              focus:border-pink-500
              focus:ring-2
              focus:ring-pink-200

              sm:pl-11
              sm:pr-4
            "
          />
        </div>

        {/* =================================================
            ESTADO
        ================================================= */}

        <select
          defaultValue={
            searchParams.get("status") ?? ""
          }
          onChange={(e) =>
            updateParam(
              "status",
              e.target.value
            )
          }
          className="
            h-10
            w-full
            min-w-0
            cursor-pointer
            rounded-xl
            border-2
            border-zinc-200
            bg-white
            px-3
            text-sm
            text-zinc-900
            outline-none
            transition

            focus:border-pink-500
            focus:ring-2
            focus:ring-pink-200

            sm:px-4

            lg:w-auto
            lg:min-w-[150px]
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

        {/* =================================================
            ORDENAÇÃO
        ================================================= */}

        <select
          defaultValue={
            searchParams.get("sort") ??
            "newest"
          }
          onChange={(e) =>
            updateParam(
              "sort",
              e.target.value
            )
          }
          className="
            h-10
            w-full
            min-w-0
            cursor-pointer
            rounded-xl
            border-2
            border-zinc-200
            bg-white
            px-3
            text-sm
            text-zinc-900
            outline-none
            transition

            focus:border-pink-500
            focus:ring-2
            focus:ring-pink-200

            sm:px-4

            lg:w-auto
            lg:min-w-[150px]
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
        {searchParams.toString() && (
          <button
            type="button"
            onClick={clearFilters}
            className="
              inline-flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-pink-500
              px-4
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-pink-600
              cursor-pointer

              sm:col-span-2

              lg:w-auto
              lg:px-5
            "
          >
            <X size={16} />

            <span>
              Limpar
            </span>
          </button>
        )}
      </div>
    </div>
  );
}