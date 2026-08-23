// lib/category-mapping.ts

export const mainCategorySlugs = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
];

// Mapeamento de keywords para categorias principais
// ORDEM IMPORTANTE: categorias mais específicas primeiro
export const categoryMappings: { slug: string; keywords: string[] }[] = [
  {
    slug: "cbd",
    keywords: [
      "cbd", "vape", "joint", "flor", "flores", "cannabis", "hemp",
      "vapeador", "vapeadores",
    ],
  },
  {
    slug: "bdsm",
    keywords: [
      "bondage", "esposas", "collar", "bdsm", "fetiche", "fetish",
      "dominación", "dominacao", "máscara", "mascara", "látigo", "latigo",
      "mordaza", "palas", "pinzas", "cuerdas", "jaula",
    ],
  },
  {
    slug: "para-ele",
    keywords: [
      "masturbador", "anel peniano", "anillo", "para el", "para ele",
      "hombre", "homem", "masculino", "pene", "peniano", "vagina",
      "prostático", "prostatico",
    ],
  },
  {
    slug: "para-ela",
    keywords: [
      "para ella", "para ela", "mujer", "mulher", "femenino", "feminino",
    ],
  },
  {
    slug: "roupa",
    keywords: [
      "lingerie", "bikini", "bodystocking", "camiseta", "camisola",
      "roupa", "roba", "conjunto", "babydoll", "corset", "liguero",
      "medias", "tanga", "body", "bañador", "disfraz", "camisón",
      "camison", "sujetador", "braga", "calcinha",
    ],
  },
  {
    slug: "essenciais",
    keywords: [
      "lubricante", "lubrificante", "afrodisíaco", "afrodisiaco",
      "estimulante", "retardante", "potenciador", "aceite", "óleo",
      "oleo", "vela", "gel", "perfume", "crema", "masaje", "massagem",
      "limpieza", "limpeza", "cápsula", "capsula", "gotas",
    ],
  },
  {
    slug: "acessorios",
    keywords: [
      "bolas", "dilatador", "acessório", "accesorio", "acessórios",
      "plug", "anal", "arnés", "arnes", "funda", "extensor", "bomba",
      "succionador",
    ],
  },
  {
    slug: "vibradores",
    keywords: [
      "vibrador", "dildo", "sugador", "estimulador", "clitoris",
      "clitóris", "punto g", "ponto g", "vibración", "vibracao",
      "rabbit", "wand", "bullet", "huevo", "ovo", "balas vibradoras",
    ],
  },
];

export function findMainCategory(text: string): string | null {
  const lower = text.toLowerCase();

  // Primeiro tenta correspondências exatas (maior prioridade)
  for (const mapping of categoryMappings) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      return mapping.slug;
    }
  }

  return null;
}

// Função para encontrar TODAS as categorias correspondentes (para debug)
export function findAllMatchingCategories(text: string): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];

  for (const mapping of categoryMappings) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      matches.push(mapping.slug);
    }
  }

  return matches;
}

// Função para debug: mostra que keywords corresponderam
export function debugCategoryMatch(text: string): {
  category: string | null;
  matchedKeywords: string[];
  allMatches: string[];
} {
  const lower = text.toLowerCase();
  const allMatches: string[] = [];
  const matchedKeywords: string[] = [];

  for (const mapping of categoryMappings) {
    const matched = mapping.keywords.filter((kw) =>
      lower.includes(kw)
    );

    if (matched.length > 0) {
      allMatches.push(mapping.slug);
      matchedKeywords.push(...matched);
    }
  }

  return {
    category: allMatches[0] ?? null,
    matchedKeywords,
    allMatches,
  };
}