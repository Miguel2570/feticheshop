"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ActionState = {
  success?: boolean;
  error?: string;
} | null;

export async function updateCategory(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();

    if (!id) return { error: "ID inválido." };
    if (!name) return { error: "O nome é obrigatório." };

    // Não lemos o slug do form — o slug fica imutável
    await prisma.category.update({
      where: { id },
      data: { name },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[updateCategory] Erro:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar a categoria.",
    };
  }
}