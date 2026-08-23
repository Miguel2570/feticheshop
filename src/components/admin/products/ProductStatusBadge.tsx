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
      "bg-zinc-700/20 border-zinc-600 text-zinc-300",
  },

  ACTIVE: {
    label: "Ativo",
    className:
      "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },

  HIDDEN: {
    label: "Oculto",
    className:
      "bg-yellow-500/15 border-yellow-500/20 text-yellow-400",
  },

  OUT_OF_STOCK: {
    label: "Sem Stock",
    className:
      "bg-red-500/15 border-red-500/20 text-red-400",
  },

  ARCHIVED: {
    label: "Arquivado",
    className:
      "bg-slate-500/15 border-slate-500/20 text-slate-300",
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