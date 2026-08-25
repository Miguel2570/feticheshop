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
    <div className="w-full space-y-5 sm:space-y-6">
      {/* HEADER */}

      <div>
        <h1
          className="
            text-2xl
            font-bold
            sm:text-3xl
          "
          style={{ color: "#18181b" }}
        >
          Encomendas
        </h1>

        <p
          className="
            mt-1
            text-sm
            sm:text-base
          "
          style={{ color: "#71717a" }}
        >
          Gestão de encomendas
        </p>
      </div>

      {/* CONTEÚDO */}

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
        {/* ===================================================
            DESKTOP — TABELA
        =================================================== */}

        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className="
                  border-b
                  border-zinc-200
                  bg-zinc-50
                "
              >
                <tr className="text-left">
                  <th
                    className="p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Nº
                  </th>

                  <th
                    className="p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Cliente
                  </th>

                  <th
                    className="p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Total
                  </th>

                  <th
                    className="p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Estado
                  </th>

                  <th
                    className="p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Data
                  </th>

                  <th
                    className="
                      p-4
                      text-right
                      text-sm
                      font-semibold
                    "
                    style={{ color: "#52525b" }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="
                      border-b
                      border-zinc-100
                      transition
                      hover:bg-pink-50/30
                    "
                  >
                    {/* Nº */}

                    <td
                      className="
                        p-4
                        font-mono
                        text-sm
                      "
                      style={{ color: "#18181b" }}
                    >
                      #{order.id.slice(0, 8)}
                    </td>

                    {/* CLIENTE */}

                    <td className="p-4">
                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            font-medium
                          "
                          style={{ color: "#18181b" }}
                        >
                          {order.user
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : "Sem nome"}
                        </p>

                        {order.user?.email && (
                          <p
                            className="
                              truncate
                              text-xs
                            "
                            style={{ color: "#a1a1aa" }}
                          >
                            {order.user.email}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* TOTAL */}

                    <td
                      className="
                        p-4
                        whitespace-nowrap
                        font-semibold
                      "
                      style={{ color: "#18181b" }}
                    >
                      {Number(order.total).toFixed(2)} €
                    </td>

                    {/* ESTADO */}

                    <td className="p-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          border
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${
                            statusBadgeColors[order.status] ??
                            "bg-zinc-50 text-zinc-500 border-zinc-200"
                          }
                        `}
                      >
                        {statusLabels[order.status] ??
                          order.status}
                      </span>
                    </td>

                    {/* DATA */}

                    <td
                      className="
                        p-4
                        whitespace-nowrap
                        text-sm
                      "
                      style={{ color: "#71717a" }}
                    >
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("pt-PT")}
                    </td>

                    {/* AÇÕES */}

                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
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
                            hover:shadow-lg
                            hover:shadow-pink-500/25
                          "
                        >
                          Ver
                        </Link>

                        <button
                          type="button"
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
                            hover:shadow-lg
                            hover:shadow-pink-500/25
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
        </div>
                {/* ===================================================
            MOBILE / TABLET — CARDS
        =================================================== */}

        <div className="block lg:hidden">
          {orders.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="
                    p-4
                    transition
                    hover:bg-pink-50/20
                    sm:p-5
                  "
                >
                  {/* TOPO */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          font-mono
                          text-xs
                          font-semibold
                          text-zinc-500
                        "
                      >
                        #{order.id.slice(0, 8)}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          font-semibold
                          sm:text-base
                        "
                        style={{ color: "#18181b" }}
                      >
                        {order.user
                          ? `${order.user.firstName} ${order.user.lastName}`
                          : "Sem nome"}
                      </p>

                      {order.user?.email && (
                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                          "
                          style={{ color: "#a1a1aa" }}
                        >
                          {order.user.email}
                        </p>
                      )}
                    </div>

                    {/* ESTADO */}

                    <span
                      className={`
                        shrink-0
                        rounded-full
                        border
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        ${
                          statusBadgeColors[order.status] ??
                          "bg-zinc-50 text-zinc-500 border-zinc-200"
                        }
                      `}
                    >
                      {statusLabels[order.status] ??
                        order.status}
                    </span>
                  </div>

                  {/* INFORMAÇÕES */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    {/* TOTAL */}

                    <div
                      className="
                        rounded-xl
                        bg-zinc-50
                        p-3
                      "
                    >
                      <p
                        className="
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-zinc-400
                        "
                      >
                        Total
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-bold
                        "
                        style={{ color: "#18181b" }}
                      >
                        {Number(order.total).toFixed(2)} €
                      </p>
                    </div>

                    {/* DATA */}

                    <div
                      className="
                        rounded-xl
                        bg-zinc-50
                        p-3
                      "
                    >
                      <p
                        className="
                          text-[11px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-zinc-400
                        "
                      >
                        Data
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-medium
                        "
                        style={{ color: "#52525b" }}
                      >
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("pt-PT")}
                      </p>
                    </div>
                  </div>

                  {/* AÇÕES */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-pink-500
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-pink-600
                        sm:text-sm
                      "
                    >
                      Ver
                    </Link>

                    <button
                      type="button"
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-pink-500
                        px-4
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-pink-600
                        sm:text-sm
                      "
                    >
                      Estado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                p-10
                text-center
                text-sm
              "
              style={{ color: "#71717a" }}
            >
              Ainda não existem encomendas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}