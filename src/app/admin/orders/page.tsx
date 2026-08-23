import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusLabels: Record<string, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PROCESSING: "Em processamento",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    RETURNED: "Devolvido",
  };

  const statusBadgeColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PROCESSING: "bg-sky-50 text-sky-600 border-sky-200",
    SHIPPED: "bg-indigo-50 text-indigo-600 border-indigo-200",
    DELIVERED: "bg-green-50 text-green-600 border-green-200",
    CANCELLED: "bg-red-50 text-red-500 border-red-200",
    REFUNDED: "bg-orange-50 text-orange-600 border-orange-200",
    RETURNED: "bg-pink-50 text-pink-600 border-pink-200",
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Encomendas
        </h1>
        <p style={{ color: "#71717a" }}>
          Gestão de encomendas
        </p>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Nº</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Cliente</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Total</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Estado</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Data</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-100 hover:bg-pink-50/30"
                >
                  <td className="p-4 font-mono text-sm" style={{ color: "#18181b" }}>
                    #{order.id.slice(0, 8)}
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-medium" style={{ color: "#18181b" }}>
                        {order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : "Sem nome"}
                      </p>
                      <p className="text-xs" style={{ color: "#a1a1aa" }}>
                        {order.user?.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-semibold" style={{ color: "#18181b" }}>
                    {Number(order.total).toFixed(2)} €
                  </td>

                  <td className="p-4">
                    <span
                      className={`
                        inline-flex rounded-full border px-3 py-1 text-xs font-semibold
                        ${statusBadgeColors[order.status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"}
                      `}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>

                  <td className="p-4 text-sm" style={{ color: "#71717a" }}>
                    {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {/* VER - rosa sólido */}
                      <Link
                        href={`/admin/orders/${order.id}`}
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

                      {/* ESTADO - rosa sólido */}
                      <button
                        type="button"
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white
                          hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
                        "
                      >
                        Estado
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#71717a" }}>
            Ainda não existem encomendas.
          </div>
        )}
      </div>
    </div>
  );
}