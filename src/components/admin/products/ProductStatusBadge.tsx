"use client";

import { ProductStatus } from "@prisma/client";

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const statusConfig: Record<
  ProductStatus,
  {
    label: string;
    className: string;
  }
> = {
  DRAFT: {
    label: "Rascunho",
    className:
      "bg-zinc-50 border-zinc-200 text-zinc-600",
  },

  ACTIVE: {
    label: "Ativo",
    className:
      "bg-emerald-50 border-emerald-200 text-emerald-600",
  },

  HIDDEN: {
    label: "Oculto",
    className:
      "bg-yellow-50 border-yellow-200 text-yellow-600",
  },

  OUT_OF_STOCK: {
    label: "Sem Stock",
    className:
      "bg-red-50 border-red-200 text-red-500",
  },

  ARCHIVED: {
    label: "Arquivado",
    className:
      "bg-slate-50 border-slate-200 text-slate-500",
  },
};

export function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}