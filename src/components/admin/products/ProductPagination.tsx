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
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    params.set("page", page.toString());

    router.push(
      `/admin/products?${params.toString()}`,
    );
  }

  if (pagination.pages <= 1) {
    return null;
  }

  return (
    <div
      className="
        mt-8
        flex
        items-center
        justify-between
        rounded-3xl
        border
        border-zinc-800
        bg-[#111]
        px-6
        py-5
      "
    >
      <div className="text-sm text-zinc-400">
        Total de{" "}
        <span className="font-semibold text-white">
          {pagination.total}
        </span>{" "}
        produtos
      </div>

      <div className="flex items-center gap-2">

        <button
          disabled={pagination.page === 1}
          onClick={() =>
            goTo(pagination.page - 1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-700
            text-zinc-400
            transition
            hover:border-pink-500
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({
          length: pagination.pages,
        }).map((_, index) => {
          const page = index + 1;

          const active =
            page === pagination.page;

          return (
            <button
              key={page}
              onClick={() => goTo(page)}
              className={`
                h-10
                min-w-[40px]
                rounded-xl
                border
                text-sm
                font-semibold
                transition

                ${
                  active
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-zinc-700 text-zinc-400 hover:border-pink-500 hover:text-white"
                }
              `}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={
            pagination.page ===
            pagination.pages
          }
          onClick={() =>
            goTo(pagination.page + 1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-zinc-700
            text-zinc-400
            transition
            hover:border-pink-500
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </div>
  );
}