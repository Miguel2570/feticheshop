"use client";

import { Bell, Check, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface Props {
  productId: string;
  onClose?: () => void;
  compact?: boolean;
}

export function NotifyWhenAvailable({
  productId,
  onClose,
  compact = false,
}: Props) {
  const { data: session, isPending } = authClient.useSession();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const userEmail = session?.user?.email ?? null;

  // ✅ Guardar onClose numa ref para não re-disparar o effect
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // ✅ Flag para garantir que o toast dispara só UMA vez
  const hasToastedRef = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (userEmail) return;
    if (hasToastedRef.current) return;

    hasToastedRef.current = true;

    toast.error("Inicia sessão para seres avisado", {
      description: "Precisas de estar logado para receber notificações.",
      duration: 4000,
    });

    onCloseRef.current?.();
  }, [isPending, userEmail]); // ← sem onClose nas deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || !userEmail) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/stock-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        toast.success(
          data.message || "Vamos avisar-te quando estiver disponível!",
          {
            description: `Avisamos-te em ${userEmail}`,
          }
        );
        setTimeout(() => {
          onCloseRef.current?.();
        }, 1200);
      } else {
        setStatus("idle");
        toast.error(data.message || "Erro ao registar. Tenta novamente.");
      }
    } catch {
      setStatus("idle");
      toast.error("Erro de conexão. Tenta novamente.");
    }
  };

  if (isPending) {
    return (
      <div
        className={
          compact
            ? "flex items-center justify-center gap-1.5 rounded-full border-2 border-pink-400 bg-pink-50/50 px-3 py-2"
            : "mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-pink-400 bg-pink-50/50 px-3 py-3"
        }
      >
        <Loader2
          size={compact ? 12 : 14}
          className="animate-spin text-pink-500"
        />
        <span
          className={
            compact
              ? "text-xs font-medium text-pink-600"
              : "text-sm font-medium text-pink-600"
          }
        >
          A verificar sessão...
        </span>
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  if (status === "success") {
    return (
      <div
        className={
          compact
            ? "flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
            : "mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700"
        }
      >
        <Check size={compact ? 12 : 16} className="shrink-0" />
        <span className="truncate">Registado!</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex items-center gap-1.5 rounded-full border-2 border-pink-400 bg-pink-50/50 p-1.5"
          : "mt-3 flex items-center gap-2 rounded-xl border-2 border-pink-400 bg-pink-50/50 p-3"
      }
    >
      <Bell size={compact ? 12 : 16} className="shrink-0 text-pink-500" />

      <span
        className={
          compact
            ? "min-w-0 flex-1 truncate text-xs text-zinc-600"
            : "min-w-0 flex-1 truncate text-sm text-zinc-600"
        }
        title={userEmail}
      >
        {userEmail}
      </span>

      <button
        type="submit"
        disabled={status === "loading"}
        className={
          compact
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500 text-white transition hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            : "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        }
        aria-label="Avisar-me"
      >
        {status === "loading" ? (
          <Loader2 size={compact ? 12 : 14} className="animate-spin" />
        ) : compact ? (
          <Check size={12} />
        ) : (
          <>
            <Bell size={14} />
            Avisar-me
          </>
        )}
      </button>

      {compact && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white hover:text-zinc-700 cursor-pointer"
          aria-label="Cancelar"
        >
          <X size={12} />
        </button>
      )}
    </form>
  );
}