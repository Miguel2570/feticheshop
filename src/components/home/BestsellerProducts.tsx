import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";

export async function BestSellers() {
  // Buscar produtos que venderam OU que têm avaliações
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { soldCount: { gt: 0 } },      // Já venderam
        { ratingCount: { gt: 0 } },    // Ou têm avaliações
      ],
    },
    include: {
      brand: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: [
      { soldCount: "desc" },        // 1º: mais vendidos
      { ratingCount: "desc" },      // 2º: mais avaliados
      { ratingAverage: "desc" },    // 3º: melhor rating
    ],
    take: 8,
  });

  // Se não houver produtos com vendas/avaliações, não mostra a secção
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom">
        {/* Cabeçalho da secção */}
        <div className="pt-10 mb-8 sm:pt-16 sm:mb-14 flex items-end justify-between">
          <div>
            <p className="section-eyebrow">
              Os favoritos da comunidade
            </p>

            <h2 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Mais Vendidos
              </span>
            </h2>
          </div>

          {/* Link "Ver todos" para desktop */}
          <Link
            href="/product?sort=best_sellers"
            className="
              hidden
              lg:flex
              items-center
              gap-2
              text-sm
              font-medium
              text-zinc-400
              hover:text-pink-500
            "
          >
            Ver todos
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Grelha de produtos - 4 colunas */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
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

        {/* Link "Ver todos" para mobile */}
        <div className="mt-8 pb-10 flex justify-center lg:hidden">
          <Link
            href="/product?sort=best_sellers"
            className="flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Ver todos
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}