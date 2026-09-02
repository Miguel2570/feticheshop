import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";
import { ProductToolbar } from "@/components/admin/products/ProductToolbar";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { ProductsMobile } from "@/components/admin/products/ProductsMobile";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
    featured?: string;
    sort?: string;
    page?: string;
  }>;
};

type OrderBy =
  | { createdAt: "desc" }
  | { createdAt: "asc" }
  | { price: "asc" }
  | { price: "desc" }
  | { stock: "asc" }
  | { stock: "desc" }
  | { name: "asc" };

export default async function ProductsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  // =========================================================
  // FILTROS
  // =========================================================

  const search = params.search ?? "";
  const category = params.category ?? "";
  const status = params.status ?? "";
  // ✅ Por defeito: mostrar apenas produtos em stock
  const stock = params.stock ?? "in_stock";
  const featured = params.featured ?? "";
  const sort = params.sort ?? "newest";

  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 20;

  // =========================================================
  // QUERY
  // =========================================================

  const where: Prisma.ProductWhereInput = {
    deletedAt: null, // ✅ Adicionado - não mostrar apagados

    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              ean: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(category
      ? {
          categories: {
            some: {
              categoryId: category,
            },
          },
        }
      : {}),

    ...(status
      ? {
          status: status as ProductStatus,
        }
      : {}),

    // ✅ FILTRO DE STOCK
    ...(stock === "in_stock"
      ? {
          stock: { gt: 0 },
        }
      : {}),

    ...(stock === "low_stock"
      ? {
          stock: { gt: 0, lte: 3 },
        }
      : {}),

    ...(stock === "out_of_stock"
      ? {
          stock: 0,
        }
      : {}),

    // stock === "all" → sem filtro de stock

    ...(featured === "true"
      ? {
          isFeatured: true,
        }
      : {}),

    ...(featured === "false"
      ? {
          isFeatured: false,
        }
      : {}),
  };

  // =========================================================
  // ORDENAÇÃO
  // =========================================================

  let orderBy: OrderBy = { createdAt: "desc" };

  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "priceAsc") orderBy = { price: "asc" };
  if (sort === "priceDesc") orderBy = { price: "desc" };
  if (sort === "stockAsc") orderBy = { stock: "asc" };
  if (sort === "stockDesc") orderBy = { stock: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  // =========================================================
  // PAGINAÇÃO
  // =========================================================

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const currentPage = Math.min(page, totalPages);

  // =========================================================
  // PRODUTOS
  // =========================================================

  const rawProducts = await prisma.product.findMany({
    where,
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy,
    include: {
      brand: true,
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      categories: {
        include: { category: true },
      },
      variants: true,
    },
  });

  const products = rawProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
  }));

  // =========================================================
  // QUERY PARAMS
  // =========================================================

  const queryParams = new URLSearchParams();

  if (search) queryParams.set("search", search);
  if (category) queryParams.set("category", category);
  if (status) queryParams.set("status", status);
  if (stock) queryParams.set("stock", stock);
  if (featured) queryParams.set("featured", featured);
  if (sort) queryParams.set("sort", sort);

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(queryParams);
    params.set("page", String(pageNumber));
    return `/admin/products?${params.toString()}`;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-4 sm:space-y-5 lg:space-y-6">
      {/* HEADER */}
      <div className="w-full min-w-0">
        <h1 className="break-words text-xl font-bold sm:text-2xl lg:text-3xl" style={{ color: "#18181b" }}>
          Produtos
        </h1>
        <p className="mt-1 break-words text-sm sm:text-base" style={{ color: "#71717a" }}>
          {totalProducts} {totalProducts === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      {/* FILTROS */}
      <div className="w-full min-w-0">
        <ProductToolbar />
      </div>

      {/* LISTA DE PRODUTOS */}
      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:rounded-2xl">
        {/* DESKTOP */}
        <div className="hidden w-full max-w-full overflow-x-auto lg:block">
          <ProductsTable products={products} />
        </div>

        {/* MOBILE + TABLET */}
        <div className="block w-full min-w-0 max-w-full overflow-hidden lg:hidden">
          <ProductsMobile products={products} />
        </div>
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-5 sm:pt-6">
          <a
            href={getPageUrl(1)}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
              currentPage === 1
                ? "pointer-events-none"
                : "cursor-pointer"
            }`}
            style={{
              backgroundColor: currentPage === 1 ? "#f4f4f5" : "#000000",
              color: currentPage === 1 ? "#a1a1aa" : "#ffffff",
            }}
          >
            <span className="hidden sm:inline">&nbsp;Primeira</span>
          </a>

          <a
            href={getPageUrl(Math.max(1, currentPage - 1))}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
              currentPage === 1
                ? "pointer-events-none"
                : "cursor-pointer"
            }`}
            style={{
              backgroundColor: currentPage === 1 ? "#f4f4f5" : "#000000",
              color: currentPage === 1 ? "#a1a1aa" : "#ffffff",
            }}
          >
            ‹<span className="hidden sm:inline">&nbsp;Anterior</span>
          </a>

          {/* INDICADOR */}
          <div 
            className="flex h-10 min-w-[80px] shrink-0 items-center justify-center rounded-xl px-4 text-sm font-bold shadow-lg"
            style={{
              backgroundColor: "#ec4899",
              color: "#ffffff",
            }}
          >
            {currentPage} / {totalPages}
          </div>

          <a
            href={getPageUrl(Math.min(totalPages, currentPage + 1))}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? "pointer-events-none"
                : "cursor-pointer"
            }`}
            style={{
              backgroundColor: currentPage === totalPages ? "#f4f4f5" : "#ec4899",
              color: currentPage === totalPages ? "#a1a1aa" : "#ffffff",
            }}
          >
            <span className="hidden sm:inline">Seguinte&nbsp;</span>›
          </a>

          <a
            href={getPageUrl(totalPages)}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
              currentPage === totalPages
                ? "pointer-events-none"
                : "cursor-pointer"
            }`}
            style={{
              backgroundColor: currentPage === totalPages ? "#f4f4f5" : "#000000",
              color: currentPage === totalPages ? "#a1a1aa" : "#ffffff",
            }}
          >
            <span className="hidden sm:inline">&nbsp;Última</span>
          </a>
        </div>
      )}
    </div>
  );
}