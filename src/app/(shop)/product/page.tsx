import { Prisma } from "@prisma/client";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { ProductSort } from "@/components/product/ProductSort";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Search } from "lucide-react";

const PAGE_SIZE = 24;

// ✅ LISTA COMPLETA DE CATEGORIAS REAIS
const FRONTEND_CATEGORY_SLUGS = [
  "sex-toys",
  "para-ele",
  "essenciais",
  "roupa",
  "bdsm",
  "vibradores",
  "dildos",
  "sugadores",
  "bolas-anales",
  "estimuladores",
  "masturbadores",
  "aneis-penianos",
  "estimulantes",
  "lubrificantes",
  "afrodisiacos",
  "jogos-eroticos",
  "lingerie-sexy",
  "bodystocking",
  "bikinis",
  "bondage",
  "acessorios-bdsm",
  "baterias-acessorios",
];

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sale?: string;
    new?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const subcategory = params.subcategory ?? "";
  const brand = params.brand ?? "";
  const minPrice = params.minPrice ?? "";
  const maxPrice = params.maxPrice ?? "";
  const sale = params.sale ?? "";
  const isNew = params.new ?? "";
  const sort = params.sort ?? "newest";
  const page = Math.max(1, Number(params.page ?? "1"));

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    stock: { gt: 0 },

    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),

    // ✅ FILTRO DE CATEGORIA PRINCIPAL (correto)
    ...(category
      ? {
          categories: {
            some: {
              category: {
                slug: category,
                isActive: true,
              },
            },
          },
        }
      : {}),

    // ✅ FILTRO DE SUBCATEGORIA (corrigido - filtra pela categoria real)
    ...(subcategory
      ? {
          categories: {
            some: {
              category: {
                slug: subcategory,
                isActive: true,
              },
            },
          },
        }
      : {}),

    ...(brand
      ? {
          brand: {
            slug: brand,
            isActive: true,
          },
        }
      : {}),

    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice ? { gte: Number(minPrice) } : {}),
            ...(maxPrice ? { lte: Number(maxPrice) } : {}),
          },
        }
      : {}),

    ...(sale === "true" ? { isOnSale: true } : {}),
    ...(isNew === "true" ? { isNew: true } : {}),
  };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const products = await prisma.product.findMany({
    where,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy:
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : sort === "best_sellers"
        ? { soldCount: "desc" }
        : { createdAt: "desc" },
    include: {
      brand: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
        slug: { in: FRONTEND_CATEGORY_SLUGS },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const activeCategory = category
    ? categories.find((cat) => cat.slug === category)
    : null;

  const activeSubcategory = subcategory
    ? categories.find((cat) => cat.slug === subcategory)
    : null;

  const createQuery = (extra: Record<string, string> = {}) => {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (subcategory) query.set("subcategory", subcategory);
    if (brand) query.set("brand", brand);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);
    if (sale) query.set("sale", sale);
    if (isNew) query.set("new", isNew);
    if (sort) query.set("sort", sort);

    Object.entries(extra).forEach(([key, value]) => {
      query.set(key, value);
    });

    return query.toString();
  };

  const hasFilters = !!(search || category || subcategory || brand || minPrice || maxPrice || sale === "true" || isNew === "true");

  // ✅ TÍTULO DA PÁGINA (corrigido)
  const pageTitle = search
    ? `Resultados para "${search}"`
    : activeSubcategory
    ? activeSubcategory.name
    : activeCategory
    ? activeCategory.name
    : "Todos os Produtos";

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(activeCategory
      ? [{ label: activeCategory.name, href: `/product?category=${activeCategory.slug}` }]
      : []),
    ...(activeSubcategory
      ? [{ label: activeSubcategory.name }]
      : []),
    ...(!activeSubcategory && search
      ? [{ label: `Pesquisa: ${search}` }]
      : []),
  ];

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <div className="container-custom py-12">
        {/* HEADER */}
        <div className="mb-10">
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="section-title">
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                  }}
                >
                  {pageTitle}
                </span>
              </h1>
              <p className="mt-3 text-zinc-600">
                {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
              </p>
            </div>

            <ProductSort defaultSort={sort} />
          </div>
        </div>

        {/* FILTROS */}
        <div className="mb-10 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-900">Filtrar produtos</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Encontra rapidamente o produto que procuras.
              </p>
            </div>

            {hasFilters && (
              <Link
                href="/product"
                className="text-sm font-medium text-pink-500 transition hover:text-pink-400"
              >
                Limpar filtros
              </Link>
            )}
          </div>

          <form method="GET" className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div className="relative md:col-span-2 xl:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Pesquisar
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Pesquisar produto..."
                  className="h-[46px] w-full rounded-xl border border-pink-200 bg-white pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            <div className="relative z-30">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Categoria
              </label>
              <FilterDropdown
                options={[
                  { value: "", label: "Todas" },
                  ...categories.map((cat) => ({
                    value: cat.slug,
                    label: cat.name,
                  })),
                ]}
                defaultValue={category}
                name="category"
                placeholder="Todas"
              />
            </div>

            <div className="relative z-30">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Marca
              </label>
              <FilterDropdown
                options={[
                  { value: "", label: "Todas" },
                  ...brands.map((item) => ({
                    value: item.slug,
                    label: item.name,
                  })),
                ]}
                defaultValue={brand}
                name="brand"
                placeholder="Todas"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Preço
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Mín."
                  defaultValue={minPrice}
                  className="w-full rounded-xl border border-pink-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Máx."
                  defaultValue={maxPrice}
                  className="w-full rounded-xl border border-pink-200 bg-white px-3 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Filtrar
              </Button>
            </div>
          </form>
        </div>

        {/* FILTROS ATIVOS */}
        {hasFilters && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-sm text-zinc-500">Filtros:</span>

            {search && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Pesquisa: {search}
              </span>
            )}

            {category && activeCategory && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Categoria: {activeCategory.name}
              </span>
            )}

            {subcategory && activeSubcategory && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Subcategoria: {activeSubcategory.name}
              </span>
            )}

            {brand && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Marca: {brands.find((item) => item.slug === brand)?.name ?? brand}
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Preço: {minPrice || "0"}€ — {maxPrice || "∞"}€
              </span>
            )}
          </div>
        )}

        {/* PRODUTOS */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-pink-100 bg-white p-20 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Nenhum produto encontrado</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Tenta alterar ou remover alguns filtros.
            </p>

            <Link
              href="/product"
              className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer bg-pink-500 text-white hover:bg-pink-600 mt-6"
            >
              Limpar filtros
            </Link>
          </div>
        ) : (
          <section>
            <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  brand={product.brand?.name ?? ""}
                  description={product.shortDescription ?? ""}
                  image={product.images[0]?.url ?? "/placeholder-product.png"}
                  price={Number(product.price)}
                  oldPrice={product.comparePrice ? Number(product.comparePrice) : undefined}
                  badge={product.isNew ? "Novo" : product.isOnSale ? "Promoção" : undefined}
                  rating={product.ratingAverage}
                  reviews={product.ratingCount}
                />
              ))}
            </div>

            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="mt-14 flex items-center justify-center gap-4 border-t border-zinc-200 pt-8">
                {currentPage > 1 ? (
                  <Link
                    href={`/product?${createQuery({ page: String(currentPage - 1) })}`}
                    className="group relative inline-flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-300 cursor-pointer bg-zinc-200 text-zinc-900 border-2 border-zinc-400 hover:bg-zinc-300 hover:border-pink-500 hover:text-pink-600 hover:shadow-[0_4px_20px_rgba(236,72,153,0.2)]"
                    aria-label="Página anterior"
                  >
                    <svg className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-200 text-zinc-400 cursor-not-allowed border-2 border-zinc-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                )}

                <div className="flex items-center gap-2 rounded-2xl bg-white border-2 border-zinc-300 px-6 py-2.5 shadow-sm">
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500">{currentPage}</span>
                  <span className="text-sm text-zinc-400">/</span>
                  <span className="text-sm font-semibold text-zinc-700">{totalPages}</span>
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={`/product?${createQuery({ page: String(currentPage + 1) })}`}
                    className="group relative inline-flex items-center justify-center h-12 w-12 rounded-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-[0_4px_25px_rgba(236,72,153,0.4)] hover:scale-105"
                    aria-label="Página seguinte"
                  >
                    <svg className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-200 text-zinc-400 cursor-not-allowed border-2 border-zinc-300">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}