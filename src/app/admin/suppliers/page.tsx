import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { SupplierSyncButton } from "@/components/admin/SupplierSyncButton";
import { Button } from "@/components/ui/Button";

export default async function SupplierPage() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      _count: {
        select: {
          products: true,
          syncs: true,
        },
      },
      syncs: {
        orderBy: {
          startedAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "#18181b" }}
          >
            Fornecedores
          </h1>

          <p style={{ color: "#71717a" }}>
            Gestão de fornecedores e sincronizações
          </p>
        </div>

        {/* NOVO FORNECEDOR */}
        <Link
          href="/admin/suppliers/new"
          className="
            inline-flex
            h-10
            items-center
            justify-center
            rounded-xl
            bg-pink-500
            px-5
            text-sm
            font-semibold
            text-white
            transition-all
            duration-200
            hover:bg-pink-600
            hover:shadow-lg
            hover:shadow-pink-500/25
          "
        >
          Novo fornecedor
        </Link>
      </div>

      {/* RESUMO */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Fornecedores",
            value: suppliers.length,
            color: "#18181b",
          },
          {
            label: "Ativos",
            value: suppliers.filter(
              (supplier) => supplier.isActive,
            ).length,
            color: "#059669",
          },
          {
            label: "Produtos",
            value: suppliers.reduce(
              (total, supplier) =>
                total + supplier._count.products,
              0,
            ),
            color: "#18181b",
          },
          {
            label: "Sincronizações",
            value: suppliers.reduce(
              (total, supplier) =>
                total + supplier._count.syncs,
              0,
            ),
            color: "#18181b",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="
              rounded-xl
              border
              border-zinc-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <p
              className="text-xs"
              style={{ color: "#71717a" }}
            >
              {stat.label}
            </p>

            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* TABELA */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-zinc-200
          bg-white
          shadow-sm
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Nome
                </th>

                <th
                  className="p-4 text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Website
                </th>

                <th
                  className="p-4 text-center text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Produtos
                </th>

                <th
                  className="p-4 text-center text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Sincronizações
                </th>

                <th
                  className="p-4 text-center text-sm font-semibold"
                  style={{ color: "#52525b" }}
                >
                  Última sincronização
                </th>

                <th
                  className="p-4 text-center text-sm font-semibold"
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
              {suppliers.map((supplier) => {
                const lastSync = supplier.syncs[0];

                return (
                  <tr
                    key={supplier.id}
                    className="
                      border-b
                      border-zinc-100
                      hover:bg-pink-50/30
                    "
                  >
                    {/* NOME */}
                    <td className="p-4">
                      <p
                        className="font-medium"
                        style={{ color: "#18181b" }}
                      >
                        {supplier.name}
                      </p>

                      <p
                        className="text-xs"
                        style={{ color: "#a1a1aa" }}
                      >
                        {supplier.slug}
                      </p>
                    </td>

                    {/* WEBSITE */}
                    <td className="p-4">
                      {supplier.website ? (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noreferrer"
                          className="
                            text-pink-500
                            hover:underline
                          "
                        >
                          {supplier.website}
                        </a>
                      ) : (
                        <span
                          style={{ color: "#71717a" }}
                        >
                          -
                        </span>
                      )}
                    </td>

                    {/* PRODUTOS */}
                    <td
                      className="
                        p-4
                        text-center
                        font-semibold
                      "
                      style={{ color: "#18181b" }}
                    >
                      {supplier._count.products}
                    </td>

                    {/* SINCRONIZAÇÕES */}
                    <td
                      className="
                        p-4
                        text-center
                        font-semibold
                      "
                      style={{ color: "#18181b" }}
                    >
                      {supplier._count.syncs}
                    </td>

                    {/* ÚLTIMA SINCRONIZAÇÃO */}
                    <td
                      className="
                        p-4
                        text-center
                        text-sm
                      "
                      style={{ color: "#71717a" }}
                    >
                      {lastSync
                        ? new Date(
                            lastSync.startedAt,
                          ).toLocaleDateString("pt-PT")
                        : "-"}
                    </td>

                    {/* ESTADO */}
                    <td className="p-4 text-center">
                      {supplier.isActive ? (
                        <span
                          className="
                            rounded-full
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-emerald-600
                          "
                        >
                          Ativo
                        </span>
                      ) : (
                        <span
                          className="
                            rounded-full
                            border
                            border-red-200
                            bg-red-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-red-500
                          "
                        >
                          Inativo
                        </span>
                      )}
                    </td>

                    {/* AÇÕES */}
                    <td className="p-4">
                      <div
                        className="
                          flex
                          items-center
                          justify-end
                          gap-2
                          whitespace-nowrap
                        "
                      >
                        <SupplierSyncButton
                          supplierId={supplier.id}
                        />

                        <Link
                          href={`/admin/suppliers/${supplier.id}`}
                          className="
                            inline-flex
                            h-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-pink-500
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-pink-600
                          "
                        >
                          Ver
                        </Link>
                                                <Link
                          href={`/admin/suppliers/${supplier.id}/edit`}
                          className="
                            inline-flex
                            h-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-pink-500
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-pink-600
                          "
                        >
                          Editar
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SEM FORNECEDORES */}
        {suppliers.length === 0 && (
          <div
            className="py-12 text-center"
            style={{ color: "#71717a" }}
          >
            Ainda não existem fornecedores.
          </div>
        )}
      </div>
    </div>
  );
}