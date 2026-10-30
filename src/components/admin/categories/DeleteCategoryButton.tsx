"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteCategory } from "@/actions/categories/deleteCategory";

type Props = {
  categoryId: string;
  categoryName: string;
  productCount?: number;
  childrenCount?: number;
};

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount = 0,
  childrenCount = 0,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategory(categoryId);

      if (result.error) {
        toast.error(result.error);
        setConfirming(false);
        return;
      }

      toast.success(`Categoria "${categoryName}" eliminada.`);
      setConfirming(false);
    });
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        aria-label="Eliminar categoria"
      >
        <Trash2 size={14} />
        Eliminar
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5">
      <span className="text-xs font-medium text-red-700">
        {productCount > 0 || childrenCount > 0
          ? "Tem dependências!"
          : "Eliminar?"}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex h-6 items-center rounded-md bg-red-600 px-2 text-[11px] font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "..." : "Sim"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="inline-flex h-6 items-center rounded-md bg-white px-2 text-[11px] font-bold text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-50 cursor-pointer"
      >
        Não
      </button>
    </div>
  );
}