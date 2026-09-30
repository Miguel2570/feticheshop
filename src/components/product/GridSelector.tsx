// components/product/GridSelector.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [2, 4] as const;
type Cols = (typeof OPTIONS)[number];

interface GridSelectorProps {
  defaultCols?: number;
}

export function GridSelector({ defaultCols = 4 }: GridSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCols =
    Number(searchParams.get("cols")) || defaultCols;

  function setCols(cols: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cols", String(cols));
    params.delete("page"); // reset para página 1
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-zinc-500 sm:inline">
        Ver:
      </span>

      <div className="flex items-center gap-1 rounded-full border border-pink-100 bg-white p-1 shadow-sm">
        {OPTIONS.map((cols) => {
          const isActive = currentCols === cols;

          return (
            <button
              key={cols}
              type="button"
              onClick={() => setCols(cols)}
              aria-label={`Ver ${cols} produtos por linha`}
              title={`${cols} por linha`}
              className={`
                flex h-8 w-8 items-center justify-center
                rounded-full
                text-xs font-bold
                transition-all duration-200
                cursor-pointer
                ${
                  isActive
                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                    : "text-zinc-600 hover:bg-pink-50 hover:text-pink-500"
                }
              `}
            >
              {cols}
            </button>
          );
        })}
      </div>
    </div>
  );
}