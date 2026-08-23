"use client";

import {
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";

interface SyncTimelineProps {
  currentStep: string;
}

const steps = [
  "Autenticação Dreamlove",
  "Categorias",
  "Marcas",
  "Produtos",
  "Imagens",
  "Stock",
  "Concluído",
];

export function SyncTimeline({ currentStep }: SyncTimelineProps) {
  const activeIndex = steps.findIndex((step) =>
    currentStep.toLowerCase().includes(step.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold" style={{ color: "#18181b" }}>
        Etapas
      </h2>

      <div className="space-y-5">
        {steps.map((step, index) => {
          const completed = index < activeIndex;
          const active = index === activeIndex;

          return (
            <div key={step} className="flex items-center gap-4">
              {completed ? (
                <CheckCircle2 className="h-6 w-6" style={{ color: "#059669" }} />
              ) : active ? (
                <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
              ) : (
                <Circle className="h-6 w-6" style={{ color: "#d4d4d8" }} />
              )}

              <span
                style={{
                  color: completed ? "#059669" : active ? "#ec4899" : "#71717a",
                  fontWeight: completed || active ? 500 : 400,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}