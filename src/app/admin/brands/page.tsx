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

  const page = Math.max(1, Number(params.page ?? "1"));
  const search = params.search ?? "";
  const status = params.status ?? "all";

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(status === "active" && { isActive: true }),
    ...(status === "inactive" && { isActive: false }),
  };

  const total = await prisma.brand.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const brands = await prisma.brand.findMany({
    where,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Marcas
        </h1>
        <p style={{ color: "#71717a" }}>
          {total} {total === 1 ? "marca" : "marcas"}
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <form className="flex flex-wrap items-center gap-3" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Pesquisar marca..."
            className="
              h-10 min-w-[200px] flex-1
              rounded-xl border border-zinc-200 bg-zinc-50
              px-4 text-sm outline-none transition
              placeholder:text-zinc-400
              focus:border-pink-500 focus:ring-2 focus:ring-pink-200
            "
            style={{ color: "#18181b" }}
          />

          <select
            name="status"
            defaultValue={status}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none cursor-pointer focus:border-pink-500"
            style={{ color: "#18181b" }}
          >
            <option value="all">Todas</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>

          <button
            type="submit"
            className="
              inline-flex items-center justify-center
              h-10 px-5 text-sm font-semibold rounded-xl
              transition-all duration-200 cursor-pointer
              bg-pink-500 text-white hover:bg-pink-600
            "
          >
            Filtrar
          </button>

          <Link
            href="/admin/brands"
            className="
              inline-flex items-center justify-center
              h-10 px-5 text-sm font-semibold rounded-xl
              transition-all duration-200 cursor-pointer
              bg-pink-500 text-white hover:bg-pink-600
            "
          >
            Limpar
          </Link>
        </form>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Marca</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Slug</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Produtos</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Estado</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-zinc-100 hover:bg-pink-50/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-10 w-10 rounded-lg object-cover bg-zinc-100"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-50 text-pink-500 text-sm font-bold">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium" style={{ color: "#18181b" }}>
                          {brand.name}
                        </p>
                        {brand.description && (
                          <p className="text-xs truncate max-w-[200px]" style={{ color: "#a1a1aa" }}>
                            {brand.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm" style={{ color: "#71717a" }}>
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
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Ativa
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-50 border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500">
                        Inativa
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/brands/${brand.id}`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white hover:bg-pink-600
                        "
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white hover:bg-pink-600
                        "
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {brands.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center" style={{ color: "#71717a" }}>
                    Nenhuma marca encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex justify-center border-t-2 border-zinc-300 bg-zinc-50 p-5">
            <div className="flex items-center gap-2">
              <Link
                href={{
                  pathname: "/admin/brands",
                  query: { search, status, page: "1" },
                }}
                className={`
                  h-9 px-3 text-xs font-semibold rounded-lg
                  inline-flex items-center justify-center
                  transition-all duration-200
                  ${currentPage === 1 
                    ? 'bg-zinc-200 text-zinc-400 pointer-events-none' 
                    : 'bg-white text-zinc-700 border-2 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
                  }
                `}
              >
                «
              </Link>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: { search, status, page: String(currentPage - 1) },
                }}
                className={`
                  h-9 px-3 text-xs font-semibold rounded-lg
                  inline-flex items-center justify-center
                  transition-all duration-200
                  ${currentPage === 1 
                    ? 'bg-zinc-200 text-zinc-400 pointer-events-none' 
                    : 'bg-white text-zinc-700 border-2 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
                  }
                `}
              >
                Anterior
              </Link>

              <div className="flex h-9 min-w-10 items-center justify-center rounded-lg bg-pink-500 px-4 text-sm font-bold text-white shadow-sm">
                {currentPage} / {totalPages}
              </div>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: { search, status, page: String(currentPage + 1) },
                }}
                className={`
                  h-9 px-3 text-xs font-semibold rounded-lg
                  inline-flex items-center justify-center
                  transition-all duration-200
                  ${currentPage === totalPages 
                    ? 'bg-zinc-200 text-zinc-400 pointer-events-none' 
                    : 'bg-pink-500 text-white hover:bg-pink-600 cursor-pointer'
                  }
                `}
              >
                Seguinte
              </Link>

              <Link
                href={{
                  pathname: "/admin/brands",
                  query: { search, status, page: String(totalPages) },
                }}
                className={`
                  h-9 px-3 text-xs font-semibold rounded-lg
                  inline-flex items-center justify-center
                  transition-all duration-200
                  ${currentPage === totalPages 
                    ? 'bg-zinc-200 text-zinc-400 pointer-events-none' 
                    : 'bg-white text-zinc-700 border-2 border-zinc-300 hover:bg-zinc-100 cursor-pointer'
                  }
                `}
              >
                »
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}