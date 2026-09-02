// FeaturedProducts.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "../product/ProductCard";
import { getFeaturedProducts } from "@/actions/products/get-featured-products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  // Limitar a 8 produtos (2 linhas de 4)
  const displayedProducts = products.slice(0, 8);

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom">
        {/* Cabeçalho da secção */}
        <div className="pt-10 mb-8 sm:pt-16 sm:mb-16 flex items-end justify-between">
          <div>
            <p className="section-eyebrow">
              Selecionados por especialistas
            </p>

            <h2 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Produtos em Destaque
              </span>
            </h2>
          </div>
        </div>

        {/* Grelha de produtos - 4 colunas no máximo */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              brand={product.brand?.name ?? ""}
              description={product.shortDescription ?? ""}
              image={
                product.images[0]?.url ??
                "/placeholder-product.png"
              }
              price={Number(product.price)}
              oldPrice={
                product.comparePrice
                  ? Number(product.comparePrice)
                  : undefined
              }
              badge={
                product.isNew
                  ? "Novo"
                  : product.isOnSale
                  ? "Promoção"
                  : undefined
              }
              rating={product.ratingAverage}
              reviews={product.ratingCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}