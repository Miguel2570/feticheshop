// components/admin/categories/AddCategoryButton.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AddCategoryModal } from "./AddCategoryModal";

interface AddCategoryButtonProps {
  /** Se definido, o botão cria subcategoria deste pai. Senão, cria raiz. */
  parentId?: string | null;
  parentName?: string | null;
  /** Estilo: "primary" (rosa cheio) ou "ghost" (outline). */
  variant?: "primary" | "ghost";
  label?: string;
}

export function AddCategoryButton({
  parentId = null,
  parentName = null,
  variant = "primary",
  label,
}: AddCategoryButtonProps) {
  const [open, setOpen] = useState(false);

  const isRoot = !parentId;

  const finalLabel =
    label ?? (isRoot ? "Nova categoria" : "Nova subcategoria");

  const classes =
    variant === "ghost"
      ? "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-xs font-semibold text-pink-600 border border-pink-200 transition hover:bg-pink-50 cursor-pointer"
      : "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-pink-500 px-3 text-xs font-semibold text-white transition hover:bg-pink-600 cursor-pointer";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={classes}>
        <Plus size={14} />
        {finalLabel}
      </button>

      <AddCategoryModal
        key={open ? "open" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        parentId={parentId}
        parentName={parentName}
        />
    </>
  );
}