"use client";

import Link from "next/link";

import {
  ArrowRight,
} from "lucide-react";

import { OrderStatus } from "@prisma/client";

interface RecentOrdersProps {
  orders: {
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: OrderStatus;
    createdAt: Date;
  }[];
}

const statusColors: Record<OrderStatus, string> = {
  PENDING:
    "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",

  PAID:
    "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",

  PROCESSING:
    "bg-sky-500/15 text-sky-600 border-sky-500/20",

  SHIPPED:
    "bg-indigo-500/15 text-indigo-600 border-indigo-500/20",

  DELIVERED:
    "bg-green-500/15 text-green-600 border-green-500/20",

  CANCELLED:
    "bg-red-500/15 text-red-500 border-red-500/20",

  REFUNDED:
    "bg-orange-500/15 text-orange-600 border-orange-500/20",

  RETURNED:
    "bg-pink-500/15 text-pink-600 border-pink-500/20",
};

export function RecentOrders({
  orders,
}: RecentOrdersProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            Últimas Encomendas
          </h2>

          <p 
            className="mt-2 text-sm"
            style={{ color: "#71717a" }}
          >
            Encomendas mais recentes
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-zinc-200
            bg-white
            px-5
            py-2
            text-sm
            text-zinc-700
            transition
            hover:border-pink-300
            hover:bg-pink-50
            hover:text-pink-500
          "
        >
          Ver todas

          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-50
              p-5
              transition
              hover:border-pink-300
              hover:bg-pink-50/50
            "
          >
            <div>
              <p 
                className="font-semibold"
                style={{ color: "#18181b" }}
              >
                #{order.orderNumber}
              </p>

              <p 
                className="mt-1 text-sm"
                style={{ color: "#71717a" }}
              >
                {order.customer}
              </p>
            </div>

            <div className="text-right">
              <p 
                className="font-semibold"
                style={{ color: "#18181b" }}
              >
                €{order.total.toFixed(2)}
              </p>

              <p 
                className="mt-1 text-xs"
                style={{ color: "#71717a" }}
              >
                {new Date(order.createdAt).toLocaleDateString("pt-PT")}
              </p>
            </div>

            <span
              className={`
                rounded-full
                border
                px-4
                py-2
                text-xs
                font-semibold
                ${statusColors[order.status]}
              `}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}