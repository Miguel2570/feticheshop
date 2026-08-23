"use client";

import {
  CloudDownload,
  Database,
  Package,
  RefreshCw,
} from "lucide-react";

interface SyncAnimationProps {
  active: boolean;
}

export function SyncAnimation({ active }: SyncAnimationProps) {
  if (!active) return null;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative flex h-48 w-48 items-center justify-center">
        {/* Círculo exterior */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-pink-500 border-r-fuchsia-400" />

        {/* Círculo interior */}
        <div className="absolute inset-8 animate-pulse rounded-full bg-pink-500/10" />

        {/* Ícone principal */}
        <RefreshCw size={55} className="animate-spin text-pink-500" />

        {/* Ícones à volta */}
        <CloudDownload
          size={24}
          className="absolute left-2 top-16 animate-bounce text-pink-400"
        />
        <Database
          size={24}
          className="absolute right-3 top-10 animate-pulse text-fuchsia-400"
        />
        <Package
          size={24}
          className="absolute bottom-10 left-16 animate-bounce text-pink-300"
        />
      </div>
    </div>
  );
}