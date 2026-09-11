import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getFeaturedCategories } from "@/actions/categories/get-featured-categories";
import { CategoryCard } from "../categories/CategoryCard";

// Tipo para categorias com subcategory opcional
type CategoryWithSubcategory = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  subcategory?: string;
};

// Categorias fixas (estilo Vibrolandia)
const fixedCategories: CategoryWithSubcategory[] = [
  {
    id: "vibradores",
    slug: "sex-toys",
    name: "Vibradores",
    description: null,
    image: "/images/categorias/vibrador.png",
    subcategory: "vibradores",
  },
  {
    id: "lingeries",
    slug: "roupa",
    name: "Lingerie",
    description: null,
    image: "/images/categorias/lingerie.png",
    subcategory: "lingerie-sexy",
  },
  {
    id: "bdsm",
    slug: "bdsm",
    name: "BDSM",
    description: null,
    image: "/images/categorias/bdsm.png",
    subcategory: "bondage",
  },
  {
    id: "lubrificantes",
    slug: "essenciais",
    name: "Lubrificantes",
    description: null,
    image: "/images/categorias/lubrificante.png",
    subcategory: "lubrificantes",
  },
];

export async function CategoriesGrid() {
  const categories = await getFeaturedCategories();

  const allCategories: CategoryWithSubcategory[] = [
    ...fixedCategories,
    ...categories
      .filter(
        (cat) => !fixedCategories.some((fixed) => fixed.slug === cat.slug)
      )
      .map((cat) => ({
        ...cat,
        subcategory: undefined,
      })),
  ];

  if (allCategories.length === 0) {
    return null;
  }

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom">
        {/* Cabeçalho da secção - ALINHADO À ESQUERDA */}
        <div className="pt-10 mb-8 sm:pt-16 sm:mb-16 text-left">
          <p className="section-eyebrow">Explora por categoria</p>

          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #f3ccd8 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Uma experiência para
              <br />
              cada momento
            </span>
          </h2>
        </div>

        {/* Grelha de categorias - 2 mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {allCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              slug={category.slug}
              name={category.name}
              description={category.description}
              image={category.image}
              subcategory={category.subcategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}