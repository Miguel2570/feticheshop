"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  currentProductId: string;
  currentCategory?: string; // ← Adiciona a categoria do produto atual
  products: Product[];
}

export function RelatedProducts({
  currentProductId,
  currentCategory,
  products,
}: RelatedProductsProps) {
  // Se não houver produtos suficientes, não mostrar
  if (!products || products.length < 2) {
    return null;
  }

  // 1. Primeiro, filtra produtos da MESMA CATEGORIA (excluindo o atual)
  const sameCategoryProducts = products.filter(
    (product) =>
      product.id !== currentProductId &&
      product.category === currentCategory
  );

  // 2. Depois, filtra produtos de OUTRAS CATEGORIAS (excluindo o atual)
  const otherProducts = products.filter(
    (product) =>
      product.id !== currentProductId &&
      product.category !== currentCategory
  );

  // 3. Junta: primeiro os da mesma categoria, depois os outros
  const relatedProducts = [
    ...sameCategoryProducts,
    ...otherProducts,
  ].slice(0, 8); // Mostra até 8 produtos

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom py-16">
        <div className="mb-10 text-center">
          <p className="section-eyebrow text-sm font-medium uppercase tracking-wider text-brand-magenta">
            Também poderá gostar
          </p>

          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Produtos Relacionados
            </span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              brand={product.brand}
              description={product.description || ""}
              image={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/images/product-placeholder.png"
              }
              price={product.price}
              oldPrice={product.oldPrice}
              rating={product.rating || 0}
              reviews={product.reviews || 0}
              badge={
                product.oldPrice && product.oldPrice > product.price
                  ? "Promoção"
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}