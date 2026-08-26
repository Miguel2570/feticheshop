"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { BillingForm } from "@/components/checkout/BillingForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { ShippingMethod } from "@/components/checkout/ShippingMethod";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"MBWAY" | "MULTIBANCO">("MBWAY");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Escutar evento de morada guardada
  useEffect(() => {
    const handleAddressSaved = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setAddressId(detail.id);
    };

    window.addEventListener("address-saved", handleAddressSaved);
    return () => window.removeEventListener("address-saved", handleAddressSaved);
  }, []);

  const handleCheckout = async () => {
    if (!addressId) {
      alert("⚠️ Guarda primeiro a tua morada.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          paymentMethod,
          notes: "",
          couponCode: "",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Erro ao processar checkout");
        return;
      }

      const order = await response.json();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mb-14">
          <p className="section-eyebrow">
            Finalizar compra
          </p>

          <h1 className="section-title mt-4">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Checkout
            </span>
          </h1>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <BillingForm />
            <ShippingMethod />
            <PaymentMethod onSelect={setPaymentMethod} />
          </div>

          <CheckoutSummary
            onCheckout={handleCheckout}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </main>
  );
}