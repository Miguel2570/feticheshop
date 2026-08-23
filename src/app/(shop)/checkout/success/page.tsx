import Link from "next/link";

import {
  ArrowRight,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[80vh] items-center justify-center py-20">
        <div
          className="
            w-full
            max-w-3xl
            rounded-[40px]
            border
            border-pink-100
            bg-white
            p-10
            text-center
            shadow-sm
            md:p-16
          "
        >
          <div
            className="
              mx-auto
              flex
              h-28
              w-28
              items-center
              justify-center
              rounded-full
              bg-pink-500/10
            "
          >
            <CheckCircle2
              size={60}
              className="text-pink-500"
            />
          </div>

          <p className="section-eyebrow mt-10">
            Encomenda Confirmada
          </p>

          <h1 className="section-title mt-4">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Obrigado pela tua compra!
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-600">
            Recebemos a tua encomenda com sucesso.
            Dentro de alguns minutos irás receber um
            email de confirmação com todos os detalhes.
          </p>

          {/* DETALHES */}
          <div className="mt-12 rounded-3xl border border-pink-100 bg-pink-50/50 p-8">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Nº da Encomenda</span>
              <span className="font-semibold text-zinc-900">
                #PS202600124
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-zinc-500">Estado</span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600">
                Confirmada
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-zinc-500">Método de Pagamento</span>
              <span className="text-zinc-900">MB Way</span>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-zinc-500">Total</span>
              <span className="text-2xl font-bold text-pink-500">
                €309.70
              </span>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/account/orders"
              className="
                inline-flex
                h-14
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
              <Package size={20} />
              Ver Encomenda
            </Link>

            <Link
              href="/product"
              className="
                inline-flex
                h-14
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
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}