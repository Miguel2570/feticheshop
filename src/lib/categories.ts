// lib/categories.ts

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
// Subcategorias por categoria principal
// ═══════════════════════════════════════════════════════════════

export const SUBCATEGORIES: Record<string, Array<{ slug: string; name: string }>> = {
  brinquedos: [
    { slug: "aneis-para-o-penis", name: "Anéis para o pénis" },
    { slug: "bombas-para-o-penis", name: "Bombas para o pénis" },
    { slug: "bombas-vaginais", name: "Bombas vaginais" },
    { slug: "brinquedos-anais", name: "Brinquedos anais" },
    { slug: "dildos", name: "Dildos" },
    { slug: "estimuladores-da-prostata", name: "Estimuladores da próstata" },
    { slug: "estimuladores-vaginais-e-clitorianos", name: "Estimuladores vaginais e clitorianos" },
    { slug: "insuflaveis", name: "Insufláveis" },
    { slug: "masturbadores-masculinos", name: "Masturbadores masculinos" },
    { slug: "ovos-e-balas-vibratorias", name: "Ovos e balas vibratórias" },
    { slug: "strap-ons", name: "Strap-ons" },
    { slug: "vibradores", name: "Vibradores" },
  ],
  "saude-e-bem-estar": [
    { slug: "afrodisiacos", name: "Afrodisíacos" },
    { slug: "intensificadores-de-orgasmo", name: "Intensificadores de orgasmo" },
    { slug: "desenvolvimento-peniano", name: "Desenvolvimento peniano" },
    { slug: "locoes-corporais", name: "Loções corporais" },
    { slug: "higiene-intima", name: "Higiene íntima" },
    { slug: "lubrificantes", name: "Lubrificantes" },
    { slug: "oleos-cremes-e-velas-de-massagem", name: "Óleos, cremes e velas de massagem" },
    { slug: "perfumes", name: "Perfumes" },
    { slug: "prazer-oral", name: "Prazer oral" },
    { slug: "preservativos", name: "Preservativos" },
    { slug: "relaxantes-e-anestesiantes", name: "Relaxantes e anestesiantes" },
    { slug: "retardantes", name: "Retardantes" },
    { slug: "volumizadores-de-esperma", name: "Volumizadores de esperma" },
  ],
  "fetiche-bdsm": [
    { slug: "algemas-cordas-e-restricoes", name: "Algemas, cordas e restrições" },
    { slug: "vendas-mascaras-e-mordacas", name: "Vendas, máscaras e mordaças" },
    { slug: "chicotes-paddles-e-plumas", name: "Chicotes, paddles e plumas" },
    { slug: "coleiras-trelas-e-pincas", name: "Coleiras, trelas e pinças" },
    { slug: "kits-bdsm", name: "Kits BDSM" },
  ],
  "lingerie-feminina": [
    { slug: "conjuntos", name: "Conjuntos" },
    { slug: "bodys", name: "Bodys" },
    { slug: "babydolls", name: "Babydolls" },
    { slug: "camisas-de-noite-e-vestidos", name: "Camisas de noite e vestidos" },
    { slug: "catsuits-e-bodystockings", name: "Catsuits e bodystockings" },
    { slug: "cuecas", name: "Cuecas" },
    { slug: "meias-e-ligas", name: "Meias e ligas" },
    { slug: "arneses-femininos", name: "Arneses" },
  ],
  "lingerie-masculina": [
    { slug: "boxers-slips-tangas-e-strings", name: "Boxers, slips, tangas e strings" },
    { slug: "jockstraps", name: "Jockstraps" },
    { slug: "bodys-e-pecas-sensuais", name: "Bodys e peças sensuais" },
    { slug: "arneses-e-acessorios", name: "Arneses e acessórios" },
    { slug: "meias-masculinas", name: "Meias" },
    { slug: "fantasias", name: "Fantasias" },
  ],
  "jogos-e-diversao": [
    { slug: "jogos-eroticos", name: "Jogos eróticos" },
    { slug: "comestiveis", name: "Comestíveis" },
    { slug: "aventais-e-artigos-divertidos", name: "Aventais e artigos divertidos" },
    { slug: "pintura-corporal", name: "Pintura corporal" },
    { slug: "bonecas-e-insuflaveis", name: "Bonecas e insufláveis" },
  ],
};

// Lista completa de slugs ativos (raízes + subcategorias)
export const ALL_ACTIVE_SLUGS = [
  ...MAIN_CATEGORY_SLUGS,
  ...Object.values(SUBCATEGORIES).flat().map((c) => c.slug),
];

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

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

export function getSubcategories(mainSlug: string) {
  return SUBCATEGORIES[mainSlug] ?? [];
}

export function getMainCategoryName(slug: string) {
  return MAIN_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function getSubcategoryName(mainSlug: string, subSlug: string) {
  return (
    SUBCATEGORIES[mainSlug]?.find((c) => c.slug === subSlug)?.name ?? subSlug
  );
}