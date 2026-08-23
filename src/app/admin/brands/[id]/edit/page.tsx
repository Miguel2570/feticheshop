import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;

  const brand = await prisma.brand.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
  });

  if (!brand) {
    notFound();
  }

  async function updateBrand(formData: FormData) {
    "use server";
    
    const brandId = formData.get("brandId") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    await prisma.brand.update({
      where: { id: brandId },
      data: {
        name,
        slug,
        description,
        isActive,
      },
    });

    redirect("/admin/brands");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Marca</h1>
          <p className="text-gray-600 mt-1">{brand.name}</p>
        </div>
        <Link
          href="/admin/brands"
          className="h-10 px-5 text-sm font-bold rounded-xl bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-100 inline-flex items-center justify-center transition-colors"
        >
          ← Voltar
        </Link>
      </div>

      <form action={updateBrand} className="space-y-6">
        {/* Campo oculto com o ID da marca */}
        <input type="hidden" name="brandId" value={brand.id} />
        
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              name="name"
              defaultValue={brand.name}
              required
              className="h-10 w-full rounded-xl border-2 border-gray-300 px-4 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              defaultValue={brand.slug}
              required
              className="h-10 w-full rounded-xl border-2 border-gray-300 px-4 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
            <textarea
              name="description"
              defaultValue={brand.description || ""}
              rows={4}
              className="w-full rounded-xl border-2 border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              defaultChecked={brand.isActive}
              className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-200"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
              Marca ativa
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="h-11 px-6 text-sm font-bold rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-all shadow-md"
          >
            Salvar Alterações
          </button>
          <Link
            href="/admin/brands"
            className="h-11 px-6 text-sm font-bold rounded-xl bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-100 transition-all inline-flex items-center justify-center"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}