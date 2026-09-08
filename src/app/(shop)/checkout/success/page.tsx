import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowRight,
  CheckCircle2,
  Package,
  Smartphone,
  Landmark,
  Copy,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.orderId;

  if (!orderId) {
    notFound();
  }

  const user = await getCurrentUser();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
      orderAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  if (user && order.userId !== user.id) {
    notFound();
  }

  const isMBWay = order.payment?.method === "MBWAY";
  const isMultibanco = order.payment?.method === "MULTIBANCO";
  const paymentMethodLabel = isMBWay ? "MB Way" : "Multibanco";

  // Gerar referência Multibanco (placeholder - deve vir da API)
  const multibancoReference = order.payment?.transactionId || "123 456 789";

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[80vh] items-center justify-center py-10 md:py-20">
        <div
          className="
            w-full
            max-w-3xl
            rounded-2xl sm:rounded-[30px] md:rounded-[40px]
            border
            border-pink-100
            bg-white
            p-6
            text-center
            shadow-sm
            sm:p-8
            md:p-16
          "
        >
          <div
            className="
              mx-auto
              flex
              h-20
              w-20
              sm:h-24
              sm:w-24
              md:h-28
              md:w-28
              items-center
              justify-center
              rounded-full
              bg-pink-500/10
            "
          >
            <CheckCircle2
              size={48}
              className="text-pink-500 sm:size-[56px] md:size-[60px]"
            />
          </div>

          <p className="section-eyebrow mt-6 sm:mt-8 md:mt-10">
            Encomenda Confirmada
          </p>

          <h1 className="section-title mt-3 sm:mt-4">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Obrigado pela tua compra!
            </span>
          </h1>

          <p className="mx-auto mt-4 sm:mt-6 md:mt-8 max-w-2xl text-sm sm:text-base md:text-lg leading-6 sm:leading-7 md:leading-8 text-zinc-600">
            Recebemos a tua encomenda com sucesso.
            Dentro de alguns minutos irás receber um
            email de confirmação com todos os detalhes.
          </p>

          {/* ✅ PAGAMENTO MB WAY */}
          {isMBWay && (
            <div className="mt-8 rounded-2xl border border-pink-200 bg-pink-50 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Smartphone size={24} className="shrink-0 text-pink-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-zinc-900">
                    Notificação MB Way enviada!
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Confirma o pagamento na notificação do teu telemóvel para finalizar a encomenda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ PAGAMENTO MULTIBANCO */}
          {isMultibanco && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Landmark size={24} className="shrink-0 text-pink-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-zinc-900">
                    Pagamento Multibanco
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Usa a referência abaixo para pagares num multibanco ou homebanking.
                  </p>
                </div>
              </div>

              {/* REFERÊNCIA MULTIBANCO */}
              <div className="mt-4 rounded-xl border-2 border-dashed border-pink-300 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Referência Multibanco
                    </p>
                    <p className="mt-1 text-2xl font-bold text-pink-500 tracking-wider">
                      {multibancoReference}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(multibancoReference);
                    }}
                    className="shrink-0 rounded-xl bg-pink-500 p-2.5 text-white transition hover:bg-pink-600 cursor-pointer"
                    aria-label="Copiar referência"
                  >
                    <Copy size={18} />
                  </button>
                </div>
                <div className="mt-3 text-left">
                  <p className="text-xs text-zinc-600">
                    Valor: <span className="font-bold text-zinc-900">€{Number(order.total).toFixed(2)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    Validade: 48 horas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DETALHES */}
          <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-pink-100 bg-pink-50/50 p-5 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-sm text-zinc-500 sm:text-base">Nº da Encomenda</span>
              <span className="font-semibold text-zinc-900 text-sm sm:text-base">
                #{order.orderNumber}
              </span>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-sm text-zinc-500 sm:text-base">Estado</span>
              <span className="inline-flex w-fit sm:w-auto rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-emerald-600">
                Confirmada
              </span>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-sm text-zinc-500 sm:text-base">Método de Pagamento</span>
              <span className="text-zinc-900 text-sm sm:text-base">{paymentMethodLabel}</span>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-sm text-zinc-500 sm:text-base">Total</span>
              <span className="text-xl sm:text-2xl font-bold text-pink-500">
                €{Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* PRODUTOS DA ENCOMENDA */}
          <div className="mt-6 sm:mt-8 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 sm:text-base">
              Produtos ({order.items.length})
            </h2>

            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:px-4 sm:py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-medium text-zinc-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.quantity}x €{Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs sm:text-sm font-semibold text-zinc-900">
                    €{Number(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/account/orders"
              className="
                inline-flex
                h-12
                sm:h-14
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-pink-500
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                cursor-pointer
                hover:scale-[1.02]
                hover:bg-pink-600
              "
            >
              <Package size={18} />
              Ver Encomenda
            </Link>

            <Link
              href="/product"
              className="
                inline-flex
                h-12
                sm:h-14
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-pink-500
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                cursor-pointer
                hover:scale-[1.02]
                hover:bg-pink-600
              "
            >
              Continuar Compras
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}