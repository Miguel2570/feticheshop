import Link from "next/link";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { ToggleCouponStatusButton } from "@/components/admin/coupons/ToggleCouponStatusButton";

const ITEMS_PER_PAGE = 20;

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    type?: string;
    status?: string;
  }>;
};

export default async function CouponsPage({ searchParams }: Props) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? "1"));
  const search = params.search ?? "";
  const type = params.type ?? "all";
  const status = params.status ?? "all";

  const where: Prisma.CouponWhereInput = {
    ...(search && {
      OR: [
        { code: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),

    ...(status === "active" && { isActive: true }),
    ...(status === "inactive" && { isActive: false }),

    ...(type === "percentage" && { isPercentage: true }),
    ...(type === "fixed" && { isPercentage: false }),
  };

  const total = await prisma.coupon.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const coupons = await prisma.coupon.findMany({
    where,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    orderBy: { createdAt: "desc" },
  });

  const activeCoupons = await prisma.coupon.count({
    where: { isActive: true },
  });

  const inactiveCoupons = await prisma.coupon.count({
    where: { isActive: false },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
            Cupões
          </h1>

          <p style={{ color: "#71717a" }}>
            Gestão de cupões da loja
          </p>
        </div>

        <Link
          href="/admin/coupons/new"
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            bg-pink-500 text-white
            hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
          "
        >
          Novo Cupão
        </Link>
      </div>

      {/* RESUMO */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs" style={{ color: "#71717a" }}>
            Total de cupões
          </p>

          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "#18181b" }}
          >
            {total}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs" style={{ color: "#71717a" }}>
            Cupões ativos
          </p>

          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "#059669" }}
          >
            {activeCoupons}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="text-xs" style={{ color: "#71717a" }}>
            Cupões inativos
          </p>

          <p
            className="text-2xl font-bold mt-1"
            style={{ color: "#ef4444" }}
          >
            {inactiveCoupons}
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

        {/* FILTROS */}
        <div className="border-b border-zinc-100 p-5">
          <form
            className="flex flex-wrap items-center gap-3"
            method="GET"
          >
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Pesquisar cupão..."
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
              name="type"
              defaultValue={type}
              className="
                h-10 rounded-xl border border-zinc-200 bg-white
                px-3 text-sm outline-none cursor-pointer
                focus:border-pink-500
              "
              style={{ color: "#18181b" }}
            >
              <option value="all">Todos os tipos</option>
              <option value="percentage">Percentagem</option>
              <option value="fixed">Valor Fixo</option>
            </select>

            <select
              name="status"
              defaultValue={status}
              className="
                h-10 rounded-xl border border-zinc-200 bg-white
                px-3 text-sm outline-none cursor-pointer
                focus:border-pink-500
              "
              style={{ color: "#18181b" }}
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>

            <button
              type="submit"
              className="
                inline-flex items-center justify-center
                h-10 px-5 text-sm font-semibold rounded-xl
                transition-all duration-200 cursor-pointer
                bg-pink-500 text-white
                hover:bg-pink-600
              "
            >
              Filtrar
            </button>

            <Link
              href="/admin/coupons"
              className="
                inline-flex items-center justify-center
                h-10 px-5 text-sm font-semibold rounded-xl
                transition-all duration-200 cursor-pointer
                bg-pink-500 text-white
                hover:bg-pink-600
              "
            >
              Limpar
            </Link>
          </form>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Código
                </th>

                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Tipo
                </th>

                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Valor
                </th>

                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Utilizações
                </th>

                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Estado
                </th>

                <th
                  className="p-4 text-right text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-zinc-100 hover:bg-pink-50/30"
                >
                  <td className="p-4">
                    <div
                      className="font-medium"
                      style={{ color: "#18181b" }}
                    >
                      {coupon.code}
                    </div>

                    <div
                      className="text-xs"
                      style={{ color: "#a1a1aa" }}
                    >
                      {coupon.description ?? "-"}
                    </div>
                  </td>

                  <td
                    className="p-4 text-sm"
                    style={{ color: "#52525b" }}
                  >
                    {coupon.isPercentage
                      ? "Percentagem"
                      : "Valor Fixo"}
                  </td>

                  <td
                    className="p-4 font-semibold"
                    style={{ color: "#18181b" }}
                  >
                    {coupon.isPercentage
                      ? `${Number(coupon.discountValue)}%`
                      : `${Number(coupon.discountValue).toFixed(2)} €`}
                  </td>

                  <td
                    className="p-4 text-sm"
                    style={{ color: "#52525b" }}
                  >
                    {coupon.usedCount}
                    {coupon.usageLimit && (
                      <> / {coupon.usageLimit}</>
                    )}
                  </td>

                  <td className="p-4">
                    {coupon.isActive ? (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                        Ativo
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-500">
                        Inativo
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/coupons/${coupon.id}`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white
                          hover:bg-pink-600
                        "
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/admin/coupons/${coupon.id}/edit`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white
                          hover:bg-pink-600
                        "
                      >
                        Editar
                      </Link>

                      <ToggleCouponStatusButton
                        id={coupon.id}
                        active={coupon.isActive}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center"
                    style={{ color: "#71717a" }}
                  >
                    Nenhum cupão encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
                {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-zinc-200 p-5">
            <div className="flex items-center gap-2">
              <Link
                href={{
                  pathname: "/admin/coupons",
                  query: {
                    search,
                    type,
                    status,
                    page: "1",
                  },
                }}
              >
                <button
                  className="
                    h-8 px-3 text-xs font-semibold rounded-lg
                    border border-zinc-200 bg-white text-zinc-700
                    disabled:opacity-40
                  "
                  disabled={currentPage === 1}
                >
                  «
                </button>
              </Link>

              <Link
                href={{
                  pathname: "/admin/coupons",
                  query: {
                    search,
                    type,
                    status,
                    page: String(currentPage - 1),
                  },
                }}
              >
                <button
                  className="
                    h-8 px-3 text-xs font-semibold rounded-lg
                    border border-zinc-200 bg-white text-zinc-700
                    disabled:opacity-40
                  "
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
              </Link>

              <div
                className="
                  flex h-8 min-w-10 items-center justify-center
                  rounded-lg border border-zinc-200 bg-white
                  px-4 text-sm font-semibold
                "
                style={{ color: "#18181b" }}
              >
                {currentPage} / {totalPages}
              </div>

              <Link
                href={{
                  pathname: "/admin/coupons",
                  query: {
                    search,
                    type,
                    status,
                    page: String(currentPage + 1),
                  },
                }}
              >
                <button
                  className="
                    h-8 px-3 text-xs font-semibold rounded-lg
                    bg-pink-500 text-white
                    disabled:opacity-40
                  "
                  disabled={currentPage === totalPages}
                >
                  Seguinte
                </button>
              </Link>

              <Link
                href={{
                  pathname: "/admin/coupons",
                  query: {
                    search,
                    type,
                    status,
                    page: String(totalPages),
                  },
                }}
              >
                <button
                  className="
                    h-8 px-3 text-xs font-semibold rounded-lg
                    border border-zinc-200 bg-white text-zinc-700
                    disabled:opacity-40
                  "
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}