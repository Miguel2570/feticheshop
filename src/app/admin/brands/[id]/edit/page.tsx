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
      OR: [{ id }, { slug: id }],
    },
  });

  if (!brand) {
    notFound();
  }

  async function updateBrand(formData: FormData) {
    "use server";

    const brandId = formData.get("brandId");
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const isActive = formData.get("isActive") === "on";

    if (typeof brandId !== "string" || !brandId) {
      throw new Error("ID da marca inválido.");
    }

    if (typeof name !== "string" || !name.trim()) {
      throw new Error("O nome da marca é obrigatório.");
    }

    if (typeof slug !== "string" || !slug.trim()) {
      throw new Error("O slug da marca é obrigatório.");
    }

    await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        isActive,
      },
    });

    redirect("/admin/brands");
  }

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-2xl
              font-bold
              text-gray-900
              sm:text-3xl
            "
          >
            Editar Marca
          </h1>

          <p
            className="
              mt-1
              truncate
              text-sm
              text-gray-600
              sm:text-base
            "
          >
            {brand.name}
          </p>
        </div>

        <Link
          href="/admin/brands"
          className="
            inline-flex
            h-10
            w-full
            shrink-0
            items-center
            justify-center
            rounded-xl
            border-2
            border-gray-300
            bg-white
            px-5
            text-sm
            font-bold
            text-gray-900
            transition-colors
            hover:bg-gray-100
            sm:w-auto
          "
        >
          ← Voltar
        </Link>
      </div>

      {/* FORM */}
      <form
        action={updateBrand}
        className="w-full space-y-5 sm:space-y-6"
      >
        {/* ID */}
        <input
          type="hidden"
          name="brandId"
          value={brand.id}
        />

        {/* DADOS DA MARCA */}
        <div
          className="
            w-full
            space-y-4
            rounded-2xl
            border-2
            border-gray-200
            bg-white
            p-4
            shadow-sm
            sm:p-6
          "
        >
          {/* NOME */}
          <div>
            <label
              htmlFor="name"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Nome
            </label>

            <input
              id="name"
              type="text"
              name="name"
              defaultValue={brand.name}
              required
              className="
                h-11
                w-full
                min-w-0
                rounded-xl
                border-2
                border-gray-300
                bg-white
                px-4
                text-sm
                text-gray-900
                outline-none
                transition-colors
                placeholder:text-gray-400
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
                sm:h-10
              "
            />
          </div>

          {/* SLUG */}
          <div>
            <label
              htmlFor="slug"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              name="slug"
              defaultValue={brand.slug}
              required
              className="
                h-11
                w-full
                min-w-0
                rounded-xl
                border-2
                border-gray-300
                bg-white
                px-4
                text-sm
                text-gray-900
                outline-none
                transition-colors
                placeholder:text-gray-400
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
                sm:h-10
              "
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label
              htmlFor="description"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
              "
            >
              Descrição
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={brand.description ?? ""}
              rows={5}
              className="
                w-full
                min-w-0
                resize-y
                rounded-xl
                border-2
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                text-gray-900
                outline-none
                transition-colors
                placeholder:text-gray-400
                focus:border-pink-500
                focus:ring-2
                focus:ring-pink-200
              "
            />
          </div>
                    {/* ESTADO */}
          <div
            className="
              flex
              items-center
              rounded-xl
              bg-gray-50
              p-3
              sm:p-4
            "
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                defaultChecked={brand.isActive}
                className="
                  h-5
                  w-5
                  shrink-0
                  cursor-pointer
                  rounded
                  border-gray-300
                  text-pink-500
                  focus:ring-2
                  focus:ring-pink-200
                "
              />

              <label
                htmlFor="isActive"
                className="
                  cursor-pointer
                  text-sm
                  font-semibold
                  text-gray-700
                "
              >
                Marca ativa
              </label>
            </div>
          </div>
        </div>

        {/* AÇÕES */}
        <div
          className="
            flex
            w-full
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <button
            type="submit"
            className="
              inline-flex
              h-11
              w-full
              items-center
              justify-center
              rounded-xl
              bg-pink-600
              px-6
              text-sm
              font-bold
              text-white
              shadow-md
              transition-all
              hover:bg-pink-700
              sm:w-auto
            "
          >
            Salvar Alterações
          </button>

          <Link
            href="/admin/brands"
            className="
              inline-flex
              h-11
              w-full
              items-center
              justify-center
              rounded-xl
              border-2
              border-gray-300
              bg-white
              px-6
              text-sm
              font-bold
              text-gray-900
              transition-all
              hover:bg-gray-100
              sm:w-auto
            "
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}