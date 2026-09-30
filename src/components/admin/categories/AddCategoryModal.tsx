// components/admin/categories/AddCategoryModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  parentId?: string | null;
  parentName?: string | null;
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AddCategoryModal({
  open,
  onClose,
  parentId = null,
  parentName = null,
}: AddCategoryModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  // Fechar com ESC
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, saving]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("O nome é obrigatório.");
      return;
    }

    if (!slug.trim()) {
      setError("O slug é obrigatório.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          isActive,
          sortOrder,
          parentId: parentId ?? null,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Erro ao criar categoria.");
        setSaving(false);
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("Erro de conexão.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-zinc-900">
              {parentId ? "Nova Subcategoria" : "Nova Categoria"}
            </h2>
            {parentName && (
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                Dentro de: <span className="font-semibold">{parentName}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* NOME */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: Bolas Anais"
              autoFocus
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* SLUG (bloqueado) */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Slug (gerado automaticamente)
            </label>
            <div
                style={{
                backgroundColor: "#f4f4f5",
                color: "#71717a",
                cursor: "not-allowed",
                }}
                className="flex h-10 w-full items-center rounded-xl border-2 border-zinc-200 px-4 text-sm"
            >
                {slug || "..."}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
                URL: /{slug || "..."}
            </p>
            </div>

          {/* ORDEM */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
              Ordem
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Números mais baixos aparecem primeiro.
            </p>
          </div>

          {/* ATIVO */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 accent-pink-500"
            />
            <span className="text-sm text-zinc-700">Visível na loja</span>
          </label>
        </form>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-10 rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-pink-500 px-5 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                A criar...
              </>
            ) : (
              "Criar Categoria"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}