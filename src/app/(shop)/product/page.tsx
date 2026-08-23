import { Prisma } from "@prisma/client";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { ProductSort } from "@/components/product/ProductSort";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const PAGE_SIZE = 24;

// Categorias do frontend
const FRONTEND_CATEGORY_SLUGS = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
];

type Props = {
  searchParams: Promise<{
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

  const category = params.category ?? "";
  const subcategory = params.subcategory ?? "";
  const brand = params.brand ?? "";
  const minPrice = params.minPrice ?? "";
  const maxPrice = params.maxPrice ?? "";
  const sale = params.sale ?? "";
  const isNew = params.new ?? "";
  const sort = params.sort ?? "newest";
  const page = Math.max(1, Number(params.page ?? "1"));

  /*
   * =========================
   * FILTROS
   * =========================
   */

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",

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

    // Se houver subcategory, filtra também por nome/descrição
    ...(subcategory
      ? {
          OR: [
            { name: { contains: subcategory, mode: "insensitive" as const } },
            { description: { contains: subcategory, mode: "insensitive" as const } },
            { shortDescription: { contains: subcategory, mode: "insensitive" as const } },
          ],
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

  /*
   * =========================
   * TOTAL
   * =========================
   */

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  /*
   * =========================
   * PRODUTOS
   * =========================
   */

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
    },
  });

  /*
   * =========================
   * CATEGORIAS & MARCAS
   * =========================
   */

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

  /*
   * =========================
   * QUERY BASE
   * =========================
   */

  const createQuery = (extra: Record<string, string> = {}) => {
    const query = new URLSearchParams();

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

  const hasFilters = !!(category || subcategory || brand || minPrice || maxPrice || sale === "true" || isNew === "true");

  // Título da página
  const pageTitle = subcategory
    ? subcategory
    : activeCategory
    ? activeCategory.name
    : "Todos os Produtos";

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Produtos", href: "/product" },
    ...(activeCategory
      ? [{ label: activeCategory.name, href: `/product?category=${activeCategory.slug}` }]
      : []),
    ...(subcategory
      ? [{ label: subcategory }]
      : []),
  ];

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <div className="container-custom py-12">
        {/* HEADER */}
        <div className="mb-10">
          {/* BREADCRUMB */}
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

          <form method="GET" className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* CATEGORIA */}
            <div className="relative z-30">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Categoria
              </label>
              <FilterDropdown
                options={[
                  { value: "", label: "Todas as categorias" },
                  ...categories.map((cat) => ({
                    value: cat.slug,
                    label: cat.name,
                  })),
                ]}
                defaultValue={category}
                name="category"
                placeholder="Todas as categorias"
              />
            </div>

            {/* MARCA */}
            <div className="relative z-30">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Marca
              </label>
              <FilterDropdown
                options={[
                  { value: "", label: "Todas as marcas" },
                  ...brands.map((item) => ({
                    value: item.slug,
                    label: item.name,
                  })),
                ]}
                defaultValue={brand}
                name="brand"
                placeholder="Todas as marcas"
              />
            </div>

            {/* PREÇO */}
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
                  className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Máx."
                  defaultValue={maxPrice}
                  className="w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* TIPO */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-zinc-600">
                Tipo
              </label>
              <div className="flex h-[46px] items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" name="sale" value="true" defaultChecked={sale === "true"} className="h-4 w-4 accent-pink-500" />
                  Promoções
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" name="new" value="true" defaultChecked={isNew === "true"} className="h-4 w-4 accent-pink-500" />
                  Novidades
                </label>
              </div>
            </div>

            {/* BOTÃO */}
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

            {category && activeCategory && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Categoria: {activeCategory.name}
              </span>
            )}

            {subcategory && (
              <span className="rounded-full bg-pink-500/10 px-3 py-1.5 text-xs font-medium text-pink-600">
                Subcategoria: {subcategory}
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

            {/* BOTÃO ROSA SÓLIDO */}
            <Link
              href="/product"
              className="
                inline-flex items-center justify-center
                h-10 px-5 text-sm font-semibold rounded-xl
                transition-all duration-200 cursor-pointer
                bg-pink-500 text-white
                hover:bg-pink-600
                mt-6
              "
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
              <div className="mt-14 flex flex-wrap justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                  const current = index + 1;
                  const query = createQuery({ page: String(current) });

                  return (
                    <Link key={current} href={`/product?${query}`}>
                      <Button variant={current === currentPage ? "secondary" : "outline"} size="sm">
                        {current}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}