import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/Button";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    search?: string;
    status?: string;
    stock?: string;
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 20;

export default async function CategoryProductsPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const queryParams = await searchParams;

  const search = queryParams.search ?? "";
  const status = queryParams.status ?? "all";
  const stock = queryParams.stock ?? "all";
  const page = Math.max(1, Number(queryParams.page ?? "1"));

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      isFeatured: true,
    },
  });

  if (!category) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold" style={{ color: "#18181b" }}>
          Categoria não encontrada
        </h1>
        <div className="mt-6">
          <Link
            href="/admin/categories"
            className="inline-flex items-center justify-center h-10 px-5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
          >
            Voltar às categorias
          </Link>
        </div>
      </div>
    );
  }

  const where = {
    categories: {
      some: { categoryId: category.id },
    },
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status !== "all"
      ? { status: status as "ACTIVE" | "HIDDEN" | "DRAFT" | "ARCHIVED" }
      : {}),
    ...(stock === "in_stock" ? { stock: { gt: 0 } } : {}),
    ...(stock === "low_stock" ? { stock: { gt: 0, lte: 3 } } : {}),
    ...(stock === "out_of_stock" ? { stock: 0 } : {}),
  };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const products = await prisma.product.findMany({
    where,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      sku: true,
      price: true,
      stock: true,
      status: true,
      isFeatured: true,
      brand: { select: { name: true } },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  const [totalCategoryProducts, inStock, outOfStock, featuredCount] =
    await Promise.all([
      prisma.product.count({
        where: { categories: { some: { categoryId: category.id } } },
      }),
      prisma.product.count({
        where: {
          categories: { some: { categoryId: category.id } },
          stock: { gt: 0 },
        },
      }),
      prisma.product.count({
        where: {
          categories: { some: { categoryId: category.id } },
          stock: 0,
        },
      }),
      prisma.product.count({
        where: {
          categories: { some: { categoryId: category.id } },
          isFeatured: true,
        },
      }),
    ]);

  const statusLabels: Record<string, string> = {
    ACTIVE: "Visível",
    HIDDEN: "Oculto",
    DRAFT: "Rascunho",
    ARCHIVED: "Arquivado",
  };

  const statusBadgeColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    HIDDEN: "bg-zinc-50 text-zinc-500 border-zinc-200",
    DRAFT: "bg-yellow-50 text-yellow-600 border-yellow-200",
    ARCHIVED: "bg-red-50 text-red-500 border-red-200",
  };

  return (
    <div className="w-full space-y-5">
      {/* VOLTAR */}
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
      >
        ← Voltar às categorias
      </Link>

      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "#18181b" }}>
              {category.name}
            </h1>
            {category.isActive ? (
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Visível
              </span>
            ) : (
              <span className="rounded-full bg-zinc-50 border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                Oculta
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: "#71717a" }}>
            /{category.slug}
          </p>
        </div>
      </div>

      {/* RESUMO - cards responsivos */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total", value: totalCategoryProducts, color: "#18181b" },
          { label: "Com stock", value: inStock, color: "#059669" },
          { label: "Sem stock", value: outOfStock, color: "#ef4444" },
          { label: "Destaques", value: featuredCount, color: "#ec4899" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm"
          >
            <p className="text-[11px] sm:text-xs" style={{ color: "#71717a" }}>
              {stat.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold mt-1" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* PRODUTOS */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* FILTROS */}
        <div className="border-b border-zinc-100 p-3 sm:p-5">
          <form className="flex flex-wrap items-center gap-2 sm:gap-3" method="GET">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Pesquisar produto..."
              className="h-10 min-w-[150px] flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              style={{ color: "#18181b" }}
            />

            <select
              name="status"
              defaultValue={status}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none cursor-pointer focus:border-pink-500"
              style={{ color: "#18181b" }}
            >
              <option value="all">Todos</option>
              <option value="ACTIVE">Visíveis</option>
              <option value="HIDDEN">Ocultos</option>
              <option value="DRAFT">Rascunhos</option>
              <option value="ARCHIVED">Arquivados</option>
            </select>

            <select
              name="stock"
              defaultValue={stock}
              className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none cursor-pointer focus:border-pink-500"
              style={{ color: "#18181b" }}
            >
              <option value="all">Stock</option>
              <option value="in_stock">Com stock</option>
              <option value="low_stock">Baixo</option>
              <option value="out_of_stock">Sem stock</option>
            </select>

            <Button type="submit" size="md">
              Filtrar
            </Button>

            <Link
              href={`/admin/categories/${category.id}`}
              className="inline-flex items-center justify-center h-10 px-4 sm:px-5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
            >
              Limpar
            </Link>
          </form>
        </div>

        {/* TABELA DESKTOP */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Produto</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>SKU</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Marca</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Stock</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Preço</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Estado</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Destaque</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-zinc-100 hover:bg-pink-50/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="font-medium" style={{ color: "#18181b" }}>
                        {product.name}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-sm" style={{ color: "#71717a" }}>
                    {product.sku ?? "-"}
                  </td>
                  <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                    {product.brand?.name ?? "-"}
                  </td>
                  <td className="p-4 text-center">
                    {product.stock === 0 ? (
                      <span className="font-semibold text-red-500">0</span>
                    ) : product.stock <= 3 ? (
                      <span className="font-semibold text-yellow-600">{product.stock}</span>
                    ) : (
                      <span className="font-semibold text-emerald-600">{product.stock}</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold" style={{ color: "#18181b" }}>
                    {Number(product.price).toFixed(2)} €
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeColors[product.status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"}`}>
                      {statusLabels[product.status] ?? product.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {product.isFeatured ? (
                      <span className="text-pink-500">★</span>
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center justify-center h-8 px-4 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
                      >
                        Ver
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-10 text-center" style={{ color: "#71717a" }}>
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* CARDS MOBILE */}
        <div className="divide-y divide-zinc-100 lg:hidden">
          {products.map((product) => (
            <div key={product.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {product.images[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold" style={{ color: "#18181b" }}>
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "#a1a1aa" }}>
                    {product.sku ?? "Sem SKU"}
                  </p>
                  <p className="text-xs" style={{ color: "#71717a" }}>
                    {product.brand?.name ?? "-"}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold" style={{ color: "#18181b" }}>
                    {Number(product.price).toFixed(2)} €
                  </p>
                  {product.stock === 0 ? (
                    <span className="text-xs font-semibold text-red-500">Sem stock</span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600">
                      {product.stock} em stock
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeColors[product.status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"}`}>
                  {statusLabels[product.status] ?? product.status}
                </span>

                {product.isFeatured && (
                  <span className="text-pink-500 text-sm">★</span>
                )}

                <Link
                  href={`/admin/products/${product.id}`}
                  className="inline-flex items-center justify-center h-8 px-4 text-xs font-semibold rounded-lg bg-pink-500 text-white hover:bg-pink-600"
                >
                  Ver
                </Link>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="p-10 text-center text-sm" style={{ color: "#71717a" }}>
              Nenhum produto encontrado.
            </div>
          )}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-zinc-200 p-3 sm:p-5">
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href={{
                  pathname: `/admin/categories/${category.id}`,
                  query: { search, status, stock, page: "1" },
                }}
              >
                <Button size="sm" variant="outline" disabled={currentPage === 1}>
                  «
                </Button>
              </Link>

              <Link
                href={{
                  pathname: `/admin/categories/${category.id}`,
                  query: { search, status, stock, page: String(currentPage - 1) },
                }}
              >
                <Button size="sm" variant="outline" disabled={currentPage === 1}>
                  ←
                </Button>
              </Link>

              <div className="flex h-8 min-w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 text-sm font-semibold" style={{ color: "#18181b" }}>
                {currentPage}/{totalPages}
              </div>

              <Link
                href={{
                  pathname: `/admin/categories/${category.id}`,
                  query: { search, status, stock, page: String(currentPage + 1) },
                }}
              >
                <Button size="sm" disabled={currentPage === totalPages}>
                  →
                </Button>
              </Link>

              <Link
                href={{
                  pathname: `/admin/categories/${category.id}`,
                  query: { search, status, stock, page: String(totalPages) },
                }}
              >
                <Button size="sm" variant="outline" disabled={currentPage === totalPages}>
                  »
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}