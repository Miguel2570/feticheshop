// src/lib/vip.ts

import { VIPLevel } from "@prisma/client";

export const VIP_LEVELS = {
  BRONZE: {
    name: "Bronze",
    minSpent: 0,
    maxSpent: 250,
    discount: 0,
    benefits: [
      "Acesso a promoções regulares",
      "Pontos em todas as compras",
    ],
  },
  SILVER: {
    name: "Prata",
    minSpent: 250,
    maxSpent: 750,
    discount: 5,
    benefits: [
      "5% de desconto em produtos selecionados",
      "Brinde especial em compras acima de 50€",
      "Acesso antecipado a novidades",
    ],
  },
  GOLD: {
    name: "Ouro",
    minSpent: 750,
    maxSpent: Infinity,
    discount: 10,
    benefits: [
      "10% de desconto em produtos selecionados",
      "Brinde premium em todas as compras",
      "Acesso exclusivo a ofertas VIP",
      "Envio prioritário",
    ],
  },
};

export function getVIPLevel(totalSpent: number): VIPLevel {
  if (totalSpent >= 750) return VIPLevel.GOLD;
  if (totalSpent >= 250) return VIPLevel.SILVER;
  return VIPLevel.BRONZE;
}

export function getVIPBenefits(level: VIPLevel): string[] {
  return VIP_LEVELS[level]?.benefits ?? [];
}

export function getVIPDiscount(level: VIPLevel): number {
  return VIP_LEVELS[level]?.discount ?? 0;
}

export function getVIPName(level: VIPLevel): string {
  return VIP_LEVELS[level]?.name ?? "Bronze";
}