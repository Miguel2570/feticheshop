import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
  /** Slug da categoria principal (opcional) */
  category?: string;
  /** Slug da subcategoria (opcional) */
  subcategory?: string;
};

export function CategoryCard({
  slug,
  name,
  description,
  image,
  category,
  subcategory,
}: CategoryCardProps) {
  // Determinar o destino do link:
  // 1. Se houver category + subcategory → link com ambos
  // 2. Se houver apenas subcategory → link só com subcategory
  // 3. Senão → slug é a categoria principal
  const params = new URLSearchParams();

  if (category && subcategory) {
    params.set("category", category);
    params.set("subcategory", subcategory);
  } else if (subcategory) {
    params.set("subcategory", subcategory);
  } else {
    params.set("category", slug);
  }

  const href = `/product?${params.toString()}`;

  return (
    <Link
      href={href}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-pink-100
        bg-white
        h-[240px]
        sm:h-[300px]
        lg:h-[430px]
        shadow-sm
        transition-all
        duration-300
        hover:border-pink-200
        hover:shadow-lg
        hover:shadow-pink-500/10
      "
    >
      {/* Imagem de fundo */}
      <Image
        src={image || "/placeholder-category.jpg"}
        alt={name}
        fill
        unoptimized
        className="
          object-cover
          transition-transform
          duration-700
          group-hover:scale-105
        "
      />

      {/* Conteúdo textual */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        {description && (
          <p className="text-xs sm:text-sm text-zinc-300">
            {description}
          </p>
        )}

        <h3 className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl lg:text-3xl text-white drop-shadow-lg">
          {name}
        </h3>
      </div>
    </Link>
  );
}