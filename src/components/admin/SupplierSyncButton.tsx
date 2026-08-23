"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SupplierSyncButtonProps {
  supplierId: string;
}

export function SupplierSyncButton({
  supplierId,
}: SupplierSyncButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/suppliers/${supplierId}/sync`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();

      let data: {
        success?: boolean;
        message?: string;
      };

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Resposta recebida:", text);

        throw new Error(
          `Endpoint de sincronização devolveu ${response.status} ${response.statusText}, não JSON.`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ?? "Erro ao iniciar sincronização."
        );
      }

      router.push(`/admin/suppliers/${supplierId}/sync`);
    } catch (error) {
      console.error("Erro no sync:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao sincronizar fornecedor."
      );

      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={loading}
      className="
        inline-flex items-center justify-center
        h-8 px-4 text-xs font-semibold rounded-lg
        transition-all duration-200 cursor-pointer
        bg-pink-500 text-white
        hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {loading ? "A sincronizar..." : "Sincronizar"}
    </button>
  );
}