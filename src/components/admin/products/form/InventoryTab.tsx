// InventoryTab.tsx
"use client";

interface InventoryTabProps {
  productId?: string;
}

export function InventoryTab({ productId }: InventoryTabProps) {
  if (!productId) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          Inventário
        </h2>
        <p className="text-zinc-500">
          Guarda o produto primeiro para gerir o inventário.
        </p>
        <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center">
          <p className="text-sm text-zinc-600">
            💡 Guarda o produto para começar a gerir o stock
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Inventário
      </h2>

      <p className="text-zinc-500">
        Gestão de stock.
      </p>

      {/* Aqui vão os teus campos de inventário */}
      <div className="rounded-xl border border-zinc-800 p-4">
        <p className="text-sm text-zinc-400">
          Product ID: {productId}
        </p>
        {/* Adiciona aqui o teu componente de inventário */}
      </div>
    </div>
  );
}