// src/components/account/VIPBadge.tsx

"use client";

import { Crown, Star, Gift } from "lucide-react";

interface VIPBadgeProps {
  level: string;
}

export function VIPBadge({ level }: VIPBadgeProps) {
  const config = {
    BRONZE: {
      icon: Star,
      label: "Bronze",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    SILVER: {
      icon: Gift,
      label: "Prata",
      color: "text-zinc-600",
      bg: "bg-zinc-50",
      border: "border-zinc-200",
    },
    GOLD: {
      icon: Crown,
      label: "Ouro",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },
  };

  const vip = config[level as keyof typeof config] || config.BRONZE;
  const Icon = vip.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${vip.border} ${vip.bg} px-3 py-1 text-xs font-semibold ${vip.color}`}
    >
      <Icon size={14} />
      {vip.label}
    </span>
  );
}