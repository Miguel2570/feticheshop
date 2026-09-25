// components/admin/products/ProductToolbar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent: { id: string; name: string } | null;
};

type Brand = {
  id: string;
  name: string;
};

export function ProductToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingAll, setLoadingAll] = useState<"show" | "hide" | null>(null);
  const [message, setMessage] = useState("");
  const [showMore, setShowMore] = useState(false);

  // Preço — estado local para escrever sem re-render a cada tecla
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories-for-products");
        if (response.ok) setCategories(await response.json());
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBrands() {
      try {
        const response = await fetch("/api/admin/brands-for-products");
        if (!response.ok) return;

        const data = await response.json();
        setBrands(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao carregar marcas:", error);
      }
    }
    loadBrands();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  };

  const handlePriceChange = (key: "minPrice" | "maxPrice", value: string) => {
    if (key === "minPrice") setMinPrice(value);
    else setMaxPrice(value);

    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const min = key === "minPrice" ? value : minPrice;
      const max = key === "maxPrice" ? value : maxPrice;

      if (min) params.set("minPrice", min);
      else params.delete("minPrice");
      if (max) params.set("maxPrice", max);
      else params.delete("maxPrice");

      params.delete("page");
      router.push(`/admin/products?${params.toString()}`, { scroll: false });
    }, 500);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/admin/products");
  };

  const handleShowAll = async () => {
    if (loadingAll) return;
    setLoadingAll("show");
    setMessage("");
    try {
      const response = await fetch("/api/admin/products/toggle-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (response.ok) {
        setMessage(data.message || "Produtos mostrados");
        router.refresh();
      } else setMessage(data.message || "Erro ao mostrar produtos");
    } catch {
      setMessage("Erro de conexão");
    } finally {
      setLoadingAll(null);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleHideAll = async () => {
    if (loadingAll) return;
    if (
      !window.confirm(
        "⚠️ Tens a certeza que queres ocultar TODOS os produtos?\n\nNenhum produto vai aparecer na loja!"
      )
    )
      return;

    setLoadingAll("hide");
    setMessage("");
    try {
      const response = await fetch("/api/admin/products/toggle-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (response.ok) {
        setMessage(data.message || "Produtos ocultados");
        router.refresh();
      } else setMessage(data.message || "Erro ao ocultar produtos");
    } catch {
      setMessage("Erro de conexão");
    } finally {
      setLoadingAll(null);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    const parentName = cat.parent?.name ?? "Sem categoria";
    if (!acc[parentName]) acc[parentName] = [];
    acc[parentName].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  const hasActiveFilters =
    searchParams.get("search") ||
    searchParams.get("category") ||
    searchParams.get("brand") ||
    searchParams.get("status") ||
    searchParams.get("stock") ||
    searchParams.get("featured") ||
    searchParams.get("sort") ||
    searchParams.get("type") ||
    searchParams.get("orphan") ||
    searchParams.get("categorySource") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  const stockValue = searchParams.get("stock") ?? "in_stock";
  const onlyInStock = stockValue === "in_stock";

  const moreFiltersActive =
    searchParams.get("status") ||
    searchParams.get("featured") ||
    searchParams.get("sort") ||
    searchParams.get("categorySource") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice");

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* ===== FILTROS PRINCIPAIS ===== */}
      <div className="w-full min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
          {/* Pesquisa */}
          <div className="relative w-full lg:flex-1 lg:min-w-[220px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateParam("search", search)
              }
              placeholder="Procurar produto pelo nome..."
              className="h-12 w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Categoria */}
          <select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateParam("category", e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 lg:w-auto lg:min-w-[180px]"
          >
            <option value="">Todas as categorias</option>
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

          {/* Marca */}
          <select
            value={searchParams.get("brand") ?? ""}
            onChange={(e) => updateParam("brand", e.target.value)}
            className="h-12 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 lg:w-auto lg:min-w-[160px]"
          >
            <option value="">Todas as marcas</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          {/* Toggle stock simplificado */}
          <button
            type="button"
            onClick={() =>
              updateParam("stock", onlyInStock ? "all" : "in_stock")
            }
            className={`inline-flex h-12 items-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition ${
              onlyInStock
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                onlyInStock ? "border-pink-500 bg-pink-500" : "border-zinc-300"
              }`}
            >
              {onlyInStock && (
                <svg viewBox="0 0 12 12" className="h-3 w-3 text-white">
                  <path
                    d="M2 6l3 3 5-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            Esconder sem stock
          </button>

          {/* Botão mais filtros */}
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className={`inline-flex h-12 items-center gap-2 rounded-xl border-2 px-4 text-sm font-medium transition ${
              moreFiltersActive
                ? "border-pink-500 bg-pink-50 text-pink-700"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            <SlidersHorizontal size={16} />
            Mais filtros
            <ChevronDown
              size={16}
              className={`transition-transform ${showMore ? "rotate-180" : ""}`}
            />
            {moreFiltersActive && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                !
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>

        {/* ===== FILTROS AVANÇADOS ===== */}
        {showMore && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Estado */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Estado do produto
              </label>
              <select
                value={searchParams.get("status") ?? ""}
                onChange={(e) => updateParam("status", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Todos os estados</option>
                <option value="ACTIVE">✅ Visíveis na loja</option>
                <option value="DRAFT">📝 Rascunhos</option>
                <option value="HIDDEN">🙈 Escondidos</option>
                <option value="OUT_OF_STOCK">📦 Sem stock</option>
                <option value="ARCHIVED">🗄️ Arquivados</option>
              </select>
            </div>

            {/* Destaque */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Destaques
              </label>
              <select
                value={searchParams.get("featured") ?? ""}
                onChange={(e) => updateParam("featured", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              >
                <option value="">Todos</option>
                <option value="true">⭐ Só destacados</option>
                <option value="false">Só não destacados</option>
              </select>
            </div>

            {/* Origem da categoria */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Categorias atribuídas
              </label>
              <select
                value={searchParams.get("categorySource") ?? ""}
                onChange={(e) => updateParam("categorySource", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                title="Filtrar por quem atribuiu a categoria"
              >
                <option value="">Todas</option>
                <option value="MANUAL">✋ Escolhidas por mim</option>
                <option value="AUTO">🤖 Atribuídas pelo sistema</option>
              </select>
            </div>

            {/* Preço mín / máx */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Preço (€)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={minPrice}
                  onChange={(e) =>
                    handlePriceChange("minPrice", e.target.value)
                  }
                  placeholder="Mínimo"
                  className="h-11 w-full min-w-0 rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
                <span className="text-sm text-zinc-400">até</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={maxPrice}
                  onChange={(e) =>
                    handlePriceChange("maxPrice", e.target.value)
                  }
                  placeholder="Máximo"
                  className="h-11 w-full min-w-0 rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Ordenação */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Ordenar por
              </label>
              <select
                value={searchParams.get("sort") ?? "newest"}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:max-w-xs"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="priceAsc">Preço (menor primeiro)</option>
                <option value="priceDesc">Preço (maior primeiro)</option>
                <option value="stockAsc">Stock (menor primeiro)</option>
                <option value="stockDesc">Stock (maior primeiro)</option>
                <option value="name">Nome (A-Z)</option>
              </select>
            </div>

            {/* Opções para manutenção */}
            <div className="sm:col-span-2 lg:col-span-3">
              <details className="rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                <summary className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-700">
                  ⚙️ Opções para manutenção
                </summary>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                      Tipo de produto
                    </label>
                    <select
                      value={searchParams.get("type") ?? "all"}
                      onChange={(e) => updateParam("type", e.target.value)}
                      className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 outline-none focus:border-pink-500"
                    >
                      <option value="all">Todos os produtos</option>
                      <option value="grouped">
                        🎨 Com várias opções (tamanhos/cores)
                      </option>
                      <option value="single">🔸 Com uma só opção</option>
                      <option value="solo">⚪ Produto simples (sem opções)</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                      Produto principal ou duplicado
                    </label>
                    <select
                      value={searchParams.get("orphan") ?? ""}
                      onChange={(e) => updateParam("orphan", e.target.value)}
                      className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 outline-none focus:border-pink-500"
                    >
                      <option value="">Todos</option>
                      <option value="false">👑 Só principais</option>
                      <option value="true">
                        👻 Só duplicados (não aparecem na loja)
                      </option>
                    </select>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>

      {/* ===== AÇÕES EM MASSA ===== */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
          <span className="text-lg">⚠️</span>
          <span>Ações rápidas (aplicam-se a TODOS os produtos):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleShowAll}
            disabled={loadingAll !== null}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Eye size={15} />
            {loadingAll === "show" ? "A mostrar..." : "Mostrar todos na loja"}
          </button>

          <button
            type="button"
            onClick={handleHideAll}
            disabled={loadingAll !== null}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            <EyeOff size={15} />
            {loadingAll === "hide" ? "A ocultar..." : "Ocultar todos da loja"}
          </button>
        </div>

        {message && (
          <span className="text-sm font-medium text-amber-900">{message}</span>
        )}
      </div>
    </div>
  );
}