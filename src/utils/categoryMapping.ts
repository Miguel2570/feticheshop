// Mapeamento das categorias do fornecedor para categorias principais
export const categoryMapping: Record<string, string> = {
  // Saúde e Bem-Estar
  "Lubrificantes": "Saúde e Bem-Estar",
  "DROGUERÍA": "Saúde e Bem-Estar",
  "Con deliciosos Sabores": "Saúde e Bem-Estar",
  "Potenciadores": "Saúde e Bem-Estar",
  "Estimulantes": "Saúde e Bem-Estar",
  "Afrodisíacos": "Saúde e Bem-Estar",
  "Retardantes": "Saúde e Bem-Estar",
  "Aumento do Pénis": "Saúde e Bem-Estar",
  "Poppers": "Saúde e Bem-Estar",

  // Sex Toys
  "Vibradores": "Sex Toys",
  "Dildos": "Sex Toys",
  "Dildos Anales": "Sex Toys",
  "Dildos Punto G": "Sex Toys",
  "Dildos sin Vibración": "Sex Toys",
  "Dildos para Arneses": "Sex Toys",
  "Sugadores": "Sex Toys",
  "Estimuladores de Clitóris": "Sex Toys",
  "Pontos G": "Sex Toys",
  "Bolas e Óvulos": "Sex Toys",
  "Bolas Chinas": "Sex Toys",
  "Sex Toys Anais": "Sex Toys",
  "Bolas Anales": "Sex Toys",
  "Bolas Básicas": "Sex Toys",
  "Dilatadores para nuevo placer BDSM": "Sex Toys",
  "Estimuladores": "Sex Toys",
  "Acessórios": "Sex Toys",

  // Para o Pénis
  "Masturbadores": "Para o Pénis",
  "Estimulantes para Ellos": "Para o Pénis",
  "Anéis Penianos": "Para o Pénis",
  "Masturbadores Manuais": "Para o Pénis",
  "Masturbadores Elétricos": "Para o Pénis",

  // BDSM
  "Bondage": "BDSM",
  "Esposas": "BDSM",
  "Collares": "BDSM",
  "BDSM": "BDSM",

  // Lingerie
  "Lingerie": "Lingerie",
  "Bikinis": "Lingerie",
  "Bodystocking": "Lingerie",
  "Camisetas Masculinas": "Lingerie",
  "Roupa Erótica": "Lingerie",
};

// Categorias principais (as que aparecem no menu)
export const mainCategories = [
  { slug: "sex-toys", label: "Sex Toys", icon: "⚡" },
  { slug: "para-ele", label: "Para o Pénis", icon: "👤" },
  { slug: "essenciais", label: "Saúde e Bem-Estar", icon: "🧴" },
  { slug: "roupa", label: "Lingerie", icon: "👗" },
  { slug: "bdsm", label: "BDSM", icon: "⛓️" },
];

export function getSupplierCategories(mainCategorySlug: string): string[] {
  const mainCat = mainCategories.find(c => c.slug === mainCategorySlug);
  if (!mainCat) return [];

  return Object.entries(categoryMapping)
    .filter(([_, main]) => main === mainCat.label)
    .map(([supplier]) => supplier);
}

export function getMainCategory(supplierCategory: string): string | null {
  return categoryMapping[supplierCategory] || null;
}