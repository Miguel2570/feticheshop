import Link from "next/link";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      orderAddress: true,
      payment: true,
      shipment: true,
      coupon: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
            Encomenda #{order.orderNumber}
          </h1>
          <p style={{ color: "#71717a" }}>
            Criada em {new Date(order.createdAt).toLocaleString("pt-PT")}
          </p>
        </div>

        {/* VOLTAR - rosa sólido */}
        <Link
          href="/admin/orders"
          className="
            inline-flex items-center justify-center
            h-9 px-4 text-xs font-semibold rounded-lg
            transition-all duration-200 cursor-pointer
            bg-pink-500 text-white
            hover:bg-pink-600
          "
        >
          Voltar
        </Link>
      </div>

      {/* GRID CLIENTE + ESTADO */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* CLIENTE */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#18181b" }}>
            Cliente
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Nome</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.user.firstName} {order.user.lastName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Email</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.user.email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Telefone</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.user.phone ?? "-"}
              </span>
            </div>
          </div>
        </div>

        {/* ESTADO */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold mb-4" style={{ color: "#18181b" }}>
            Estado
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Encomenda</span>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  statusBadgeColors[order.status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"
                }`}
              >
                {statusLabels[order.status] ?? order.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Pagamento</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.payment?.status ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Método</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.payment?.method ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Transportadora</span>
              <span className="font-medium" style={{ color: "#18181b" }}>
                {order.shipment?.carrier ?? "-"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "#71717a" }}>Tracking</span>
              <span className="font-mono font-medium" style={{ color: "#18181b" }}>
                {order.shipment?.trackingNumber ?? "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MORADA */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#18181b" }}>
          Morada de envio
        </h2>

        <div className="space-y-1 text-sm">
          <p className="font-medium" style={{ color: "#18181b" }}>
            {order.orderAddress.firstName} {order.orderAddress.lastName}
          </p>
          <p style={{ color: "#52525b" }}>{order.orderAddress.addressLine1}</p>
          {order.orderAddress.addressLine2 && (
            <p style={{ color: "#52525b" }}>{order.orderAddress.addressLine2}</p>
          )}
          <p style={{ color: "#52525b" }}>
            {order.orderAddress.postalCode} {order.orderAddress.city}
          </p>
          <p style={{ color: "#52525b" }}>{order.orderAddress.country}</p>
          <p style={{ color: "#52525b" }}>{order.orderAddress.phone}</p>
        </div>
      </div>

      {/* PRODUTOS */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-5">
          <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
            Produtos
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Produto</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>SKU</th>
                <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Qtd</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Unitário</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100">
                  <td className="p-4 text-sm font-medium" style={{ color: "#18181b" }}>
                    {item.name}
                  </td>
                  <td className="p-4 text-sm" style={{ color: "#71717a" }}>
                    {item.sku ?? "-"}
                  </td>
                  <td className="p-4 text-center text-sm" style={{ color: "#18181b" }}>
                    {item.quantity}
                  </td>
                  <td className="p-4 text-right text-sm" style={{ color: "#52525b" }}>
                    {Number(item.unitPrice).toFixed(2)} €
                  </td>
                  <td className="p-4 text-right text-sm font-semibold" style={{ color: "#18181b" }}>
                    {Number(item.totalPrice).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESUMO */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#18181b" }}>
          Resumo
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#71717a" }}>Subtotal</span>
            <span className="font-medium" style={{ color: "#18181b" }}>
              {Number(order.subtotal).toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: "#71717a" }}>Envio</span>
            <span className="font-medium" style={{ color: "#18181b" }}>
              {Number(order.shipping).toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: "#71717a" }}>Desconto</span>
            <span className="font-medium text-pink-500">
              -{Number(order.discount).toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between border-t border-zinc-100 pt-3 text-lg font-bold">
            <span style={{ color: "#18181b" }}>Total</span>
            <span style={{ color: "#18181b" }}>
              {Number(order.total).toFixed(2)} €
            </span>
          </div>

          {order.coupon && (
            <div className="pt-2">
              <span style={{ color: "#71717a" }}>Cupão utilizado:</span>{" "}
              <strong className="text-pink-500">{order.coupon.code}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}