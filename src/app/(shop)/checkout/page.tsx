"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { BillingForm } from "@/components/checkout/BillingForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { ShippingMethod } from "@/components/checkout/ShippingMethod";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"MBWAY" | "MULTIBANCO">("MBWAY");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shippingCost, setShippingCost] = useState(0); // ✅ NOVO

  // ✅ Escutar evento de mudança de envio
  useEffect(() => {
    const handleShippingChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setShippingCost(detail.cost);
    };

    window.addEventListener("shipping-change", handleShippingChange);

    return () => {
      window.removeEventListener("shipping-change", handleShippingChange);
    };
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const closeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const handleAddressSaved = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAddressId(detail.id);
      showToast("success", "Morada guardada com sucesso!");
    };

    window.addEventListener("address-saved", handleAddressSaved);

    return () => {
      window.removeEventListener("address-saved", handleAddressSaved);
    };
  }, [showToast]);

  const checkoutProducts = items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    image: item.product.image || "/placeholder-product.png",
    quantity: item.quantity,
    price: item.product.price,
  }));

  const handleCheckout = async () => {
    if (!addressId) {
      showToast("error", "Guarda primeiro a tua morada.");
      return;
    }

    if (items.length === 0) {
      showToast("error", "O teu carrinho está vazio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId,
          paymentMethod,
          notes: "",
          couponCode: "",
          shipping: shippingCost, // ✅ ENVIAR CUSTO DE ENVIO
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        showToast("error", error.message || "Erro ao processar checkout");
        return;
      }

      const order = await response.json();
      showToast("success", "Encomenda criada com sucesso!");
      
      setTimeout(() => {
        router.push(`/checkout/success?orderId=${order.id}`);
      }, 800);
    } catch (error) {
      console.error("Erro:", error);
      showToast("error", "Erro ao processar checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="arabesque-bg relative min-h-screen overflow-hidden">
      {/* TOASTS */}
      <div className="fixed top-24 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3
              rounded-xl border
              px-4 py-3.5
              shadow-lg
              backdrop-blur-sm
              animate-in slide-in-from-top-2 fade-in-2
              ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-200"
                  : toast.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              }
            `}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
            ) : toast.type === "error" ? (
              <XCircle size={20} className="shrink-0 text-red-500" />
            ) : (
              <Info size={20} className="shrink-0 text-blue-500" />
            )}

            <p
              className={`
                flex-1 text-sm font-medium
                ${
                  toast.type === "success"
                    ? "text-emerald-700"
                    : toast.type === "error"
                    ? "text-red-700"
                    : "text-blue-700"
                }
              `}
            >
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => closeToast(toast.id)}
              className="shrink-0 rounded-full p-1 transition-colors cursor-pointer hover:bg-black/5"
              aria-label="Fechar"
            >
              <X size={16} className="text-zinc-400" />
            </button>
          </div>
        ))}
      </div>

      <section className="container-custom w-full py-8 sm:py-10 md:py-14 lg:py-20">
        <div className="mb-7 sm:mb-9 md:mb-12 lg:mb-14">
          <p className="section-eyebrow text-sm sm:text-base">
            Finalizar compra
          </p>

          <h1 className="section-title mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Checkout
            </span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-pink-100 bg-white p-6 sm:p-10 md:p-14 lg:p-20 text-center shadow-sm">
            <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
              Carrinho vazio
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Adiciona produtos ao carrinho antes de finalizar a compra.
            </p>

            <Link
              href="/product"
              className="mt-5 sm:mt-6 inline-flex h-10 sm:h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-pink-500 px-5 sm:px-6 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
            >
              Ver produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-10">
            <div className="min-w-0 space-y-5 sm:space-y-6 md:space-y-8">
              <BillingForm />
              <ShippingMethod />
              <PaymentMethod onSelect={setPaymentMethod} />
            </div>

            <aside className="min-w-0 lg:sticky lg:top-6">
              <CheckoutSummary
                onCheckout={handleCheckout}
                isSubmitting={isSubmitting}
                products={checkoutProducts}
                shipping={shippingCost}
                discount={0}
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}