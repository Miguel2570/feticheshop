// lib/category-mapping.ts

export const mainCategorySlugs = [
  "sex-toys",
  "para-ele",
  "essenciais",
  "roupa",
  "bdsm",
];

// Mapeamento de keywords para categorias principais
// ORDEM IMPORTANTE: categorias mais específicas primeiro
export const categoryMappings: { slug: string; keywords: string[] }[] = [
  {
    slug: "bdsm",
    keywords: [
      "bondage", "esposas", "collar", "bdsm", "fetiche", "fetish",
      "dominación", "dominacao", "máscara", "mascara", "látigo", "latigo",
      "mordaza", "palas", "pinzas", "cuerdas", "jaula",
      "algema", "coleira", "chicote", "mordaça", "corda",
    ],
  },
  {
    slug: "para-ele",
    keywords: [
      "masturbador", "anel peniano", "anillo", "para el", "para ele",
      "hombre", "homem", "masculino", "pene", "peniano", "vagina",
      "prostático", "prostatico", "pénis", "penis",
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
      "jogo", "juegos", "juego", "game", "cartas", "dados",
    ],
  },
  {
    slug: "sex-toys",
    keywords: [
      "vibrador", "dildo", "sugador", "estimulador", "clitoris",
      "clitóris", "punto g", "ponto g", "vibración", "vibracao",
      "rabbit", "wand", "bullet", "huevo", "ovo", "balas vibradoras",
      "bolas", "dilatador", "plug", "anal", "arnés", "arnes",
      "funda", "extensor", "bomba", "succionador",
      "strap-on", "strap on",
    ],
  },
];

export function findMainCategory(text: string): string | null {
  const lower = text.toLowerCase();

  for (const mapping of categoryMappings) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      return mapping.slug;
    }
  }

  return null;
}

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