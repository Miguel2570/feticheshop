import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { ToggleCategoryStatusButton } from "@/components/admin/categories/ToggleCategoryStatusButton";
import { ToggleFeaturedCategoryButton } from "@/components/admin/categories/ToggleFeaturedCategoryButton";

const frontendSlugs = [
  "sex-toys",
  "para-ele",
  "essenciais",
  "roupa",
  "bdsm",
  "vibradores",
  "dildos",
  "sugadores",
  "bolas-anales",
  "estimuladores",
  "masturbadores",
  "aneis-penianos",
  "estimulantes",
  "lubrificantes",
  "afrodisiacos",
  "jogos-eroticos",
  "lingerie-sexy",
  "bodystocking",
  "bikinis",
  "bondage",
  "acessorios-bdsm",
  "baterias-acessorios",
  "vapers-eletronicos",
];

export default async function CategoriesPage() {
  const frontendCategories = await prisma.category.findMany({
    where: {
      slug: { in: frontendSlugs },
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  const supplierCategories = await prisma.category.findMany({
    where: {
      dreamloveId: { not: null },
      slug: { notIn: frontendSlugs },
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden space-y-6 sm:space-y-8">

      {/* HEADER */}

      <div className="min-w-0">
        <h1
          className="text-2xl font-bold sm:text-3xl"
          style={{ color: "#18181b" }}
        >
          Categorias
        </h1>

        <p
          className="mt-1 text-sm sm:text-base"
          style={{ color: "#71717a" }}
        >
          {frontendCategories.length} categorias do frontend ·{" "}
          {supplierCategories.length} do fornecedor
        </p>
      </div>

      {/* =========================================================
          CATEGORIAS FRONTEND
      ========================================================= */}

      <section className="min-w-0">

        <div className="mb-3 sm:mb-4">
          <h2
            className="text-base font-bold sm:text-lg"
            style={{ color: "#18181b" }}
          >
            Categorias do Frontend
          </h2>
        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">

          {/* DESKTOP */}

          <div className="hidden w-full min-w-0 lg:block">

            <table className="w-full table-fixed">

              <thead className="border-b border-pink-100 bg-pink-50/50">

                <tr className="text-left">

                  <th
                    className="w-[30%] p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Categoria
                  </th>

                  <th
                    className="w-[12%] p-4 text-center text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Produtos
                  </th>

                  <th
                    className="w-[15%] p-4 text-center text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Visível
                  </th>

                  <th
                    className="w-[15%] p-4 text-center text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Destaque
                  </th>

                  <th
                    className="w-[28%] p-4 text-right text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                {frontendCategories.map((category) => (

                  <tr
                    key={category.id}
                    className="border-b border-zinc-100 transition-colors hover:bg-pink-50/30"
                  >

                    {/* CATEGORIA */}

                    <td className="min-w-0 p-4">

                      <p
                        className="truncate font-semibold"
                        style={{ color: "#18181b" }}
                        title={category.name}
                      >
                        {category.name}
                      </p>

                      <p
                        className="mt-0.5 truncate text-xs"
                        style={{ color: "#a1a1aa" }}
                      >
                        /{category.slug}
                      </p>

                    </td>

                    {/* PRODUTOS */}

                    <td className="p-4 text-center">

                      <Link
                        href={`/admin/products?category=${category.id}`}
                        className="font-semibold text-pink-500 transition-colors hover:text-pink-600 hover:underline"
                      >
                        {category._count.products}
                      </Link>

                    </td>

                    {/* VISIBILIDADE */}

                    <td className="p-4 text-center">

                      {category.isActive ? (

                        <span
                          className="
                            inline-flex
                            rounded-full
                            border
                            border-emerald-200
                            bg-emerald-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-emerald-600
                          "
                        >
                          Visível
                        </span>

                      ) : (

                        <span
                          className="
                            inline-flex
                            rounded-full
                            border
                            border-zinc-200
                            bg-zinc-50
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-zinc-500
                          "
                        >
                          Oculta
                        </span>

                      )}

                    </td>

                    {/* DESTAQUE */}

                    <td className="p-4 text-center">

                      <div className="flex justify-center">

                        <ToggleFeaturedCategoryButton
                          categoryId={category.id}
                          isFeatured={category.isFeatured}
                        />

                      </div>

                    </td>

                    {/* AÇÕES */}

                    <td className="p-4">

                      <div className="flex flex-wrap items-center justify-end gap-2">

                        <Link
                          href={`/admin/products?category=${category.id}`}
                          className="
                            inline-flex
                            h-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-pink-500
                            px-3
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-200
                            hover:bg-pink-600
                            sm:px-4
                          "
                        >
                          Ver produtos
                        </Link>

                        <ToggleCategoryStatusButton
                          id={category.id}
                          active={category.isActive}
                        />

                      </div>

                    </td>

                  </tr>

                ))}

                {frontendCategories.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="p-10 text-center"
                      style={{ color: "#71717a" }}
                    >
                      Categorias do frontend não encontradas.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE / TABLET */}

          <div className="divide-y divide-pink-100 lg:hidden">

            {frontendCategories.map((category) => (

              <div
                key={category.id}
                className="min-w-0 p-4 sm:p-5"
              >

                {/* TOP */}

                <div className="flex min-w-0 items-start justify-between gap-3">

                  <div className="min-w-0 flex-1">

                    <p
                      className="truncate text-sm font-semibold sm:text-base"
                      style={{ color: "#18181b" }}
                    >
                      {category.name}
                    </p>

                    <p
                      className="mt-0.5 truncate text-xs"
                      style={{ color: "#a1a1aa" }}
                    >
                      /{category.slug}
                    </p>

                  </div>

                  {category.isActive ? (

                    <span
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-emerald-200
                        bg-emerald-50
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-emerald-600
                      "
                    >
                      Visível
                    </span>

                  ) : (

                    <span
                      className="
                        shrink-0
                        rounded-full
                        border
                        border-zinc-200
                        bg-zinc-50
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-zinc-500
                      "
                    >
                      Oculta
                    </span>

                  )}

                </div>

                {/* INFO */}

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                    rounded-xl
                    bg-zinc-50
                    p-3
                  "
                >

                  <div className="min-w-0">

                    <p
                      className="text-[11px] font-medium uppercase tracking-wide"
                      style={{ color: "#a1a1aa" }}
                    >
                      Produtos
                    </p>

                    <Link
                      href={`/admin/products?category=${category.id}`}
                      className="
                        mt-1
                        inline-block
                        text-sm
                        font-bold
                        text-pink-500
                        hover:text-pink-600
                        hover:underline
                      "
                    >
                      {category._count.products}
                    </Link>

                  </div>

                  <div className="flex min-w-0 flex-col items-end">

                    <p
                      className="mb-1 text-[11px] font-medium uppercase tracking-wide"
                      style={{ color: "#a1a1aa" }}
                    >
                      Destaque
                    </p>

                    <ToggleFeaturedCategoryButton
                      categoryId={category.id}
                      isFeatured={category.isFeatured}
                    />

                  </div>

                </div>

                {/* AÇÕES */}

                <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row">

                  <Link
                    href={`/admin/products?category=${category.id}`}
                    className="
                      inline-flex
                      h-10
                      min-w-0
                      flex-1
                      items-center
                      justify-center
                      rounded-xl
                      bg-pink-500
                      px-4
                      text-sm
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-pink-600
                    "
                  >
                    Ver produtos
                  </Link>

                  <div className="flex justify-center sm:flex-none">

                    <ToggleCategoryStatusButton
                      id={category.id}
                      active={category.isActive}
                    />

                  </div>

                </div>

              </div>

            ))}

            {frontendCategories.length === 0 && (

              <div
                className="p-8 text-center text-sm"
                style={{ color: "#71717a" }}
              >
                Categorias do frontend não encontradas.
              </div>

            )}

          </div>

        </div>

      </section>

      {/* =========================================================
          CATEGORIAS FORNECEDOR
      ========================================================= */}

      <section className="min-w-0">

        <div className="mb-3 sm:mb-4">

          <h2
            className="text-base font-bold sm:text-lg"
            style={{ color: "#18181b" }}
          >
            Categorias do Fornecedor
          </h2>

          <p
            className="mt-1 max-w-full text-xs leading-5 sm:text-sm"
            style={{ color: "#71717a" }}
          >
            Importadas da Dreamlove — usadas para associação automática de
            produtos.
          </p>

        </div>

        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

          {/* DESKTOP */}

          <div className="hidden max-h-96 w-full min-w-0 overflow-auto lg:block">

            <table className="w-full table-fixed">

              <thead className="sticky top-0 border-b border-zinc-200 bg-zinc-50">

                <tr className="text-left">

                  <th
                    className="w-[30%] p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Nome
                  </th>

                  <th
                    className="w-[30%] p-4 text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Slug
                  </th>

                  <th
                    className="w-[20%] p-4 text-center text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Produtos
                  </th>

                  <th
                    className="w-[20%] p-4 text-center text-sm font-semibold"
                    style={{ color: "#52525b" }}
                  >
                    Dreamlove ID
                  </th>

                </tr>

              </thead>

              <tbody>

                {supplierCategories.map((category) => (

                  <tr
                    key={category.id}
                    className="border-b border-zinc-100 transition-colors hover:bg-zinc-50"
                  >

                    <td
                      className="min-w-0 p-3"
                      style={{ color: "#18181b" }}
                    >
                      <p
                        className="truncate text-sm"
                        title={category.name}
                      >
                        {category.name}
                      </p>
                    </td>

                    <td
                      className="min-w-0 p-3"
                      style={{ color: "#71717a" }}
                    >
                      <p
                        className="truncate text-sm"
                        title={category.slug}
                      >
                        {category.slug}
                      </p>
                    </td>

                    <td
                      className="p-3 text-center text-sm"
                      style={{ color: "#52525b" }}
                    >
                      {category._count.products}
                    </td>

                    <td
                      className="min-w-0 p-3 text-center font-mono text-sm"
                      style={{ color: "#a1a1aa" }}
                    >
                      <p
                        className="truncate"
                        title={String(category.dreamloveId ?? "")}
                      >
                        {category.dreamloveId}
                      </p>
                    </td>

                  </tr>

                ))}

                {supplierCategories.length === 0 && (

                  <tr>

                    <td
                      colSpan={4}
                      className="p-10 text-center text-sm"
                      style={{ color: "#71717a" }}
                    >
                      Nenhuma categoria do fornecedor encontrada.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE / TABLET */}

          <div className="divide-y divide-zinc-100 lg:hidden">

            {supplierCategories.map((category) => (

              <div
                key={category.id}
                className="min-w-0 p-4 sm:p-5"
              >

                <div className="min-w-0">

                  <p
                    className="truncate text-sm font-semibold sm:text-base"
                    style={{ color: "#18181b" }}
                  >
                    {category.name}
                  </p>

                  <p
                    className="mt-1 truncate text-xs"
                    style={{ color: "#71717a" }}
                  >
                    {category.slug}
                  </p>

                </div>

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                    rounded-xl
                    bg-zinc-50
                    p-3
                  "
                >

                  <div className="min-w-0">

                    <p
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                      "
                      style={{ color: "#a1a1aa" }}
                    >
                      Produtos
                    </p>

                    <p
                      className="mt-1 text-sm font-bold"
                      style={{ color: "#52525b" }}
                    >
                      {category._count.products}
                    </p>

                  </div>

                  <div className="min-w-0 text-right">

                    <p
                      className="
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-wide
                      "
                      style={{ color: "#a1a1aa" }}
                    >
                      Dreamlove ID
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        font-mono
                        text-xs
                      "
                      style={{ color: "#71717a" }}
                    >
                      {category.dreamloveId}
                    </p>

                  </div>

                </div>

              </div>

            ))}

            {supplierCategories.length === 0 && (

              <div
                className="p-8 text-center text-sm"
                style={{ color: "#71717a" }}
              >
                Nenhuma categoria do fornecedor encontrada.
              </div>

            )}

          </div>

        </div>

      </section>

    </div>
  );
}