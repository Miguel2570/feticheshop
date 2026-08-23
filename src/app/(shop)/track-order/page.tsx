"use client";

import Link from "next/link";
import { useState } from "react";

import {
  ArrowRight,
  PackageSearch,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<{
    orderNumber: string;
    status: string;
    createdAt: string;
    total: number;
    items: { name: string; quantity: number }[];
    shipment?: {
      carrier?: string | null;
      trackingNumber?: string | null;
    } | null;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Não foi possível encontrar a encomenda.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
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

  const statusColors: Record<string, string> = {
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
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-16">
        <div className="mx-auto max-w-2xl">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/10">
              <PackageSearch size={36} className="text-pink-500" />
            </div>

            <p className="section-eyebrow">Acompanhar Encomenda</p>

            <h1 className="section-title mt-4">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Estado da Encomenda
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-zinc-600">
              Introduz o número da encomenda e o email utilizado na compra.
            </p>
          </div>

          {/* FORMULÁRIO */}
          {!order && (
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Número da Encomenda
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Ex: #PS123456"
                    required
                    className="
                      h-12 w-full rounded-xl border border-pink-200 bg-white
                      px-4 text-sm text-zinc-900 outline-none transition-all
                      placeholder:text-zinc-400
                      hover:border-pink-300
                      focus:border-pink-500 focus:ring-2 focus:ring-pink-200
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemplo.pt"
                    required
                    className="
                      h-12 w-full rounded-xl border border-pink-200 bg-white
                      px-4 text-sm text-zinc-900 outline-none transition-all
                      placeholder:text-zinc-400
                      hover:border-pink-300
                      focus:border-pink-500 focus:ring-2 focus:ring-pink-200
                    "
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-6 inline-flex h-12 w-full items-center justify-center gap-2
                  rounded-full bg-pink-500 text-sm font-semibold text-white
                  transition-all duration-300 cursor-pointer
                  hover:bg-pink-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    A procurar...
                  </>
                ) : (
                  <>
                    Procurar Encomenda
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* RESULTADO */}
          {order && (
            <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "#18181b" }}>
                  Encomenda #{order.orderNumber}
                </h2>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusColors[order.status] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"
                  }`}
                >
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              {/* INFO */}
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs" style={{ color: "#71717a" }}>Data</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "#18181b" }}>
                    {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs" style={{ color: "#71717a" }}>Total</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "#18181b" }}>
                    €{order.total.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs" style={{ color: "#71717a" }}>Itens</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "#18181b" }}>
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                  </p>
                </div>
              </div>

              {/* TRACKING */}
              {order.shipment?.trackingNumber && (
                <div className="mb-6 rounded-xl border border-pink-100 bg-pink-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-pink-500" />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#18181b" }}>
                        {order.shipment.carrier ?? "Transportadora"}
                      </p>
                      <p className="text-sm font-mono" style={{ color: "#71717a" }}>
                        Tracking: {order.shipment.trackingNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUTOS */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3" style={{ color: "#18181b" }}>
                  Produtos
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-2.5"
                    >
                      <span className="text-sm" style={{ color: "#52525b" }}>
                        {item.name}
                      </span>
                      <span className="text-sm font-medium" style={{ color: "#18181b" }}>
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTÃO NOVA PESQUISA */}
              <button
                type="button"
                onClick={() => {
                  setOrder(null);
                  setOrderNumber("");
                  setEmail("");
                }}
                className="
                  inline-flex h-10 w-full items-center justify-center
                  rounded-full border border-pink-200 bg-white
                  text-sm font-medium text-zinc-700
                  transition-all cursor-pointer
                  hover:border-pink-300 hover:bg-pink-50
                "
              >
                Nova pesquisa
              </button>
            </div>
          )}

          {/* CONTACTO */}
          <div className="mt-6 text-center">
            <Link
              href="/contact"
              className="font-medium text-pink-500 transition hover:text-pink-600"
            >
              Não encontras a tua encomenda?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}