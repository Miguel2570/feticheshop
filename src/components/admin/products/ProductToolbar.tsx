// src/components/admin/products/ProductToolbar.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  parent: { id: string; name: string } | null;
};

export function ProductToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingAll, setLoadingAll] = useState<"show" | "hide" | null>(null);
  const [message, setMessage] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories-for-products");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }

    loadCategories();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      updateParam("search", value);
    }, 400);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/admin/products");
  };

  // ✅ Mostrar todos os produtos
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
      } else {
        setMessage(data.message || "Erro ao mostrar produtos");
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage("Erro de conexão");
    } finally {
      setLoadingAll(null);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  // ✅ Ocultar todos os produtos (COM CONFIRMAÇÃO)
  const handleHideAll = async () => {
    if (loadingAll) return;

    // ✅ Confirmação antes de ocultar
    if (!window.confirm("⚠️ Tens a certeza que queres ocultar TODOS os produtos do frontend?\n\nIsto vai fazer com que nenhum produto apareça na loja!")) {
      return;
    }

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
      } else {
        setMessage(data.message || "Erro ao ocultar produtos");
      }
    } catch (error) {
      console.error("Erro:", error);
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

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="w-full min-w-0 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4 lg:p-5">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          {/* PESQUISA */}
          <div className="relative w-full min-w-0 lg:min-w-[220px] lg:flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 sm:left-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("search", search);
                }
              }}
              placeholder="Pesquisar por nome, SKU ou EAN..."
              className="h-11 w-full min-w-0 rounded-xl border-2 border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:pl-11 sm:pr-4"
            />
          </div>

          {/* CATEGORIA */}
          <select
            value={searchParams.get("category") ?? ""}
            onChange={(e) => updateParam("category", e.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:px-4 lg:w-auto lg:min-w-[200px]"
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

          {/* STOCK */}
          <select
            value={searchParams.get("stock") ?? "in_stock"}
            onChange={(e) => updateParam("stock", e.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:px-4 lg:w-auto lg:min-w-[150px]"
          >
            <option value="in_stock">Em Stock</option>
            <option value="out_of_stock">Sem Stock</option>
            <option value="all">Todos</option>
          </select>

          {/* ESTADO */}
          <select
            value={searchParams.get("status") ?? ""}
            onChange={(e) => updateParam("status", e.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:px-4 lg:w-auto lg:min-w-[150px]"
          >
            <option value="">Todos Estados</option>
            <option value="ACTIVE">Ativos</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="OUT_OF_STOCK">Sem Stock</option>
            <option value="HIDDEN">Ocultos</option>
            <option value="ARCHIVED">Arquivados</option>
          </select>

          {/* ORDENAÇÃO */}
          <select
            value={searchParams.get("sort") ?? "newest"}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="h-11 w-full min-w-0 cursor-pointer rounded-xl border-2 border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:px-4 lg:w-auto lg:min-w-[160px]"
          >
            <option value="newest">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="priceAsc">Preço ↑</option>
            <option value="priceDesc">Preço ↓</option>
            <option value="stockAsc">Stock ↑</option>
            <option value="stockDesc">Stock ↓</option>
            <option value="name">Nome</option>
          </select>

          {(searchParams.get("search") || searchParams.get("category") || searchParams.get("status") || searchParams.get("stock") || searchParams.get("sort")) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 text-sm font-semibold text-white transition hover:bg-pink-600 cursor-pointer sm:col-span-2 lg:w-auto lg:px-5"
            >
              <X size={16} />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* BOTÕES MOSTRAR/OCULTAR TODOS */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleShowAll}
          disabled={loadingAll !== null}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 cursor-pointer"
        >
          <Eye size={16} />
          {loadingAll === "show" ? "A mostrar..." : "Mostrar todos no site"}
        </button>

        <button
          type="button"
          onClick={handleHideAll}
          disabled={loadingAll !== null}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-zinc-700 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
        >
          <EyeOff size={16} />
          {loadingAll === "hide" ? "A ocultar..." : "Ocultar todos do site"}
        </button>

        {message && (
          <span className="text-sm font-medium text-pink-500">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}