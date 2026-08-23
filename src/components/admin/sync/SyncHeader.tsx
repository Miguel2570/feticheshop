"use client";

import { PackageCheck } from "lucide-react";

interface SyncHeaderProps {
  elapsed: string;
}

export function SyncHeader({ elapsed }: SyncHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500">
            <PackageCheck className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
              Sincronização Dreamlove
            </h1>
            <p style={{ color: "#71717a" }}>
              Importação em tempo real de categorias, marcas, produtos, imagens e stock.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-right shadow-sm">
        <p className="text-xs uppercase tracking-widest" style={{ color: "#71717a" }}>
          Tempo decorrido
        </p>
        <p className="mt-1 text-3xl font-bold" style={{ color: "#18181b" }}>
          {elapsed}
        </p>
      </div>
    </div>
  );
}