// Mapeamento das categorias do fornecedor para categorias principais (estilo Vibrolandia)
export const categoryMapping: Record<string, string> = {
  // Essenciais
  "Lubrificantes": "Essenciais",
  "DROGUERÍA": "Essenciais",
  "Con deliciosos Sabores": "Essenciais",
  "Potenciadores": "Essenciais",
  "Estimulantes": "Essenciais",
  "Afrodisíacos": "Essenciais",
  "Retardantes": "Essenciais",
  "Aumento do Pénis": "Essenciais",
  "Poppers": "Essenciais",

  // Vibradores
  "Vibradores": "Vibradores",
  "Dildos": "Vibradores",
  "Dildos Anales": "Vibradores",
  "Dildos Punto G": "Vibradores",
  "Dildos sin Vibración": "Vibradores",
  "Dildos para Arneses": "Vibradores",
  "Sugadores": "Vibradores",
  "Estimuladores de Clitóris": "Vibradores",
  "Pontos G": "Vibradores",
  "Bolas e Óvulos": "Vibradores",
  "Bolas Chinas": "Vibradores",

  // Acessórios
  "Sex Toys Anais": "Acessórios",
  "Bolas Anales": "Acessórios",
  "Bolas Básicas": "Acessórios",
  "Dilatadores para nuevo placer BDSM": "Acessórios",
  "Estimuladores": "Acessórios",
  "Acessórios": "Acessórios",

  // Para Ele
  "Masturbadores": "Para Ele",
  "Estimulantes para Ellos": "Para Ele",
  "Anéis Penianos": "Para Ele",
  "Masturbadores Manuais": "Para Ele",
  "Masturbadores Elétricos": "Para Ele",

  // Para Ela
  "Estimulantes para Ellas": "Para Ela",
  "Vibradores para Ela": "Para Ela",
  "Sugadores para Ela": "Para Ela",

  // BDSM
  "Bondage": "BDSM",
  "Esposas": "BDSM",
  "Collares": "BDSM",
  "BDSM": "BDSM",

  // Roupa
  "Lingerie": "Roupa",
  "Bikinis": "Roupa",
  "Bodystocking": "Roupa",
  "Camisetas Masculinas": "Roupa",
  "Roupa Erótica": "Roupa",

  // CBD
  "CBD Sex": "CBD",
  "Vapes": "CBD",
  "Joints": "CBD",
  "Flores": "CBD",
};

// Categorias principais (as que aparecem no menu)
export const mainCategories = [
  { slug: "vibradores", label: "Vibradores", icon: "⚡" },
  { slug: "para-ele", label: "Para Ele", icon: "👤" },
  { slug: "para-ela", label: "Para Ela", icon: "👩" },
  { slug: "acessorios", label: "Acessórios", icon: "🔧" },
  { slug: "bdsm", label: "BDSM", icon: "⛓️" },
  { slug: "roupa", label: "Roupa", icon: "👗" },
  { slug: "essenciais", label: "Essenciais", icon: "🧴" },
  { slug: "cbd", label: "CBD", icon: "🌿" },
];

// Mapeamento inverso: categoria principal -> categorias do fornecedor
export function getSupplierCategories(mainCategorySlug: string): string[] {
  // Encontra o label da categoria principal pelo slug
  const mainCat = mainCategories.find(c => c.slug === mainCategorySlug);
  if (!mainCat) return [];

  // Retorna todas as categorias do fornecedor que mapeiam para esta categoria principal
  return Object.entries(categoryMapping)
    .filter(([_, main]) => main === mainCat.label)
    .map(([supplier]) => supplier);
}

// Obtém a categoria principal a partir de uma categoria do fornecedor
export function getMainCategory(supplierCategory: string): string | null {
  return categoryMapping[supplierCategory] || null;
}