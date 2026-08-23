"use client";

import { useEffect, useState } from "react";

import { ProgressBar } from "./ProgressBar";
import { SyncStats } from "./SyncStats";
import { SyncLogs } from "./SyncLogs";
import { SyncHeader } from "./SyncHeader";
import { SyncTimeline } from "./SyncTimeline";
import { SyncBackground } from "./SyncBackground";
import { SyncFinished } from "./SyncFinished";
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
  const [updated, setUpdated] = useState(0);
  const [failed, setFailed] = useState(0);

  const [logs, setLogs] = useState<string[]>([]);

  const [elapsed, setElapsed] = useState("00:00");

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

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Iniciar sincronização + SSE
  useEffect(() => {
    let source: EventSource | null = null;

    async function startSync() {
      try {
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

          return;
        }

        source = new EventSource(
          "/api/supplier/sync"
        );

        source.onmessage = (event) => {
          try {
            const data = JSON.parse(
              event.data
            );

            switch (data.type) {
              case "progress":
                setProgress(
                  Number(data.progress) || 0
                );

                setCurrentStep(
                  data.step ??
                    "A sincronizar..."
                );

                break;

              case "count":
                setImported(
                  Number(data.imported) || 0
                );

                setUpdated(
                  Number(data.updated) || 0
                );

                setFailed(
                  Number(data.failed) || 0
                );

                break;

              case "log":
                setLogs((prev) => [
                  ...prev,
                  data.message,
                ]);

                break;

              case "done":
                setFinished(true);
                setProgress(100);

                setCurrentStep(
                  "Sincronização concluída."
                );

                source?.close();

                break;

              case "error":
                setLogs((prev) => [
                  ...prev,
                  `❌ ${data.message}`,
                ]);

                break;

              default:
                break;
            }
          } catch {
            setLogs((prev) => [
              ...prev,
              event.data,
            ]);
          }
        };

        source.onerror = () => {
          setLogs((prev) => [
            ...prev,
            "Ligação perdida com o servidor.",
          ]);

          source?.close();
        };
      } catch (error) {
        setLogs((prev) => [
          ...prev,
          error instanceof Error
            ? `❌ ${error.message}`
            : "❌ Não foi possível iniciar a sincronização.",
        ]);
      }
    }

    startSync();

    return () => {
      source?.close();
    };
  }, [supplierId]);

  return (
    <div className="relative min-h-screen">
      <SyncBackground />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-10">
        <SyncHeader elapsed={elapsed} />

        <SyncAnimation
          active={!finished}
        />

        <ProgressBar
          progress={progress}
          currentStep={currentStep}
        />

        <SyncTimeline
          currentStep={currentStep}
        />

        <SyncStats
          imported={imported}
          updated={updated}
          failed={failed}
          elapsed={elapsed}
        />

        <SyncLogs logs={logs} />

        <SyncFinished
          finished={finished}
          imported={imported}
          updated={updated}
          failed={failed}
          elapsed={elapsed}
        />
      </div>
    </div>
  );
}