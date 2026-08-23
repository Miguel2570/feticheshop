"use client";

import { Loader2 } from "lucide-react";

interface ProgressBarProps {
  progress: number;
  currentStep: string;
}

export function ProgressBar({
  progress,
  currentStep,
}: ProgressBarProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest" style={{ color: "#71717a" }}>
            Estado atual
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            <span className="text-xl font-semibold" style={{ color: "#18181b" }}>
              {currentStep}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm" style={{ color: "#71717a" }}>
            Progresso
          </p>
          <p className="text-5xl font-bold text-pink-500">
            {progress}%
          </p>
        </div>
      </div>

      <div className="h-5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-400 to-pink-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 animate-pulse bg-white/20" />
        </div>
      </div>

      <div className="mt-4 flex justify-between text-xs" style={{ color: "#a1a1aa" }}>
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}