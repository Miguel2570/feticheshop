import Image from "next/image";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

import { ToggleProductStatusButton } from "@/actions/products/ToggleProductStatusButton";
import { ToggleFeaturedButton } from "@/actions/products/ToggleFeaturedButton";

import { Button } from "@/components/ui/Button";

// Categorias do frontend
const FRONTEND_CATEGORY_SLUGS = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    stock?: string;
    featured?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const search = params.search ?? "";
  const category = params.category ?? "";
  const status = params.status ?? "ACTIVE";
  const stock = params.stock ?? "in_stock";
  const featured = params.featured ?? "";
  const page = Math.max(1, Number(params.page ?? "1"));
  const pageSize = 20;

  /*
   * =========================
   * CATEGORIAS (só as 8 do frontend)
   * =========================
   */

  const categories = await prisma.category.findMany({
    where: {
      slug: { in: FRONTEND_CATEGORY_SLUGS },
    },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  /*
   * =========================
   * WHERE
   * =========================
   */

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { sku: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),

    ...(category
      ? { categories: { some: { categoryId: category } } }
      : {}),

    ...(status ? { status: status as ProductStatus } : {}),

    ...(stock === "in_stock" ? { stock: { gt: 0 } } : {}),
    ...(stock === "low_stock" ? { stock: { gt: 0, lte: 3 } } : {}),
    ...(stock === "out_of_stock" ? { stock: 0 } : {}),

    ...(featured ? { isFeatured: featured === "true" } : {}),
  };

  /*
   * =========================
   * TOTAL & PRODUTOS
   * =========================
   */

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize));
  const currentPage = Math.min(page, totalPages);

  const products = await prisma.product.findMany({
    where,
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      status: true,
      isFeatured: true,
      brand: { select: { name: true } },
      categories: {
        where: {
          category: {
            slug: { in: FRONTEND_CATEGORY_SLUGS },
          },
        },
        take: 1,
        select: { category: { select: { id: true, name: true, slug: true } } },
      },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  /*
   * =========================
   * QUERY PAGINAÇÃO
   * =========================
   */

  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (status) query.set("status", status);
  if (stock) query.set("stock", stock);
  if (featured) query.set("featured", featured);

  const statusLabels: Record<string, string> = {
    ACTIVE: "Ativo",
    DRAFT: "Rascunho",
    HIDDEN: "Oculto",
    OUT_OF_STOCK: "Sem Stock",
    ARCHIVED: "Arquivado",
  };

  const statusBadgeColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    DRAFT: "bg-zinc-50 text-zinc-600 border-zinc-200",
    HIDDEN: "bg-yellow-50 text-yellow-600 border-yellow-200",
    OUT_OF_STOCK: "bg-red-50 text-red-500 border-red-200",
    ARCHIVED: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Produtos
        </h1>
        <p style={{ color: "#71717a" }}>
          Gestão de produtos da loja
        </p>
      </div>

      {/* FILTROS */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <form className="flex flex-wrap items-center gap-3" method="GET">
          {/* PESQUISA */}
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Pesquisar produto..."
            className="
              h-10 min-w-[200px] flex-1
              rounded-xl border border-zinc-200 bg-zinc-50
              px-4 text-sm outline-none transition
              placeholder:text-zinc-400
              focus:border-pink-500 focus:ring-2 focus:ring-pink-200
            "
            style={{ color: "#18181b" }}
          />

          {/* CATEGORIA - só frontend */}
          <select
            name="category"
            defaultValue={category}
            className="
              h-10 rounded-xl border border-zinc-200 bg-white
              px-3 text-sm outline-none cursor-pointer
              focus:border-pink-500
            "
            style={{ color: "#18181b" }}
          >
            <option value="">Todas as categorias</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* VISIBILIDADE */}
          <select
            name="status"
            defaultValue={status}
            className="
              h-10 rounded-xl border border-zinc-200 bg-white
              px-3 text-sm outline-none cursor-pointer
              focus:border-pink-500
            "
            style={{ color: "#18181b" }}
          >
            <option value="">Todos os estados</option>
            <option value="ACTIVE">Ativos</option>
            <option value="HIDDEN">Ocultos</option>
            <option value="DRAFT">Rascunhos</option>
            <option value="ARCHIVED">Arquivados</option>
          </select>

          {/* STOCK */}
          <select
            name="stock"
            defaultValue={stock}
            className="
              h-10 rounded-xl border border-zinc-200 bg-white
              px-3 text-sm outline-none cursor-pointer
              focus:border-pink-500
            "
            style={{ color: "#18181b" }}
          >
            <option value="">Todo o stock</option>
            <option value="in_stock">Com stock</option>
            <option value="low_stock">Stock baixo</option>
            <option value="out_of_stock">Sem stock</option>
          </select>

          {/* DESTAQUE */}
          <select
            name="featured"
            defaultValue={featured}
            className="
              h-10 rounded-xl border border-zinc-200 bg-white
              px-3 text-sm outline-none cursor-pointer
              focus:border-pink-500
            "
            style={{ color: "#18181b" }}
          >
            <option value="">Todos os produtos</option>
            <option value="true">Em destaque</option>
            <option value="false">Sem destaque</option>
          </select>

          {/* FILTRAR - rosa sólido */}
          <button
            type="submit"
            className="
              inline-flex items-center justify-center
              h-10 px-5 text-sm font-semibold rounded-xl
              transition-all duration-200 cursor-pointer
              bg-pink-500 text-white
              hover:bg-pink-600
            "
          >
            Filtrar
          </button>

          {/* LIMPAR - rosa sólido */}
          <Link
            href="/admin/products"
            className="
              inline-flex items-center justify-center
              h-10 px-5 text-sm font-semibold rounded-xl
              transition-all duration-200 cursor-pointer
              bg-pink-500 text-white
              hover:bg-pink-600
            "
          >
            Limpar
          </Link>
        </form>
      </div>

      {/* CONTADOR */}
      <p style={{ color: "#71717a", fontSize: "14px" }}>
        {totalProducts} {totalProducts === 1 ? "produto encontrado" : "produtos encontrados"}
      </p>

      {/* TABELA */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr className="text-left">
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Produto</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Categoria</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Marca</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Stock</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Preço</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Estado</th>
                <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Destaque</th>
                <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-zinc-100 hover:bg-pink-50/30">
                  {/* PRODUTO */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-100">
                        {product.images[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div />
                        )}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#18181b" }}>
                          {product.name}
                        </p>
                        <p className="text-xs" style={{ color: "#a1a1aa" }}>
                          {product.sku ?? "Sem SKU"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORIA - filtra para mostrar só a do frontend */}
                  <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                    {product.categories[0]?.category.name ?? "-"}
                  </td>

                  {/* MARCA */}
                  <td className="p-4 text-sm" style={{ color: "#52525b" }}>
                    {product.brand?.name ?? "-"}
                  </td>

                  {/* STOCK */}
                  <td className="p-4">
                    {product.stock === 0 ? (
                      <span className="font-semibold text-red-500">Sem stock</span>
                    ) : product.stock <= 3 ? (
                      <span className="font-semibold text-yellow-600">{product.stock}</span>
                    ) : (
                      <span className="font-semibold text-emerald-600">{product.stock}</span>
                    )}
                  </td>

                  {/* PREÇO */}
                  <td className="p-4 font-semibold" style={{ color: "#18181b" }}>
                    {Number(product.price).toFixed(2)} €
                  </td>

                  {/* ESTADO */}
                  <td className="p-4">
                    <span
                      className={`
                        inline-flex rounded-full border px-3 py-1 text-xs font-semibold
                        ${statusBadgeColors[product.status] ?? "bg-zinc-50 text-zinc-600 border-zinc-200"}
                      `}
                    >
                      {statusLabels[product.status] ?? product.status}
                    </span>
                  </td>

                  {/* DESTAQUE */}
                  <td className="p-4">
                    <ToggleFeaturedButton
                      id={product.id}
                      featured={product.isFeatured}
                    />
                  </td>

                  {/* AÇÕES */}
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white
                          hover:bg-pink-600
                        "
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="
                          inline-flex items-center justify-center
                          h-8 px-4 text-xs font-semibold rounded-lg
                          transition-all duration-200 cursor-pointer
                          bg-pink-500 text-white
                          hover:bg-pink-600
                        "
                      >
                        Editar
                      </Link>

                      <ToggleProductStatusButton
                        id={product.id}
                        active={product.status === "ACTIVE"}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 border-t border-zinc-200 pt-6">
          <div className="flex items-center gap-2">
            <Link
              href={{
                pathname: "/admin/products",
                query: { search, category, status, stock, featured, page: "1" },
              }}
            >
              <Button size="sm" variant="outline" disabled={currentPage === 1}>
                «
              </Button>
            </Link>

            <Link
              href={{
                pathname: "/admin/products",
                query: { search, category, status, stock, featured, page: String(currentPage - 1) },
              }}
            >
              <Button size="sm" variant="outline" disabled={currentPage === 1}>
                Anterior
              </Button>
            </Link>

            <div
              className="flex h-8 min-w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold"
              style={{ color: "#18181b" }}
            >
              {currentPage} / {totalPages}
            </div>

            <Link
              href={{
                pathname: "/admin/products",
                query: { search, category, status, stock, featured, page: String(currentPage + 1) },
              }}
            >
              <Button size="sm" disabled={currentPage === totalPages}>
                Seguinte
              </Button>
            </Link>

            <Link
              href={{
                pathname: "/admin/products",
                query: { search, category, status, stock, featured, page: String(totalPages) },
              }}
            >
              <Button size="sm" variant="outline" disabled={currentPage === totalPages}>
                »
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}