import { Prisma } from "@prisma/client";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 24;

type Props = {
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
};

export default async function SaleProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const sort = params.sort ?? "newest";

  const page = Math.max(
    1,
    Number(params.page ?? "1")
  );

  /*
   * =========================
   * FILTROS
   * =========================
   */

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    isOnSale: true,
  };

  /*
   * =========================
   * TOTAL
   * =========================
   */

  const total = await prisma.product.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  /*
   * =========================
   * PRODUTOS
   * =========================
   */

  const products =
    await prisma.product.findMany({
      where,

      skip:
        (currentPage - 1) *
        PAGE_SIZE,

      take: PAGE_SIZE,

      orderBy:
        sort === "price_asc"
          ? {
              price: "asc",
            }
          : sort === "price_desc"
          ? {
              price: "desc",
            }
          : sort === "best_sellers"
          ? {
              soldCount: "desc",
            }
          : {
              createdAt: "desc",
            },

      include: {
        brand: true,

        images: {
          where: {
            isPrimary: true,
          },

          take: 1,
        },
      },
    });

  /*
   * =========================
   * PAGINAÇÃO
   * =========================
   */

  const createPageUrl = (
    targetPage: number
  ) => {
    const query = new URLSearchParams();

    if (sort) {
      query.set("sort", sort);
    }

    query.set(
      "page",
      String(targetPage)
    );

    return `/sale?${query.toString()}`;
  };

  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <div className="container-custom py-16">
        {/* HEADER */}

        <div className="mb-10">

          <h1 className="section-title">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Grandes Promoções
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-600">
            Aproveita os nossos produtos em
            promoção por tempo limitado.
          </p>
        </div>

        {/* TOOLBAR */}

        <div className="
          mb-8
          flex
          flex-col
          gap-4
          border-b
          border-pink-100
          pb-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <p className="text-sm text-zinc-600">
            {total}{" "}
            {total === 1
              ? "produto em promoção"
              : "produtos em promoção"}
          </p>

          <form method="GET">

            <label
              htmlFor="sort"
              className="sr-only"
            >
              Ordenar produtos
            </label>

            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="
                min-w-48
                rounded-xl
                border
                border-pink-200
                bg-white
                px-4
                py-2.5
                text-sm
                text-zinc-900
                outline-none
                transition
                cursor-pointer
                hover:border-pink-300
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
              "
            >
              <option value="newest" className="bg-white text-zinc-900">
                Mais recentes
              </option>

              <option value="price_asc" className="bg-white text-zinc-900">
                Preço crescente
              </option>

              <option value="price_desc" className="bg-white text-zinc-900">
                Preço decrescente
              </option>

              <option value="best_sellers" className="bg-white text-zinc-900">
                Mais vendidos
              </option>
            </select>

          </form>

        </div>

        {/* PRODUTOS */}

        {products.length === 0 ? (

          <div className="
            rounded-3xl
            border
            border-pink-100
            bg-white/70
            px-6
            py-20
            text-center
            shadow-sm
          ">

            <h2 className="text-xl font-semibold text-zinc-900">
              Neste momento não existem
              promoções
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Consulta os nossos produtos
              para descobrires toda a coleção.
            </p>

            <div className="mt-6">

              <Button asChild>
                <Link href="/product">
                  Ver todos os produtos
                </Link>
              </Button>

            </div>

          </div>

        ) : (

          <div className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          ">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                brand={
                  product.brand?.name ?? ""
                }
                description={
                  product.shortDescription ?? ""
                }
                image={
                  product.images[0]?.url ??
                  "/placeholder-product.png"
                }
                price={Number(product.price)}
                oldPrice={
                  product.comparePrice
                    ? Number(
                        product.comparePrice
                      )
                    : undefined
                }
                badge="Promoção"
                rating={
                  product.ratingAverage
                }
                reviews={
                  product.ratingCount
                }
              />

            ))}

          </div>

        )}

        {/* PAGINAÇÃO */}

        {totalPages > 1 && (

          <div className="
            mt-12
            flex
            flex-wrap
            items-center
            justify-center
            gap-2
          ">

            {/* ANTERIOR */}

            {currentPage > 1 && (

              <Link
                href={createPageUrl(
                  currentPage - 1
                )}
              >

                <Button variant="outline">
                  Anterior
                </Button>

              </Link>

            )}

            {/* PÁGINAS */}

            {Array.from({
              length: totalPages,
            }).map((_, index) => {

              const pageNumber =
                index + 1;

              return (

                <Link
                  key={pageNumber}
                  href={createPageUrl(
                    pageNumber
                  )}
                >

                  <Button
                    variant={
                      pageNumber ===
                      currentPage
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {pageNumber}
                  </Button>

                </Link>

              );
            })}

            {/* SEGUINTE */}

            {currentPage <
              totalPages && (

              <Link
                href={createPageUrl(
                  currentPage + 1
                )}
              >

                <Button>
                  Seguinte
                </Button>

              </Link>

            )}

          </div>

        )}
      </div>
    </main>
  );
}