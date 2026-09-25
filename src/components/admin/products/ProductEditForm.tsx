"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
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
  costPrice: number | null;
  stock: number;
  physicalStock: number;
  supplierStock: number;
  stockMode: "PHYSICAL" | "SUPPLIER" | "BOTH";
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  categoryIds: string[];
  categorySource: "AUTO" | "MANUAL";
  categoryReason: string | null;
};

interface ProductEditFormProps {
  product: Product;
  categories?: Category[];
}

export function ProductEditForm({
  product,
  categories = [],
}: ProductEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Hierarquia: raízes + filhas por parent
  const roots = categories.filter((c) => c.parentId === null);
  const childrenByParent = new Map<string, Category[]>();
  for (const c of categories) {
    if (!c.parentId) continue;
    const arr = childrenByParent.get(c.parentId) ?? [];
    arr.push(c);
    childrenByParent.set(c.parentId, arr);
  }

  // Categoria atual — separar em raiz e sub
  const [rootId, setRootId] = useState(() => {
    const current = product.categoryIds ?? [];
    return roots.find((r) => current.includes(r.id))?.id ?? "";
  });
  const [subId, setSubId] = useState(() => {
    const current = product.categoryIds ?? [];
    return (
      categories.find((c) => c.parentId && current.includes(c.id))?.id ?? ""
    );
  });

  // Estado para cálculo de margem
  const [salePrice, setSalePrice] = useState(product.price);
  const costPrice = product.costPrice ?? 0;
  const profit = salePrice - costPrice;
  const margin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);

    const categoryIds = [rootId, subId].filter(Boolean);

    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      sku: formData.get("sku") || null,
      ean: formData.get("ean") || null,
      shortDescription: formData.get("shortDescription") || null,
      description: formData.get("description") || null,
      price: Number(formData.get("price")),
      comparePrice: formData.get("comparePrice")
        ? Number(formData.get("comparePrice"))
        : null,
      physicalStock: Number(formData.get("physicalStock")) || 0,
      stockMode: formData.get("stockMode"),
      status: formData.get("status"),
      isFeatured: formData.get("isFeatured") === "true",
      isNew: formData.get("isNew") === "true",
      isOnSale: formData.get("isOnSale") === "true",
      categoryIds,
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

  const handleUnlock = async () => {
    if (
      !confirm(
        "Reativar classificação automática para este produto? A categoria atual será substituída na próxima corrida do script."
      )
    ) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}/unlock-category`,
        { method: "POST" }
      );

      if (!response.ok) {
        setError("Erro ao destravar categoria");
        return;
      }

      setMessage("Classificação automática reativada.");
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  const selectedRoot = roots.find((r) => r.id === rootId);
  const subOptions = selectedRoot
    ? childrenByParent.get(selectedRoot.id) ?? []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700">
          {message}
        </div>
      )}

      {/* INFORMAÇÕES BÁSICAS */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
          Informações Básicas
        </h2>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            defaultValue={product.name}
            required
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            defaultValue={product.slug}
            required
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        {/* CATEGORIA — badge de origem */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">
              Origem da categoria:
            </span>
            {product.categorySource === "MANUAL" ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                Manual
              </span>
            ) : (
              <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded font-medium">
                Auto
              </span>
            )}
          </div>
          {product.categoryReason && (
            <p className="mt-1 text-xs text-zinc-600">
              {product.categorySource === "AUTO"
                ? `Sugerida por: ${product.categoryReason}`
                : `Nota: ${product.categoryReason}`}
            </p>
          )}
        </div>

        {/* CATEGORIA — raiz */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Categoria (raiz)
          </label>
          <select
            value={rootId}
            onChange={(e) => {
              setRootId(e.target.value);
              setSubId("");
            }}
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          >
            <option value="">Selecionar categoria</option>
            {roots.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORIA — sub */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Subcategoria
          </label>
          <select
            value={subId}
            onChange={(e) => setSubId(e.target.value)}
            disabled={!rootId}
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none disabled:bg-zinc-50 disabled:text-zinc-400"
          >
            <option value="">Selecionar subcategoria</option>
            {subOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              defaultValue={product.sku ?? ""}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              EAN
            </label>
            <input
              type="text"
              name="ean"
              defaultValue={product.ean ?? ""}
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Descrição Curta
          </label>
          <textarea
            name="shortDescription"
            defaultValue={product.shortDescription ?? ""}
            rows={2}
            className="w-full rounded-xl border-2 border-zinc-200 px-4 py-2 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Descrição Completa
          </label>
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
              defaultValue={
                product.comparePrice ? product.comparePrice.toFixed(2) : ""
              }
              step="0.01"
              min="0"
              className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
            />
          </div>
        </div>

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
            <p
              className={`mt-1 text-xl font-bold ${
                margin >= 30
                  ? "text-emerald-600"
                  : margin >= 15
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              {margin.toFixed(0)}%
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Stock Físico
          </label>
          <input
            type="number"
            name="physicalStock"
            defaultValue={product.physicalStock}
            min="0"
            className="h-10 w-full rounded-xl border-2 border-zinc-200 px-4 text-sm text-zinc-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Modo de Stock
          </label>
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
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Status
            </label>
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
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={product.isFeatured}
                className="h-4 w-4 accent-pink-500"
              />
              <span className="text-sm text-zinc-700">Em Destaque</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isNew"
                value="true"
                defaultChecked={product.isNew}
                className="h-4 w-4 accent-pink-500"
              />
              <span className="text-sm text-zinc-700">Novidade</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isOnSale"
                value="true"
                defaultChecked={product.isOnSale}
                className="h-4 w-4 accent-pink-500"
              />
              <span className="text-sm text-zinc-700">Em Promoção</span>
            </label>
          </div>
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 px-6 text-sm font-bold rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? "A guardar..." : "Guardar Alterações"}
        </button>

        {product.categorySource === "MANUAL" && (
          <button
            type="button"
            onClick={handleUnlock}
            disabled={saving}
            className="h-11 px-6 text-sm font-bold rounded-xl bg-white text-zinc-700 border-2 border-zinc-200 hover:bg-zinc-50 transition-all disabled:opacity-50 cursor-pointer"
          >
            Reativar classificação automática
          </button>
        )}

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