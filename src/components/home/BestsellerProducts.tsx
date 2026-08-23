import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";

export async function BestSellers() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      isFeatured: true,
    },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      soldCount: "desc",
    },
    take: 5,
  });

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
            href="/products"
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

        {/* Grelha de produtos */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div className="
                overflow-hidden 
                rounded-2xl
                sm:rounded-3xl
                border
                border-pink-100
                bg-white
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-pink-200
                hover:shadow-[0_8px_30px_rgba(255,46,136,.10)]
              ">
                <div className="relative aspect-square overflow-hidden bg-pink-50/50">
                  <Image
                    src={
                      product.images[0]?.url ??
                      "/images/product-placeholder.png"
                    }
                    alt={product.name}
                    fill
                    className="object-contain p-4 sm:p-10 transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-3 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-900 line-clamp-2 group-hover:text-pink-500 transition-colors">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-lg sm:text-xl font-bold text-pink-500">
                    €{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link "Ver todos" para mobile */}
        <div className="mt-8 pb-10 flex justify-center lg:hidden">
          <Link
            href="/products"
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