"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  success?: boolean;
  error?: string;
};

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    if (!id) return { error: "ID inválido." };

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return { error: "Categoria não encontrada." };
    }

    // Impedir eliminação se tiver produtos ou subcategorias
    if (category._count.products > 0) {
      return {
        error: `Esta categoria tem ${category._count.products} produto(s) associado(s). Remove-os primeiro.`,
      };
    }

    if (category._count.children > 0) {
      return {
        error: `Esta categoria tem ${category._count.children} subcategoria(s). Elimina-as primeiro.`,
      };
    }

    // Soft delete (recomendado) — se preferires hard delete, usa prisma.category.delete
    await prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[deleteCategory] Erro:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao eliminar a categoria.",
    };
  }
}