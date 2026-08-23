import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image?: string | null;
};

// Mapeamento: slug visual → slug real da BD
const slugMapping: Record<string, string> = {
  "vibradores": "vibradores",
  "sugadores": "vibradores", // Sugadores → categoria Vibradores
  "lingeries": "roupa", // Lingeries → categoria Roupa
  "BDSM": "bdsm",
  "lubrificantes": "essenciais", // Lubrificantes → categoria Essenciais
};

export function CategoryCard({
  slug,
  name,
  description,
  image,
}: CategoryCardProps) {
  // Usa o slug mapeado ou o original
  const realSlug = slugMapping[slug] ?? slug.toLowerCase();

  return (
    <Link
      href={`/product?category=${realSlug}`}
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

      {/* Gradiente para contraste do texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      {/* Conteúdo textual */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        {description && (
          <p className="text-xs sm:text-sm text-zinc-300">
            {description}
          </p>
        )}

        <h3 className="mt-1 sm:mt-2 font-display text-lg sm:text-2xl lg:text-3xl text-white">
          {name}
        </h3>
      </div>
    </Link>
  );
}