"use client";

import { ProductCard } from "./ProductCard";

interface ProductGridItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  rating?: number;
  reviews?: number;

  brand: {
    name: string;
  };

  images: {
    url: string;
  }[];
}

interface ProductGridProps {
  products: ProductGridItem[];
}

export function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
          rounded-[28px]
          border
          border-dashed
          border-pink-200
          bg-white
          shadow-sm
        "
      >
        <p className="text-zinc-500">
          Nenhum produto encontrado.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          slug={product.slug}
          name={product.name}
          brand={product.brand.name}
          description={product.description}
          image={
            product.images[0]?.url ??
            "/images/product-placeholder.png"
          }
          price={product.price}
          oldPrice={
            product.compareAtPrice ?? undefined
          }
          rating={product.rating ?? 5}
          reviews={product.reviews ?? 0}
        />
      ))}
    </div>
  );
}