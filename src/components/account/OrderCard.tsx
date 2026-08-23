"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Package } from "lucide-react";

interface OrderCardProps {
  id?: string;
  number?: string;
  status?: string;
  total?: number;
  createdAt?: Date | string;
  items?: number;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-amber-50 text-amber-600 border-amber-200" },
  PROCESSING: { label: "Em processamento", className: "bg-sky-50 text-sky-600 border-sky-200" },
  SHIPPED: { label: "Enviado", className: "bg-purple-50 text-purple-600 border-purple-200" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  CANCELLED: { label: "Cancelado", className: "bg-red-50 text-red-500 border-red-200" },
};

export function OrderCard({
  id = "1",
  number = "PS-1001",
  status = "DELIVERED",
  total = 89.90,
  createdAt = new Date(),
  items = 3,
}: OrderCardProps) {
  const statusInfo = statusStyles[status] ?? {
    label: status,
    className: "bg-zinc-50 text-zinc-600 border-zinc-200",
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Encomenda
          </p>
          <h3 className="mt-1 text-lg font-bold text-zinc-900">#{number}</h3>
        </div>

        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-pink-50 pt-4">
        <div className="flex items-center gap-2.5">
          <Calendar size={17} className="shrink-0 text-pink-400" />
          <div>
            <p className="text-[11px] text-zinc-400">Data</p>
            <p className="text-sm font-medium text-zinc-800">
              {new Date(createdAt).toLocaleDateString("pt-PT")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Package size={17} className="shrink-0 text-pink-400" />
          <div>
            <p className="text-[11px] text-zinc-400">Itens</p>
            <p className="text-sm font-medium text-zinc-800">{items}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-zinc-400">Total</p>
          <p className="text-sm font-bold text-zinc-900">€ {total.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          href={`/account/orders/${id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-600"
        >
          Ver detalhes
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}