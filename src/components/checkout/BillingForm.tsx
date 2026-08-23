"use client";

export function BillingForm() {
  const inputClass =
    "w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-zinc-400 hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

  return (
    <section className="rounded-[30px] border border-pink-100 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="font-display text-3xl" style={{ color: "#18181b" }}>
          Dados de Faturação
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#71717a" }}>
          Introduz os teus dados para finalizar a compra.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Primeiro Nome
          </label>
          <input
            type="text"
            placeholder="João"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Último Nome
          </label>
          <input
            type="text"
            placeholder="Silva"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="email@exemplo.pt"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Telemóvel
          </label>
          <input
            type="tel"
            placeholder="+351 912 345 678"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Morada
          </label>
          <input
            type="text"
            placeholder="Rua Exemplo nº 10"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Código Postal
          </label>
          <input
            type="text"
            placeholder="2400-000"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            Cidade
          </label>
          <input
            type="text"
            placeholder="Leiria"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            País
          </label>
          <select
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#18181b" }}
          >
            <option className="text-zinc-900">Portugal</option>
            <option className="text-zinc-900">Espanha</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" style={{ color: "#3f3f46" }}>
            NIF (Opcional)
          </label>
          <input
            type="text"
            placeholder="123456789"
            className={inputClass}
            style={{ color: "#18181b" }}
          />
        </div>
      </div>
    </section>
  );
}