import Link from "next/link";

import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: {
      role: Role.CUSTOMER,
    },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
      orders: {
        select: {
          total: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Clientes
        </h1>
        <p style={{ color: "#71717a" }}>
          Gestão de clientes
        </p>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Nome</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Email</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Telefone</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Encomendas</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Total Gasto</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Estado</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Último Login</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, order) => sum + Number(order.total),
                  0
                );

                return (
                  <tr
                    key={customer.id}
                    className="border-b border-zinc-100 hover:bg-pink-50/30"
                  >
                    <td className="p-4">
                      <p className="font-medium" style={{ color: "#18181b" }}>
                        {customer.firstName} {customer.lastName}
                      </p>
                    </td>

                    <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                      {customer.email}
                    </td>

                    <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                      {customer.phone ?? "-"}
                    </td>

                    <td className="p-4 text-center font-semibold" style={{ color: "#18181b" }}>
                      {customer._count.orders}
                    </td>

                    <td className="p-4 text-right font-semibold" style={{ color: "#18181b" }}>
                      {totalSpent.toFixed(2)} €
                    </td>

                    <td className="p-4 text-center">
                      {customer.isActive ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Ativo
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-500">
                          Inativo
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center text-sm" style={{ color: "#71717a" }}>
                      {customer.lastLoginAt
                        ? new Date(customer.lastLoginAt).toLocaleDateString("pt-PT")
                        : "-"}
                    </td>

                    <td className="p-4">
                      <div className="flex justify-end">
                        {/* VER - rosa sólido */}
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="
                            inline-flex items-center justify-center
                            h-8 px-4 text-xs font-semibold rounded-lg
                            transition-all duration-200 cursor-pointer
                            bg-pink-500 text-white
                            hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
                          "
                        >
                          Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#71717a" }}>
            Ainda não existem clientes.
          </div>
        )}
      </div>
    </div>
  );
}