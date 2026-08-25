"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  ean: string | null;
  shortDescription: string | null;
  description: string | null;
  price: { toString(): string };
  comparePrice: { toString(): string } | null;
  stock: number;
  physicalStock: number;
  supplierStock: number;
  stockMode: "PHYSICAL" | "SUPPLIER" | "BOTH";
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
};

interface ProductEditFormProps {
  product: Product;
}

export function ProductEditForm({ product }: ProductEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      sku: formData.get("sku") || null,
      ean: formData.get("ean") || null,
      shortDescription: formData.get("shortDescription") || null,
      description: formData.get("description") || null,
      price: Number(formData.get("price")),
      comparePrice: formData.get("comparePrice") ? Number(formData.get("comparePrice")) : null,
      physicalStock: Number(formData.get("physicalStock")) || 0,
      stockMode: formData.get("stockMode"),
      status: formData.get("status"),
      isFeatured: formData.get("isFeatured") === "true",
      isNew: formData.get("isNew") === "true",
      isOnSale: formData.get("isOnSale") === "true",
    };

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || "Erro ao guardar");
        return;
      }

      router.push(`/admin/products/${product.id}`);
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* INFORMAÇÕES BÁSICAS */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
          Informações Básicas
        </h2>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Nome</label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            defaultValue={product.slug}
            required
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">SKU</label>
            <input
              type="text"
              name="sku"
              defaultValue={product.sku ?? ""}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">EAN</label>
            <input
              type="text"
              name="ean"
              defaultValue={product.ean ?? ""}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Descrição Curta</label>
          <textarea
            name="shortDescription"
            defaultValue={product.shortDescription ?? ""}
            rows={2}
            className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Descrição Completa</label>
          <textarea
            name="description"
            defaultValue={product.description ?? ""}
            rows={5}
            className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>
      </div>

      {/* PREÇO E STOCK */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
          Preço e Stock
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Preço (€)</label>
            <input
              type="number"
              name="price"
              defaultValue={Number(product.price).toFixed(2)}
              step="0.01"
              min="0"
              required
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Preço Antigo (€)</label>
            <input
              type="number"
              name="comparePrice"
              defaultValue={product.comparePrice ? Number(product.comparePrice).toFixed(2) : ""}
              step="0.01"
              min="0"
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Stock Físico</label>
            <input
              type="number"
              name="physicalStock"
              defaultValue={product.physicalStock}
              min="0"
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Modo de Stock</label>
          <select
            name="stockMode"
            defaultValue={product.stockMode}
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          >
            <option value="PHYSICAL">🏪 Loja (stock físico)</option>
            <option value="SUPPLIER">🚚 Fornecedor (dropshipping)</option>
            <option value="BOTH">🔄 Ambos</option>
          </select>
        </div>
      </div>

      {/* ESTADO */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
          Estado
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Status</label>
            <select
              name="status"
              defaultValue={product.status}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            >
              <option value="ACTIVE">Ativo</option>
              <option value="DRAFT">Rascunho</option>
              <option value="HIDDEN">Oculto</option>
              <option value="OUT_OF_STOCK">Sem Stock</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isFeatured" value="true" defaultChecked={product.isFeatured} className="h-4 w-4 accent-pink-500" />
              <span className="text-sm text-zinc-700">Em Destaque</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isNew" value="true" defaultChecked={product.isNew} className="h-4 w-4 accent-pink-500" />
              <span className="text-sm text-zinc-700">Novidade</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isOnSale" value="true" defaultChecked={product.isOnSale} className="h-4 w-4 accent-pink-500" />
              <span className="text-sm text-zinc-700">Em Promoção</span>
            </label>
          </div>
        </div>
      </div>

      {/* BOTÕES */}
        <div className="flex gap-3">
        <button
            type="submit"
            disabled={saving}
            className="
            h-11 px-6 text-sm font-bold rounded-xl
            bg-pink-500 text-white hover:bg-pink-600
            transition-all disabled:opacity-50 cursor-pointer
            "
        >
            {saving ? "A guardar..." : "Guardar Alterações"}
        </button>

        <button
            type="button"
            onClick={() => router.push(`/admin/products/${product.id}`)}
            className="
            h-11 px-6 text-sm font-bold rounded-xl
            bg-zinc-100 text-zinc-700 hover:bg-zinc-200
            transition-all cursor-pointer
            "
        >
            Cancelar
        </button>
        </div>
    </form>
  );
}