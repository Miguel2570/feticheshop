// app/admin/products/page.tsx

import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductToolbar } from "@/components/admin/products/ProductToolbar";
import { ProductsTable } from "@/components/admin/products/ProductsTable";
import { ProductsMobile } from "@/components/admin/products/ProductsMobile";

type Props = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;          // ← NOVO
    status?: string;
    stock?: string;
    featured?: string;
    categorySource?: string;
    sort?: string;
    page?: string;
    type?: string;
    orphan?: string;
    minPrice?: string;       // ← NOVO
    maxPrice?: string;       // ← NOVO
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

const PAGE_SIZE = 20;

const productInclude = {
  brand: true,
  images: { where: { isPrimary: true }, take: 1 },
  categories: { include: { category: true } },
  _count: { select: { variants: true } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const brand = params.brand ?? "";                 // ← NOVO
  const status = params.status ?? "";
  const stock = params.stock ?? "in_stock";
  const featured = params.featured ?? "";
  const categorySource = params.categorySource ?? "";
  const sort = params.sort ?? "newest";
  const type = params.type ?? "all";
  const orphan = params.orphan ?? "";

  // ← NOVO — parse de preço
  const minPriceRaw = params.minPrice ?? "";
  const maxPriceRaw = params.maxPrice ?? "";
  const minPrice =
    minPriceRaw !== "" && !isNaN(Number(minPriceRaw))
      ? Number(minPriceRaw)
      : undefined;
  const maxPrice =
    maxPriceRaw !== "" && !isNaN(Number(maxPriceRaw))
      ? Number(maxPriceRaw)
      : undefined;

  const page = Math.max(1, Number(params.page ?? "1"));

  // ─── WHERE ───────────────────────────────────────────────
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,

    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
            { ean: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),

    ...(category ? { categories: { some: { categoryId: category } } } : {}),

    // ← NOVO — filtro por marca
    ...(brand ? { brandId: brand } : {}),

    ...(status ? { status: status as ProductStatus } : {}),
    ...(stock === "in_stock" ? { stock: { gt: 0 } } : {}),
    ...(stock === "out_of_stock" ? { stock: 0 } : {}),
    ...(featured === "true" ? { isFeatured: true } : {}),
    ...(featured === "false" ? { isFeatured: false } : {}),
    ...(categorySource === "AUTO" || categorySource === "MANUAL"
      ? { categorySource: categorySource as "AUTO" | "MANUAL" }
      : {}),

    // ← NOVO — filtro por preço mín/máx
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  // Tipo de variantes
  if (type === "solo") {
    where.variants = { none: {} };
  } else if (type === "single") {
    where.variants = { some: {} };
  } else if (type === "grouped") {
    where.variants = { some: {} };
  }

  // Órfão / canónico
  if (orphan === "true") {
    where.canonicalUrl = { not: null };
  } else if (orphan === "false") {
    where.canonicalUrl = null;
  }

  // ─── ORDER ───────────────────────────────────────────────
  let orderBy: OrderBy = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "priceAsc") orderBy = { price: "asc" };
  if (sort === "priceDesc") orderBy = { price: "desc" };
  if (sort === "stockAsc") orderBy = { stock: "asc" };
  if (sort === "stockDesc") orderBy = { stock: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  // ─── QUERY ───────────────────────────────────────────────
  const isGroupedFilter = type === "grouped";

  let totalProducts: number;
  let pagedProducts: ProductWithRelations[];

  if (isGroupedFilter) {
    const allCandidates = await prisma.product.findMany({
      where,
      orderBy,
      include: productInclude,
    });

    const groupedOnly = allCandidates.filter((p) => p._count.variants >= 2);
    totalProducts = groupedOnly.length;
    const totalPagesSafe = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const currentPageSafe = Math.min(page, totalPagesSafe);
    pagedProducts = groupedOnly.slice(
      (currentPageSafe - 1) * PAGE_SIZE,
      currentPageSafe * PAGE_SIZE
    );
  } else {
    totalProducts = await prisma.product.count({ where });
    const totalPagesSafe = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
    const currentPageSafe = Math.min(page, totalPagesSafe);
    pagedProducts = await prisma.product.findMany({
      where,
      take: PAGE_SIZE,
      skip: (currentPageSafe - 1) * PAGE_SIZE,
      orderBy,
      include: productInclude,
    });
  }

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  // ─── SERIALIZAÇÃO ────────────────────────────────────────
  const products = pagedProducts.map((product) => ({
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    costPrice: product.costPrice ? Number(product.costPrice) : null,
    variantCount: product._count.variants,
    isOrphan: product.canonicalUrl !== null,
  }));

  // ─── QUERY PARAMS PARA PAGINAÇÃO ─────────────────────────
  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (category) queryParams.set("category", category);
  if (brand) queryParams.set("brand", brand);                       // ← NOVO
  if (status) queryParams.set("status", status);
  if (stock) queryParams.set("stock", stock);
  if (featured) queryParams.set("featured", featured);
  if (categorySource) queryParams.set("categorySource", categorySource);
  if (sort) queryParams.set("sort", sort);
  if (type && type !== "all") queryParams.set("type", type);
  if (orphan) queryParams.set("orphan", orphan);
  if (minPrice !== undefined) queryParams.set("minPrice", String(minPrice)); // ← NOVO
  if (maxPrice !== undefined) queryParams.set("maxPrice", String(maxPrice)); // ← NOVO

  const getPageUrl = (pageNumber: number) => {
    const p = new URLSearchParams(queryParams);
    p.set("page", String(pageNumber));
    return `/admin/products?${p.toString()}`;
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="w-full min-w-0">
        <h1 className="break-words text-xl font-bold text-zinc-900 sm:text-2xl lg:text-3xl">
          Produtos
        </h1>
        <p className="mt-1 break-words text-sm text-zinc-500 sm:text-base">
          {totalProducts}{" "}
          {totalProducts === 1 ? "produto encontrado" : "produtos encontrados"}
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
          {/* Primeira */}
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

          {/* Anterior */}
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

          {/* Indicador */}
          <div
            className="flex h-10 min-w-[80px] shrink-0 items-center justify-center rounded-xl px-4 text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
          >
            {currentPage} / {totalPages}
          </div>

          {/* Seguinte */}
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

          {/* Última */}
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