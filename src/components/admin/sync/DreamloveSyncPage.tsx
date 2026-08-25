"use client";

import {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { ProgressBar } from "./ProgressBar";
import { SyncLogs } from "./SyncLogs";
import { SyncHeader } from "./SyncHeader";
import { SyncBackground } from "./SyncBackground";
import { SyncAnimation } from "./SyncAnimation";

type DreamloveSyncPageProps = {
  supplierId: string;
};

export function DreamloveSyncPage({
  supplierId,
}: DreamloveSyncPageProps) {
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(
    "A preparar sincronização..."
  );
  const [imported, setImported] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState("00:00");

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);
  const lastMessageRef = useRef("");

  // Cronómetro
  useEffect(() => {
    const start = Date.now();

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - start) / 1000
      );

      const mins = String(
        Math.floor(seconds / 60)
      ).padStart(2, "0");

      const secs = String(
        seconds % 60
      ).padStart(2, "0");

      setElapsed(`${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Iniciar sincronização (apenas uma vez)
  const startSync = useCallback(async () => {
    if (hasStartedRef.current) return;

    hasStartedRef.current = true;

    try {
      setLogs((prev) => [
        ...prev,
        "🚀 A iniciar sincronização...",
      ]);

      const response = await fetch(
        "/api/supplier/start-sync",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setLogs((prev) => [
          ...prev,
          `❌ ${result.message}`,
        ]);

        setFinished(true);
        return;
      }

      setLogs((prev) => [
        ...prev,
        `✅ ${result.message}`,
      ]);
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Erro ao iniciar",
      ]);

      setFinished(true);
    }
  }, [supplierId]);

  // Polling
  useEffect(() => {
    startSync();

    pollRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/supplier/sync?supplierId=${supplierId}`
        );

        if (!response.ok) return;

        const data = await response.json();

        if (
          data.status === "RUNNING" ||
          data.status === "IDLE"
        ) {
          const totalInDb =
            data.totalProducts || 0;

          const importedCount =
            totalInDb > 0
              ? totalInDb
              : data.imported || 0;

          setProgress(data.progress ?? 0);

          setCurrentStep(
            data.message ?? "A sincronizar..."
          );

          setImported(importedCount);
        } else if (data.status === "SUCCESS") {
          setFinished(true);
          setProgress(100);

          setCurrentStep(
            "Sincronização concluída."
          );

          setImported(data.imported ?? 0);

          setLogs((prev) => [
            ...prev,
            "✅ Sincronização concluída com sucesso.",
          ]);

          if (pollRef.current) {
            clearInterval(pollRef.current);
          }
        } else if (data.status === "FAILED") {
          setFinished(true);

          setCurrentStep(
            "Sincronização falhou."
          );

          setLogs((prev) => [
            ...prev,
            `❌ ${data.message ?? "Erro"}`,
          ]);

          if (pollRef.current) {
            clearInterval(pollRef.current);
          }
        }

        if (
          data.message &&
          data.message !== lastMessageRef.current
        ) {
          lastMessageRef.current =
            data.message;

          setLogs((prev) => [
            ...prev,
            `📊 ${data.message}`,
          ]);
        }
      } catch {
        // Silencioso
      }
    }, 1000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [supplierId, startSync]);

  return (
    <div className="relative min-h-screen">
      <SyncBackground />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-8">
        <SyncHeader elapsed={elapsed} />

        <SyncAnimation active={!finished} />

        <ProgressBar
          progress={progress}
          currentStep={currentStep}
        />

        <SyncLogs logs={logs} />

        {finished && (
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              ✅ Sincronização Concluída!
            </p>

            <p className="mt-2 text-emerald-700">
              {imported} produtos na base de dados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}