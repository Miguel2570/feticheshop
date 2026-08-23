import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { ToggleCategoryStatusButton } from "@/components/admin/categories/ToggleCategoryStatusButton";
import { ToggleFeaturedCategoryButton } from "@/components/admin/categories/ToggleFeaturedCategoryButton";

const frontendSlugs = [
  "vibradores",
  "para-ele",
  "para-ela",
  "acessorios",
  "bdsm",
  "roupa",
  "essenciais",
  "cbd",
];

export default async function CategoriesPage() {
  // Categorias do frontend (8 principais)
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

  // Categorias do fornecedor (todas com dreamloveId)
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
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Categorias
        </h1>
        <p style={{ color: "#71717a" }}>
          {frontendCategories.length} categorias do frontend · {supplierCategories.length} do fornecedor
        </p>
      </div>

      {/* =========================
          FRONTEND CATEGORIES
          ========================= */}
      <div>
        <h2 className="text-lg font-bold mb-4" style={{ color: "#18181b" }}>
          Categorias do Frontend
        </h2>

        <div className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-pink-100 bg-pink-50/50">
                <tr className="text-left">
                  <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Categoria</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Produtos</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Visível</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Destaque</th>
                  <th className="p-4 text-right text-sm font-semibold" style={{ color: "#52525b" }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {frontendCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-zinc-100 hover:bg-pink-50/30"
                  >
                    <td className="p-4">
                      <p className="font-semibold" style={{ color: "#18181b" }}>
                        {category.name}
                      </p>
                      <p className="text-xs" style={{ color: "#a1a1aa" }}>
                        /{category.slug}
                      </p>
                    </td>

                    <td className="p-4 text-center">
                      {/* LINK PARA VER PRODUTOS */}
                      <Link
                        href={`/admin/products?category=${category.id}`}
                        className="font-semibold text-pink-500 hover:text-pink-600 hover:underline"
                      >
                        {category._count.products}
                      </Link>
                    </td>

                    <td className="p-4 text-center">
                      {category.isActive ? (
                        <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-600">
                          Visível
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-50 border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-500">
                          Oculta
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        <ToggleFeaturedCategoryButton
                          categoryId={category.id}
                          isFeatured={category.isFeatured}
                        />
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* VER PRODUTOS - botão rosa */}
                        <Link
                          href={`/admin/products?category=${category.id}`}
                          className="
                            inline-flex items-center justify-center
                            h-8 px-4 text-xs font-semibold rounded-lg
                            transition-all duration-200 cursor-pointer
                            bg-pink-500 text-white
                            hover:bg-pink-600
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
                    <td colSpan={5} className="p-10 text-center" style={{ color: "#71717a" }}>
                      Categorias do frontend não encontradas. Corre:
                      <code className="ml-2 bg-zinc-100 px-2 py-1 rounded text-xs">
                        npx tsx scripts/sync-main-categories.ts
                      </code>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================
          SUPPLIER CATEGORIES
          ========================= */}
      <div>
        <h2 className="text-lg font-bold mb-2" style={{ color: "#18181b" }}>
          Categorias do Fornecedor
        </h2>
        <p className="text-sm mb-4" style={{ color: "#71717a" }}>
          Importadas da Dreamlove - usadas para associação automática de produtos.
        </p>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 sticky top-0">
                <tr className="text-left">
                  <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Nome</th>
                  <th className="p-4 text-sm font-semibold" style={{ color: "#52525b" }}>Slug</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Produtos</th>
                  <th className="p-4 text-center text-sm font-semibold" style={{ color: "#52525b" }}>Dreamlove ID</th>
                </tr>
              </thead>

              <tbody>
                {supplierCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="p-3 text-sm" style={{ color: "#18181b" }}>
                      {category.name}
                    </td>

                    <td className="p-3 text-sm" style={{ color: "#71717a" }}>
                      {category.slug}
                    </td>

                    <td className="p-3 text-center text-sm" style={{ color: "#52525b" }}>
                      {category._count.products}
                    </td>

                    <td className="p-3 text-center text-sm font-mono" style={{ color: "#a1a1aa" }}>
                      {category.dreamloveId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}