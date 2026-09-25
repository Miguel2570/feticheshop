// app/admin/products/page.tsx

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
    categorySource?: string;
    sort?: string;
    page?: string;
    // ✅ NOVOS
    type?: string;    // "grouped" | "solo" | "single" | "all"
    orphan?: string;  // "true" | "false" | ""
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

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const status = params.status ?? "";
  const stock = params.stock ?? "in_stock";
  const featured = params.featured ?? "";
  const categorySource = params.categorySource ?? "";
  const sort = params.sort ?? "newest";
  const type = params.type ?? "all";
  const orphan = params.orphan ?? "";

  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 20;

  const where: Prisma.ProductWhereInput = {
    deletedAt: null,

    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
            { ean: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),

    ...(category ? { categories: { some: { categoryId: category } } } : {}),

    ...(status ? { status: status as ProductStatus } : {}),

    ...(stock === "in_stock" ? { stock: { gt: 0 } } : {}),
    ...(stock === "low_stock" ? { stock: { gt: 0, lte: 3 } } : {}),
    ...(stock === "out_of_stock" ? { stock: 0 } : {}),

    ...(featured === "true" ? { isFeatured: true } : {}),
    ...(featured === "false" ? { isFeatured: false } : {}),

    ...(categorySource === "AUTO" || categorySource === "MANUAL"
      ? { categorySource: categorySource as "AUTO" | "MANUAL" }
      : {}),
  };

  // ✅ Filtro por tipo de produto
  if (type === "solo") {
    // Produtos SEM variantes
    where.variants = { none: {} };
  } else if (type === "single") {
    // Produtos com EXATAMENTE 1 variante
    where.variants = { some: {} };
  } else if (type === "grouped") {
    // Produtos com 2+ variantes (filtro pós-query, porque Prisma não tem `length > 1`)
    where.variants = { some: {} };
  }

  // ✅ Filtro por órfão
  if (orphan === "true") {
    where.canonicalUrl = { not: null };
  } else if (orphan === "false") {
    where.canonicalUrl = null;
  }

  let orderBy: OrderBy = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "priceAsc") orderBy = { price: "asc" };
  if (sort === "priceDesc") orderBy = { price: "desc" };
  if (sort === "stockAsc") orderBy = { stock: "asc" };
  if (sort === "stockDesc") orderBy = { stock: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  // ─── Query principal ─────────────────────────────────────
  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const currentPage = Math.min(page, totalPages);

  const rawProducts = await prisma.product.findMany({
    where,
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy,
    include: {
      brand: true,
      images: { where: { isPrimary: true }, take: 1 },
      categories: { include: { category: true } },
      _count: { select: { variants: true } },   // ✅ NOVO
    },
  });

  // ✅ Filtro "grouped" precisa de pós-processamento
  // (remover os que têm só 1 variante)
  const filteredProducts =
    type === "grouped"
      ? rawProducts.filter((p) => p._count.variants >= 2)
      : type === "single"
      ? rawProducts.filter((p) => p._count.variants === 1)
      : rawProducts;

  const products = filteredProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    variantCount: product._count.variants,  // ✅ NOVO
    isOrphan: product.canonicalUrl !== null, // ✅ NOVO
  }));

  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (category) queryParams.set("category", category);
  if (status) queryParams.set("status", status);
  if (stock) queryParams.set("stock", stock);
  if (featured) queryParams.set("featured", featured);
  if (categorySource) queryParams.set("categorySource", categorySource);
  if (sort) queryParams.set("sort", sort);
  if (type && type !== "all") queryParams.set("type", type);
  if (orphan) queryParams.set("orphan", orphan);

  const getPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams(queryParams);
    p.set("page", String(pageNumber));
    return `/admin/products?${p.toString()}`;
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="w-full min-w-0">
        <h1
          className="break-words text-xl font-bold sm:text-2xl lg:text-3xl"
          style={{ color: "#18181b" }}
        >
          Produtos
        </h1>
        <p
          className="mt-1 break-words text-sm sm:text-base"
          style={{ color: "#71717a" }}
        >
          {totalProducts}{" "}
          {totalProducts === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>
      </div>

      <div className="w-full min-w-0">
        <ProductToolbar />
      </div>

      <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm sm:rounded-2xl">
        <div className="hidden w-full max-w-full overflow-x-auto lg:block">
          <ProductsTable products={products} />
        </div>

        <div className="block w-full min-w-0 max-w-full overflow-hidden lg:hidden">
          <ProductsMobile products={products} />
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-center gap-2 border-t border-zinc-200 pt-5 sm:pt-6">
          <a
            href={getPageUrl(1)}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${
              currentPage === 1 ? "pointer-events-none" : "cursor-pointer"
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
              currentPage === 1 ? "pointer-events-none" : "cursor-pointer"
            }`}
            style={{
              backgroundColor: currentPage === 1 ? "#f4f4f5" : "#000000",
              color: currentPage === 1 ? "#a1a1aa" : "#ffffff",
            }}
          >
            ‹<span className="hidden sm:inline">&nbsp;Anterior</span>
          </a>

          <div
            className="flex h-10 min-w-[80px] shrink-0 items-center justify-center rounded-xl px-4 text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
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
              backgroundColor:
                currentPage === totalPages ? "#f4f4f5" : "#ec4899",
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
              backgroundColor:
                currentPage === totalPages ? "#f4f4f5" : "#000000",
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