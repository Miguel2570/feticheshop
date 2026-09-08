"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent: {
    id: string;
    name: string;
  } | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  ean: string | null;
  shortDescription: string | null;
  description: string | null;
  price: number;
  comparePrice: number | null;
  costPrice: number | null; // ← ADICIONAR
  stock: number;
  physicalStock: number;
  supplierStock: number;
  stockMode: "PHYSICAL" | "SUPPLIER" | "BOTH";
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  categoryId?: string;
};

interface ProductEditFormProps {
  product: Product;
  categories?: Category[];
}

export function ProductEditForm({ product, categories = [] }: ProductEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    product.categoryId ?? ""
  );
  
  // ✅ Estado para preço de venda (para calcular margem em tempo real)
  const [salePrice, setSalePrice] = useState(product.price);
  const costPrice = product.costPrice ?? 0;

  // Calcular margem e lucro
  const profit = salePrice - costPrice;
  const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

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
      categoryId: formData.get("categoryId") || null,
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

  const groupedCategories = categories.reduce((acc, cat) => {
    const parentName = cat.parent?.name ?? "Sem categoria";
    if (!acc[parentName]) acc[parentName] = [];
    acc[parentName].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

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

        {/* CATEGORIA */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">Categoria</label>
          <select
            name="categoryId"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          >
            <option value="">Selecionar categoria</option>
            {Object.entries(groupedCategories).map(([parentName, cats]) => (
              <optgroup key={parentName} label={parentName}>
                {cats.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
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

        {/* ✅ PREÇO DO FORNECEDOR (CUSTO) */}
        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Preço do Fornecedor (Custo)
              </p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                €{costPrice.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">
                Este é o preço que pagas ao fornecedor
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* ✅ PREÇO DE VENDA */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Preço de Venda (€)
            </label>
            <input
              type="number"
              name="price"
              defaultValue={product.price.toFixed(2)}
              step="0.01"
              min="0"
              required
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Preço Antigo (€)
            </label>
            <input
              type="number"
              name="comparePrice"
              defaultValue={product.comparePrice ? product.comparePrice.toFixed(2) : ""}
              step="0.01"
              min="0"
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
        </div>

        {/* ✅ MARGEM DE LUCRO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-600">
              💰 Lucro por venda
            </p>
            <p className="mt-1 text-xl font-bold text-emerald-700">
              €{profit.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
            <p className="text-xs font-semibold text-pink-600">
              📊 Margem de lucro
            </p>
            <p className={`mt-1 text-xl font-bold ${margin >= 30 ? "text-emerald-600" : margin >= 15 ? "text-yellow-600" : "text-red-500"}`}>
              {margin.toFixed(0)}%
            </p>
          </div>
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
          className="h-11 px-6 text-sm font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? "A guardar..." : "Guardar Alterações"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/admin/products/${product.id}`)}
          className="h-11 px-6 text-sm font-bold rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}