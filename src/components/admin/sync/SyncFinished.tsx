"use client";

import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface SyncFinishedProps {
  finished: boolean;
  imported: number;
  updated: number;
  failed: number;
  elapsed: string;
}

export function SyncFinished({
  finished,
  imported,
  updated,
  failed,
  elapsed,
}: SyncFinishedProps) {
  const router = useRouter();

  if (!finished) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold" style={{ color: "#18181b" }}>
        Sincronização concluída
      </h2>

      <p style={{ color: "#71717a", marginTop: "8px" }}>
        Todos os dados foram sincronizados com sucesso.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        <div>
          <p className="text-sm" style={{ color: "#71717a" }}>Importados</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#059669" }}>{imported}</p>
        </div>

        <div>
          <p className="text-sm" style={{ color: "#71717a" }}>Atualizados</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#ec4899" }}>{updated}</p>
        </div>

        <div>
          <p className="text-sm" style={{ color: "#71717a" }}>Erros</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#ef4444" }}>{failed}</p>
        </div>

        <div>
          <p className="text-sm" style={{ color: "#71717a" }}>Tempo</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#18181b" }}>{elapsed}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/admin/suppliers")}
        className="
          mt-10 inline-flex items-center justify-center gap-2
          h-11 px-6 text-sm font-semibold rounded-xl
          transition-all duration-200 cursor-pointer
          bg-pink-500 text-white
          hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
        "
      >
        <ArrowLeft size={18} />
        Voltar aos fornecedores
      </button>
    </div>
  );
}