"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";

import { toggleFeaturedCategory } from "@/actions/categories/toggleFeaturedCategory";

interface ToggleFeaturedCategoryButtonProps {
  categoryId: string;
  isFeatured: boolean;
}

export function ToggleFeaturedCategoryButton({
  categoryId,
  isFeatured,
}: ToggleFeaturedCategoryButtonProps) {
  const [featured, setFeatured] = useState(isFeatured);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    // Atualiza imediatamente a estrela
    setFeatured((current) => !current);

    startTransition(async () => {
      try {
        await toggleFeaturedCategory(categoryId);
      } catch (error) {
        console.error(
          "Erro ao alterar destaque da categoria:",
          error
        );

        // Se a action falhar, repõe o estado anterior
        setFeatured((current) => !current);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={
        featured
          ? "Remover dos destaques"
          : "Adicionar aos destaques"
      }
      className="
        inline-flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        border-zinc-700
        transition-all
        hover:border-yellow-500
        hover:bg-yellow-500/10
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <Star
        size={18}
        className={
          featured
            ? "fill-yellow-400 text-yellow-400"
            : "text-zinc-500"
        }
      />
    </button>
  );
}