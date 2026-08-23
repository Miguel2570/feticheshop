"use client";

import { useCart } from "./CartProvider";
import { CartItem } from "./CartItem";

export function CartList() {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div>
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
          rounded-3xl
          border
          border-pink-100
          bg-white
          px-8
          py-6
          shadow-sm
        "
      >
        <h2 className="text-2xl font-display text-zinc-900">
          Produtos
        </h2>

        <span className="text-zinc-500">
          {cart.summary.items}{" "}
          {cart.summary.items === 1 ? "item" : "itens"}
        </span>
      </div>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}