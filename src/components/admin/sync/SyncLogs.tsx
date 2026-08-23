"use client";

import { useEffect, useRef } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";

interface SyncLogsProps {
  logs: string[];
}

export function SyncLogs({ logs }: SyncLogsProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-4">
        <h2 className="font-semibold" style={{ color: "#18181b" }}>
          Consola da Sincronização
        </h2>
      </div>

      <div className="h-[420px] overflow-y-auto p-5 font-mono text-sm">
        {logs.length === 0 && (
          <p style={{ color: "#71717a" }}>A aguardar eventos...</p>
        )}

        {logs.map((log, index) => {
          let Icon = Info;
          let color = "#52525b";

          if (log.includes("✔")) {
            Icon = CheckCircle2;
            color = "#059669";
          }

          if (log.includes("❌") || log.toLowerCase().includes("erro")) {
            Icon = AlertCircle;
            color = "#ef4444";
          }

          return (
            <div key={index} className="mb-2 flex items-start gap-3">
              <Icon size={16} style={{ color, marginTop: "2px" }} />
              <span style={{ color }}>{log}</span>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}