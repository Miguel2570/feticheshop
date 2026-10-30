"use client";

import { useState, useActionState } from "react";
import { Pencil, X, Lock } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { updateCategory } from "@/actions/categories/updateCategory";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  category: Category;
};

type ActionState = {
  success?: boolean;
  error?: string;
} | null;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center justify-center rounded-xl bg-pink-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-pink-600 disabled:opacity-50 cursor-pointer"
    >
      {pending ? "A guardar..." : "Guardar alterações"}
    </button>
  );
}

export function EditCategoryButton({ category }: Props) {
  const [open, setOpen] = useState(false);

  async function handleUpdate(
    prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    const result = await updateCategory(prevState, formData);

    if (result?.success) {
      toast.success("Categoria atualizada com sucesso!");
      setOpen(false);
    } else if (result?.error) {
      toast.error(result.error);
    }

    return result;
  }

  const [, formAction] = useActionState<ActionState, FormData>(
    handleUpdate,
    null
  );

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  const inputStyle: React.CSSProperties = {
    color: "#18181b !important",
    WebkitTextFillColor: "#18181b !important",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 cursor-pointer"
        aria-label="Editar categoria"
      >
        <Pencil size={14} />
        Editar
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
                Editar categoria
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="id" value={category.id} />
              <input type="hidden" name="slug" value={category.slug} />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={category.name}
                  required
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* SLUG — bloco estático que "parece" um input mas não é editável */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                  Slug
                  <Lock size={12} className="text-zinc-400" />
                </label>
                <div
                  className="
                    flex h-[42px] w-full items-center rounded-xl
                    border border-zinc-200 bg-zinc-50 px-4
                    text-sm
                  "
                  style={{
                    color: "#71717a",
                    WebkitTextFillColor: "#71717a",
                  }}
                  aria-readonly="true"
                >
                  {category.slug}
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  O slug não pode ser alterado após a criação.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}