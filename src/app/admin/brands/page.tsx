import Link from "next/link";
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 25;

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
};

export default async function BrandsPage({ searchParams }: Props) {
  const params = await searchParams;

  const parsedPage = Number(params.page ?? "1");
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.floor(parsedPage)
      : 1;

  const search = params.search?.trim() ?? "";
  const status = params.status ?? "all";

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              slug: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(status === "active" ? { isActive: true } : {}),
    ...(status === "inactive" ? { isActive: false } : {}),
  };

  const total = await prisma.brand.count({ where });

  const totalPages = Math.max(
    1,
    Math.ceil(total / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const brands = await prisma.brand.findMany({
    where,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div>
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "#18181b" }}
        >
          Marcas
        </h1>

        <p
          className="mt-1 text-sm sm:text-base"
          style={{ color: "#71717a" }}
        >
          {total} {total === 1 ? "marca" : "marcas"}
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          method="GET"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Pesquisar marca..."
            className="h-11 w-full min-w-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 sm:h-10 lg:min-w-[220px] lg:flex-1"
            style={{ color: "#18181b" }}
          />

          <select
            name="status"
            defaultValue={status}
            className="h-11 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-pink-500 sm:h-10 lg:w-auto"
            style={{ color: "#18181b" }}
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>

          <button
            type="submit"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-pink-500 px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-pink-600 sm:h-10 lg:w-auto"
          >
            Filtrar
          </button>

          <Link
            href="/admin/brands"
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition-all duration-200 hover:bg-zinc-50 sm:h-10 lg:w-auto"
          >
            Limpar
          </Link>
        </form>
      </div>

      {/* CONTEÚDO */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr className="text-left">
                  <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                    Marca
                  </th>

                  <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>
                    Slug
                  </th>

                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>
                    Produtos
                  </th>

                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>
                    Estado
                  </th>

                  <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="border-b border-zinc-100 transition hover:bg-pink-50/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-sm font-bold text-pink-500">
                            {brand.name.charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p
                            className="font-medium"
                            style={{ color: "#18181b" }}
                          >
                            {brand.name}
                          </p>

                          {brand.description && (
                            <p
                              className="max-w-[240px] truncate text-xs"
                              style={{ color: "#a1a1aa" }}
                            >
                              {brand.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td
                      className="p-4 text-sm"
                      style={{ color: "#71717a" }}
                    >
                      /{brand.slug}
                    </td>

                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/products?brand=${brand.id}`}
                        className="font-semibold text-pink-500 hover:text-pink-600 hover:underline"
                      >
                        {brand._count.products}
                      </Link>
                    </td>

                    <td className="p-4 text-center">
                      {brand.isActive ? (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Ativa
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-500">
                          Inativa
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-pink-500 px-4 text-xs font-semibold text-white transition hover:bg-pink-600"
                        >
                          Ver
                        </Link>

                        <Link
                          href={`/admin/brands/${brand.id}/edit`}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-white transition hover:bg-zinc-800"
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {brands.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-sm"
                      style={{ color: "#71717a" }}
                    >
                      Nenhuma marca encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
                {/* MOBILE / TABLET */}
        <div className="block lg:hidden">
          {brands.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="p-4 transition hover:bg-pink-50/20 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-11 w-11 shrink-0 rounded-xl bg-zinc-100 object-cover sm:h-12 sm:w-12"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-sm font-bold text-pink-500 sm:h-12 sm:w-12">
                          {brand.name.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold sm:text-base"
                          style={{ color: "#18181b" }}
                        >
                          {brand.name}
                        </p>

                        {brand.description && (
                          <p
                            className="mt-0.5 line-clamp-1 text-xs"
                            style={{ color: "#a1a1aa" }}
                          >
                            {brand.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {brand.isActive ? (
                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                        Ativa
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">
                        Inativa
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="min-w-0 rounded-xl bg-zinc-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Slug
                      </p>

                      <p
                        className="mt-1 truncate text-xs font-medium"
                        style={{ color: "#52525b" }}
                      >
                        /{brand.slug}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                        Produtos
                      </p>

                      <Link
                        href={`/admin/products?brand=${brand.id}`}
                        className="mt-1 block text-sm font-bold text-pink-500 hover:text-pink-600"
                      >
                        {brand._count.products}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/brands/${brand.id}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-pink-500 px-4 text-xs font-semibold text-white transition hover:bg-pink-600 sm:text-sm"
                    >
                      Ver
                    </Link>

                    <Link
                      href={`/admin/brands/${brand.id}/edit`}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:text-sm"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-10 text-center text-sm"
              style={{ color: "#71717a" }}
            >
              Nenhuma marca encontrada.
            </div>
          )}
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="border-t-2 border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Link
                href={{
                  pathname: "/admin/brands",
                  query: {
                    search,
                    status,
                    page: "1",
                  },
                }}
                aria-label="Primeira página"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 sm:h-10 sm:w-auto sm:px-3 ${
                  currentPage === 1
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "cursor-pointer border-2 border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                «
                <span className="hidden sm:inline">&nbsp;Primeira</span>
              </Link>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: {
                    search,
                    status,
                    page: String(Math.max(1, currentPage - 1)),
                  },
                }}
                aria-label="Página anterior"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 sm:h-10 sm:w-auto sm:px-3 ${
                  currentPage === 1
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "cursor-pointer border-2 border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                ‹
                <span className="hidden sm:inline">&nbsp;Anterior</span>
              </Link>

              <div className="flex h-9 min-w-[72px] items-center justify-center rounded-lg bg-pink-500 px-3 text-xs font-bold text-white shadow-sm sm:h-10 sm:min-w-[90px] sm:px-4 sm:text-sm">
                {currentPage} / {totalPages}
              </div>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: {
                    search,
                    status,
                    page: String(Math.min(totalPages, currentPage + 1)),
                  },
                }}
                aria-label="Página seguinte"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 sm:h-10 sm:w-auto sm:px-3 ${
                  currentPage === totalPages
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "cursor-pointer bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                <span className="hidden sm:inline">Seguinte&nbsp;</span>
                ›
              </Link>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: {
                    search,
                    status,
                    page: String(totalPages),
                  },
                }}
                aria-label="Última página"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 sm:h-10 sm:w-auto sm:px-3 ${
                  currentPage === totalPages
                    ? "pointer-events-none bg-zinc-200 text-zinc-400"
                    : "cursor-pointer border-2 border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                »
                <span className="hidden sm:inline">&nbsp;Última</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}