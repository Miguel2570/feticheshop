// app/admin/categories/page.tsx

import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { MAIN_CATEGORY_SLUGS, ALL_ACTIVE_SLUGS } from "@/lib/categories";

import { ToggleCategoryStatusButton } from "@/components/admin/categories/ToggleCategoryStatusButton";
import { ToggleFeaturedCategoryButton } from "@/components/admin/categories/ToggleFeaturedCategoryButton";

export default async function CategoriesPage() {
  // ✅ Categorias principais (raízes) com as suas filhas
  const mainCategories = await prisma.category.findMany({
    where: {
      slug: { in: MAIN_CATEGORY_SLUGS },
      deletedAt: null,
    },
    include: {
      _count: { select: { products: true } },
      children: {
        where: { deletedAt: null },
        include: {
          _count: { select: { products: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  // ✅ Categorias do fornecedor (não estão nas ativas)
  const supplierCategories = await prisma.category.findMany({
    where: {
      dreamloveId: { not: null },
      slug: { notIn: ALL_ACTIVE_SLUGS },
      deletedAt: null,
    },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  // Contagem total de categorias ativas (raízes + subcategorias)
  const totalActive = mainCategories.reduce(
    (sum, cat) => sum + 1 + cat.children.length,
    0
  );

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-6 sm:space-y-8">
      {/* HEADER */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "#18181b" }}>
          Categorias
        </h1>

        <p className="mt-1 text-sm sm:text-base" style={{ color: "#71717a" }}>
          {mainCategories.length} categorias principais · {totalActive} ativas ·{" "}
          {supplierCategories.length} do fornecedor
        </p>
      </div>

      {/* =========================================================
          CATEGORIAS PRINCIPAIS
      ========================================================= */}

      <section className="min-w-0">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base font-bold sm:text-lg" style={{ color: "#18181b" }}>
            Categorias Principais
          </h2>
        </div>

        <div className="space-y-4">
          {mainCategories.map((cat) => (
            <div
              key={cat.id}
              className="w-full min-w-0 overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm"
            >
              {/* CABEÇALHO DA CATEGORIA PRINCIPAL */}
              <div className="flex flex-col gap-3 border-b border-pink-100 bg-pink-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold sm:text-lg" style={{ color: "#18181b" }}>
                      {cat.name}
                    </h3>
                    {cat.isActive ? (
                      <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                        Visível
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-500">
                        Oculta
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 truncate text-xs" style={{ color: "#a1a1aa" }}>
                    /{cat.slug} · {cat._count.products} produtos diretos · {cat.children.length} subcategorias
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/products?category=${cat.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-pink-500 px-3 text-xs font-semibold text-white transition-all duration-200 hover:bg-pink-600 sm:px-4"
                  >
                    Ver produtos
                  </Link>

                  <ToggleFeaturedCategoryButton
                    categoryId={cat.id}
                    isFeatured={cat.isFeatured}
                  />

                  <ToggleCategoryStatusButton id={cat.id} active={cat.isActive} />
                </div>
              </div>

              {/* SUBCATEGORIAS */}
              {cat.children.length > 0 ? (
                <>
                  {/* DESKTOP */}
                  <div className="hidden w-full min-w-0 lg:block">
                    <table className="w-full table-fixed">
                      <thead className="border-b border-zinc-100 bg-zinc-50/50">
                        <tr className="text-left">
                          <th className="w-[40%] p-3 text-xs font-semibold" style={{ color: "#52525b" }}>
                            Subcategoria
                          </th>
                          <th className="w-[15%] p-3 text-center text-xs font-semibold" style={{ color: "#52525b" }}>
                            Produtos
                          </th>
                          <th className="w-[15%] p-3 text-center text-xs font-semibold" style={{ color: "#52525b" }}>
                            Visível
                          </th>
                          <th className="w-[15%] p-3 text-center text-xs font-semibold" style={{ color: "#52525b" }}>
                            Destaque
                          </th>
                          <th className="w-[15%] p-3 text-right text-xs font-semibold" style={{ color: "#52525b" }}>
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.children.map((sub) => (
                          <tr
                            key={sub.id}
                            className="border-b border-zinc-100 transition-colors last:border-b-0 hover:bg-pink-50/20"
                          >
                            <td className="min-w-0 p-3">
                              <p className="truncate text-sm font-medium" style={{ color: "#18181b" }} title={sub.name}>
                                {sub.name}
                              </p>
                              <p className="mt-0.5 truncate text-[11px]" style={{ color: "#a1a1aa" }}>
                                /{sub.slug}
                              </p>
                            </td>

                            <td className="p-3 text-center">
                              <Link
                                href={`/admin/products?category=${sub.id}`}
                                className="text-sm font-semibold text-pink-500 transition-colors hover:text-pink-600 hover:underline"
                              >
                                {sub._count.products}
                              </Link>
                            </td>

                            <td className="p-3 text-center">
                              {sub.isActive ? (
                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                                  Visível
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-500">
                                  Oculta
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              <div className="flex justify-center">
                                <ToggleFeaturedCategoryButton
                                  categoryId={sub.id}
                                  isFeatured={sub.isFeatured}
                                />
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <Link
                                  href={`/admin/products?category=${sub.id}`}
                                  className="inline-flex h-7 items-center justify-center rounded-lg bg-pink-500 px-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:bg-pink-600"
                                >
                                  Ver produtos
                                </Link>

                                <ToggleCategoryStatusButton id={sub.id} active={sub.isActive} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE */}
                  <div className="divide-y divide-zinc-100 lg:hidden">
                    {cat.children.map((sub) => (
                      <div key={sub.id} className="min-w-0 p-4">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold" style={{ color: "#18181b" }}>
                              {sub.name}
                            </p>
                            <p className="mt-0.5 truncate text-xs" style={{ color: "#a1a1aa" }}>
                              /{sub.slug}
                            </p>
                          </div>

                          {sub.isActive ? (
                            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                              Visível
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">
                              Oculta
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                              Produtos
                            </p>
                            <Link
                              href={`/admin/products?category=${sub.id}`}
                              className="mt-1 inline-block text-sm font-bold text-pink-500 hover:text-pink-600 hover:underline"
                            >
                              {sub._count.products}
                            </Link>
                          </div>

                          <div className="flex min-w-0 flex-col items-end">
                            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                              Destaque
                            </p>
                            <ToggleFeaturedCategoryButton
                              categoryId={sub.id}
                              isFeatured={sub.isFeatured}
                            />
                          </div>
                        </div>

                        <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row">
                          <Link
                            href={`/admin/products?category=${sub.id}`}
                            className="inline-flex h-9 min-w-0 flex-1 items-center justify-center rounded-xl bg-pink-500 px-4 text-xs font-semibold text-white transition-colors hover:bg-pink-600"
                          >
                            Ver produtos
                          </Link>
                          <div className="flex justify-center sm:flex-none">
                            <ToggleCategoryStatusButton id={sub.id} active={sub.isActive} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-sm" style={{ color: "#71717a" }}>
                  Sem subcategorias.
                </div>
              )}
            </div>
          ))}

          {mainCategories.length === 0 && (
            <div className="rounded-2xl border border-pink-200 bg-white p-10 text-center text-sm" style={{ color: "#71717a" }}>
              Categorias principais não encontradas.
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          CATEGORIAS FORNECEDOR
      ========================================================= */}

      <section className="min-w-0">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-base font-bold sm:text-lg" style={{ color: "#18181b" }}>
            Categorias do Fornecedor
          </h2>
          <p className="mt-1 max-w-full text-xs leading-5 sm:text-sm" style={{ color: "#71717a" }}>
            Importadas da Dreamlove — usadas para associação automática de produtos.
          </p>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          {/* DESKTOP */}
          <div className="hidden max-h-96 w-full min-w-0 overflow-auto lg:block">
            <table className="w-full table-fixed">
              <thead className="sticky top-0 border-b border-zinc-200 bg-zinc-50">
                <tr className="text-left">
                  <th className="w-[30%] p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Nome</th>
                  <th className="w-[30%] p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Slug</th>
                  <th className="w-[20%] p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Produtos</th>
                  <th className="w-[20%] p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Dreamlove ID</th>
                </tr>
              </thead>
              <tbody>
                {supplierCategories.map((category) => (
                  <tr key={category.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50">
                    <td className="min-w-0 p-3" style={{ color: "#18181b" }}>
                      <p className="truncate text-sm" title={category.name}>{category.name}</p>
                    </td>
                    <td className="min-w-0 p-3" style={{ color: "#71717a" }}>
                      <p className="truncate text-sm" title={category.slug}>{category.slug}</p>
                    </td>
                    <td className="p-3 text-center text-sm" style={{ color: "#52525b" }}>
                      {category._count.products}
                    </td>
                    <td className="min-w-0 p-3 text-center font-mono text-sm" style={{ color: "#a1a1aa" }}>
                      <p className="truncate" title={String(category.dreamloveId ?? "")}>
                        {category.dreamloveId}
                      </p>
                    </td>
                  </tr>
                ))}

                {supplierCategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-sm" style={{ color: "#71717a" }}>
                      Nenhuma categoria do fornecedor encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-zinc-100 lg:hidden">
            {supplierCategories.map((category) => (
              <div key={category.id} className="min-w-0 p-4 sm:p-5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold sm:text-base" style={{ color: "#18181b" }}>
                    {category.name}
                  </p>
                  <p className="mt-1 truncate text-xs" style={{ color: "#71717a" }}>
                    {category.slug}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-zinc-50 p-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                      Produtos
                    </p>
                    <p className="mt-1 text-sm font-bold" style={{ color: "#52525b" }}>
                      {category._count.products}
                    </p>
                  </div>

                  <div className="min-w-0 text-right">
                    <p className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#a1a1aa" }}>
                      Dreamlove ID
                    </p>
                    <p className="mt-1 truncate font-mono text-xs" style={{ color: "#71717a" }}>
                      {category.dreamloveId}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {supplierCategories.length === 0 && (
              <div className="p-8 text-center text-sm" style={{ color: "#71717a" }}>
                Nenhuma categoria do fornecedor encontrada.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}