"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, ShieldCheck } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Aurora Whisper",
    image: "/products/1.jpg",
    quantity: 1,
    price: 89.9,
  },
  {
    id: "2",
    name: "Rose Luxury",
    image: "/products/2.jpg",
    quantity: 2,
    price: 119.9,
  },
];

export function CheckoutSummary() {
  const subtotal = products.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );

  const shipping = 0;
  const discount = 20;
  const total = subtotal + shipping - discount;

  return (
    <aside className="h-fit rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm">
      <h2 className="font-display text-3xl" style={{ color: "#18181b" }}>
        Resumo da Encomenda
      </h2>

      {/* Produtos */}
      <div className="mt-8 space-y-5">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-zinc-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-medium" style={{ color: "#18181b" }}>
                {product.name}
              </h3>
              <p className="mt-1 text-sm" style={{ color: "#71717a" }}>
                Quantidade: {product.quantity}
              </p>
            </div>

            <p className="font-semibold" style={{ color: "#18181b" }}>
              €{(product.price * product.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Totais */}
      <div className="mt-10 space-y-5 border-t border-zinc-100 pt-8">
        <div className="flex justify-between">
          <span style={{ color: "#71717a" }}>Subtotal</span>
          <span style={{ color: "#18181b" }}>€{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span style={{ color: "#71717a" }}>Portes</span>
          <span className="font-medium" style={{ color: "#059669" }}>
            Grátis
          </span>
        </div>

        <div className="flex justify-between">
          <span style={{ color: "#71717a" }}>Desconto</span>
          <span className="font-medium text-pink-500">
            -€{discount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between border-t border-zinc-100 pt-6">
          <span className="text-xl font-semibold" style={{ color: "#18181b" }}>
            Total
          </span>
          <span className="text-4xl font-bold text-pink-500">
            €{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Botão */}
      <Link
        href="/checkout/success"
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
          duration-300
          cursor-pointer
          hover:scale-[1.02]
          hover:bg-pink-600
          hover:shadow-[0_0_40px_rgba(255,46,136,.35)]
        "
      >
        Finalizar Encomenda
        <ArrowRight size={20} />
      </Link>

      {/* Proteção */}
      <div className="mt-8 flex items-start gap-4 rounded-2xl bg-pink-50/50 p-5">
        <ShieldCheck size={24} className="mt-1 shrink-0 text-pink-500" />
        <div>
          <p className="font-medium" style={{ color: "#18181b" }}>
            Compra Protegida
          </p>
          <p className="mt-2 text-sm leading-7" style={{ color: "#71717a" }}>
            Todos os pagamentos são protegidos por
            encriptação SSL e os teus dados nunca são
            partilhados com terceiros.
          </p>
        </div>
      </div>
    </aside>
  );
}