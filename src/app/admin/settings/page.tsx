import { prisma } from "@/lib/prisma";

import { GeneralSettingsForm } from "@/components/admin/settings/GeneralSettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();

  const getSetting = (key: string, defaultValue: unknown) => {
    return settings.find((s) => s.key === key)?.value ?? defaultValue;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Definições
        </h1>
        <p style={{ color: "#71717a" }}>
          Configuração geral da loja.
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-5">
          <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
            Configurações Gerais
          </h2>
        </div>

        <div className="p-5">
          <GeneralSettingsForm
            storeName={getSetting("store_name", "") as string}
            storeEmail={getSetting("store_email", "") as string}
            storePhone={getSetting("store_phone", "") as string}
            storeAddress={getSetting("store_address", "") as string}
            vat={getSetting("vat", 23) as number}
            currency={getSetting("currency", "EUR") as string}
            freeShipping={getSetting("free_shipping", 0) as number}
            shippingPrice={getSetting("shipping_price", 0) as number}
          />
        </div>
      </div>
    </div>
  );
}