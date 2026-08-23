"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";

export function CartSummary() {
  const { cart } = useCart();

  if (!cart) {
    return null;
  }

  const {
    subtotal,
    shipping,
    discount,
    total,
  } = cart.summary;

  return (
    <aside
      className="
        rounded-3xl
        border
        border-pink-100
        bg-white
        p-8
        shadow-sm
      "
    >
      <h2 className="font-display text-3xl text-zinc-900">
        Resumo
      </h2>

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600">
            Subtotal
          </span>

          <span className="font-semibold text-zinc-900">
            €{subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-600">
            Portes
          </span>

          <span className="font-semibold text-emerald-600">
            {shipping === 0
              ? "Grátis"
              : `€${shipping.toFixed(2)}`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-zinc-600">
              Desconto
            </span>

            <span className="font-semibold text-pink-500">
              -€{discount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-pink-100 pt-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xl font-semibold text-zinc-900">
              Total
            </span>

            <span className="text-3xl font-bold text-pink-500">
              €{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="
          mt-10
          inline-flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-pink-500
          text-sm
          font-semibold
          text-white
          transition-all
          hover:scale-[1.02]
          hover:bg-pink-600
          hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
        "
      >
        Finalizar Compra

        <ArrowRight size={18} />
      </Link>

      <Link
        href="/products"
        className="
          mt-4
          inline-flex
          h-12
          w-full
          items-center
          justify-center
          rounded-full
          border
          border-pink-200
          bg-white
          text-sm
          font-medium
          text-zinc-700
          transition-all
          hover:border-pink-300
          hover:bg-pink-50
          hover:text-pink-500
        "
      >
        Continuar Compras
      </Link>

      <div className="mt-10 rounded-2xl bg-pink-50/50 p-5">
        <p className="font-medium text-zinc-900">
          ✓ Envio Discreto
        </p>

        <p className="mt-2 text-sm leading-7 text-zinc-600">
          Todas as encomendas são
          enviadas em embalagens
          totalmente discretas sem
          qualquer referência ao conteúdo.
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-pink-50/50 p-5">
        <p className="font-medium text-zinc-900">
          ✓ Pagamento Seguro
        </p>

        <p className="mt-2 text-sm leading-7 text-zinc-600">
          Aceitamos MB Way,
          Multibanco, Cartão, PayPal e
          outros métodos de pagamento
          protegidos.
        </p>
      </div>
    </aside>
  );
}