// lib/categories.ts

import { prisma } from "@/lib/prisma";

// ═══════════════════════════════════════════════════════════════
// Categorias principais (raízes)
// ═══════════════════════════════════════════════════════════════

export const MAIN_CATEGORIES = [
  { slug: "brinquedos", name: "Brinquedos" },
  { slug: "saude-e-bem-estar", name: "Saúde e Bem-Estar" },
  { slug: "fetiche-bdsm", name: "Fetiche & BDSM" },
  { slug: "lingerie-feminina", name: "Lingerie Feminina" },
  { slug: "lingerie-masculina", name: "Lingerie Masculina" },
  { slug: "jogos-e-diversao", name: "Jogos e Diversão" },
] as const;

export const MAIN_CATEGORY_SLUGS = MAIN_CATEGORIES.map((c) => c.slug);

// ═══════════════════════════════════════════════════════════════
// Categorias ativas — lê da BD
// ═══════════════════════════════════════════════════════════════

/**
 * Devolve todos os slugs de categorias ativas (raízes + subcategorias) da BD.
 * Substitui a antiga constante `ALL_ACTIVE_SLUGS`.
 */
export async function getAllActiveSlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    select: { slug: true },
  });

  return categories.map((c) => c.slug);
}

// ═══════════════════════════════════════════════════════════════
// Homepage — categorias em destaque
// ═══════════════════════════════════════════════════════════════

export const HOMEPAGE_CATEGORIES = [
  {
    slug: "vibradores",
    category: "brinquedos",
    name: "Vibradores",
    description: "Descobre o prazer",
    image: null,
  },
  {
    slug: "lingerie-feminina",
    category: "lingerie-feminina",
    name: "Lingerie Feminina",
    description: "Sente-te irresistível",
    image: null,
  },
  {
    slug: "fetiche-bdsm",
    category: "fetiche-bdsm",
    name: "Fetiche & BDSM",
    description: "Explora os teus limites",
    image: null,
  },
  {
    slug: "lubrificantes",
    category: "saude-e-bem-estar",
    name: "Lubrificantes",
    description: "Prazer sem limites",
    image: null,
  },
  {
    slug: "lingerie-masculina",
    category: "lingerie-masculina",
    name: "Lingerie Masculina",
    description: "Estilo e conforto",
    image: null,
  },
  {
    slug: "jogos-e-diversao",
    category: "jogos-e-diversao",
    name: "Jogos e Diversão",
    description: "Diversão a dois",
    image: null,
  },
];