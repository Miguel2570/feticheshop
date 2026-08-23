import { BillingForm } from "@/components/checkout/BillingForm";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { PaymentMethod } from "@/components/checkout/PaymentMethod";
import { ShippingMethod } from "@/components/checkout/ShippingMethod";

export default function CheckoutPage() {
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
            <PaymentMethod />
          </div>

          <CheckoutSummary />
        </div>
      </section>
    </main>
  );
}