"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProductPaginationProps {
  pagination: {
    page: number;
    pages: number;
    total: number;
    perPage: number;
  };
}

export function ProductPagination({
  pagination,
}: ProductPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/admin/products?${params.toString()}`);
  }

  // Converter para number
  const page = Number(pagination.page) || 1;
  const pages = Number(pagination.pages) || 1;
  const total = Number(pagination.total) || 0;

  if (pages <= 1) {
    return null;
  }

  // Gerar páginas com ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];

    for (let i = 1; i <= pages; i++) {
      if (
        i === 1 ||
        i === pages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      }
    }

    const rangeWithDots: (number | string)[] = [];
    let prev: number | null = null;

    for (const current of range) {
      if (prev !== null && current - prev > 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(current);
      prev = current;
    }

    return rangeWithDots;
  };

  return (
    <div
      className="
        mt-8
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-zinc-200
        bg-white
        px-6
        py-5
        shadow-sm
      "
    >
      <div className="text-sm text-zinc-500">
        Total de{" "}
        <span className="font-semibold text-zinc-900">
          {total}
        </span>{" "}
        produtos
      </div>

      <div className="flex items-center gap-2">
        {/* ANTERIOR */}
        <button
          disabled={page === 1}
          onClick={() => goTo(page - 1)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border-2 border-zinc-300
            bg-zinc-200 text-zinc-900
            transition hover:border-pink-400 hover:text-pink-500
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <ChevronLeft size={18} />
        </button>

        {/* PÁGINAS COM ELLIPSIS */}
        {getPageNumbers().map((item, index) =>
          item === "..." ? (
            <span key={`dots-${index}`} className="px-1 text-zinc-400">
              ...
            </span>
          ) : (
            <button
              key={Number(item)}
              onClick={() => goTo(Number(item))}
              className={`
                h-10 min-w-[40px] rounded-xl border-2 text-sm font-bold transition
                ${
                  Number(item) === page
                    ? "border-pink-500 bg-pink-500 text-white shadow-md"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-pink-400 hover:text-pink-500"
                }
              `}
            >
              {item}
            </button>
          )
        )}

        {/* PRÓXIMA */}
        <button
          disabled={page === pages}
          onClick={() => goTo(page + 1)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500
            text-white shadow-lg shadow-pink-500/25
            transition hover:scale-105
            disabled:cursor-not-allowed disabled:opacity-40
          "
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}