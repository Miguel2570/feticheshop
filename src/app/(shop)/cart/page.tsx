"use client";

import { CartList } from "@/components/cart/CartList";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponForm } from "@/components/cart/CouponForm";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <main className="arabesque-bg relative overflow-hidden min-h-screen">
        <section className="container-custom py-20">
          <div className="mb-14">
            <p className="section-eyebrow">
              O teu carrinho
            </p>

            <h1 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Shopping Cart
              </span>
            </h1>
          </div>

          <div className="flex min-h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500" />
          </div>
        </section>
      </main>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mb-14">
          <p className="section-eyebrow">
            O teu carrinho
          </p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Shopping Cart
            </span>
          </h1>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-10 xl:grid-cols-[1fr_420px]">
            <CartList />

            <aside className="space-y-6">
              <CouponForm />

              <CartSummary />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}