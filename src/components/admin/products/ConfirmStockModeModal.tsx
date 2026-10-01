// components/admin/products/ConfirmStockModeModal.tsx
"use client";

import { useEffect } from "react";
import { X, Truck, Store, Shuffle, AlertTriangle, Loader2 } from "lucide-react";

type StockMode = "SUPPLIER" | "PHYSICAL" | "BOTH";

interface ConfirmStockModeModalProps {
  open: boolean;
  mode: StockMode | null;
  productCount: number;
  currentMode: StockMode | null;
  saving: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const MODE_CONFIG: Record<
  StockMode,
  { label: string; description: string; icon: typeof Truck; color: string }
> = {
  SUPPLIER: {
    label: "Fornecedor (dropshipping)",
    description:
      "O stock será lido diretamente do fornecedor (Dreamlove). O stock físico é ignorado.",
    icon: Truck,
    color: "text-pink-600 bg-pink-50 border-pink-200",
  },
  PHYSICAL: {
    label: "Loja (stock físico)",
    description:
      "O stock será gerido manualmente por ti. O stock do fornecedor é ignorado.",
    icon: Store,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  BOTH: {
    label: "Ambos",
    description:
      "O stock mostrado será a soma do stock físico + stock do fornecedor.",
    icon: Shuffle,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
};

export function ConfirmStockModeModal({
  open,
  mode,
  productCount,
  currentMode,
  saving,
  onConfirm,
  onClose,
}: ConfirmStockModeModalProps) {
  // Fechar com ESC
  useEffect(() => {
    if (!open || saving) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, saving, onClose]);

  if (!open || !mode) return null;

  const config = MODE_CONFIG[mode];
  const Icon = config.icon;
  const sameAsCurrent = currentMode === mode;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-zinc-900">
                Confirmar alteração em massa
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Esta ação vai afetar muitos produtos de uma vez.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-50 cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* CORPO */}
        <div className="space-y-4 p-5">
          {/* Modo escolhido */}
          <div className={`rounded-xl border-2 p-4 ${config.color}`}>
            <div className="flex items-center gap-3">
              <Icon size={24} />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                  Modo a aplicar
                </p>
                <p className="text-base font-bold">{config.label}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed opacity-90">
              {config.description}
            </p>
          </div>

          {/* Aviso de mudança */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-zinc-600">Produtos afetados:</span>
              <span className="text-xl font-bold text-zinc-900">
                {productCount.toLocaleString("pt-PT")}
              </span>
            </div>
            {currentMode && !sameAsCurrent && (
              <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-zinc-200 pt-2 text-xs">
                <span className="text-zinc-500">Modo atual dominante:</span>
                <span className="font-semibold text-zinc-700">
                  {MODE_CONFIG[currentMode].label}
                </span>
              </div>
            )}
          </div>

          {/* Aviso */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-medium text-amber-900">
              ⚠️ Esta ação é <strong>irreversível</strong>. Se quiseres
              reverter depois, terás de aplicar outro modo a todos os produtos
              novamente.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-11 rounded-xl border-2 border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-pink-500 px-6 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                A aplicar...
              </>
            ) : (
              "Sim, aplicar a todos"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}