import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Função helper para formatar preço
function formatPrice(price: unknown): string {
  if (price === null || price === undefined) {
    return "Preço não definido";
  }

  const numericPrice = Number(price);

  if (isNaN(numericPrice)) {
    return "Preço não definido";
  }

  return numericPrice.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function BrandDetailPage({ params }: Props) {
  const { id } = await params;

  const brand = await prisma.brand.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!brand) {
    notFound();
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
            {brand.name}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-600
              sm:text-base
            "
          >
            Detalhes da marca
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
            font-semibold
            text-gray-900
            transition-colors
            hover:bg-gray-100
            sm:w-auto
          "
        >
          ← Voltar
        </Link>
      </div>

      {/* CONTEÚDO */}

      <div
        className="
          w-full
          rounded-2xl
          border-2
          border-gray-200
          bg-white
          p-4
          shadow-sm
          sm:p-6
        "
      >
        {/* INFORMAÇÕES + DESCRIÇÃO */}

        <div
          className="
            grid
            grid-cols-1
            gap-8
            md:grid-cols-2
          "
        >
          {/* INFORMAÇÕES */}

          <div>
            <h2
              className="
                mb-6
                text-xl
                font-bold
                text-gray-900
              "
            >
              Informações
            </h2>

            <dl className="space-y-4">
              {/* NOME */}

              <div>
                <dt
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-gray-600
                  "
                >
                  Nome
                </dt>

                <dd
                  className="
                    text-lg
                    font-medium
                    text-gray-900
                  "
                >
                  {brand.name}
                </dd>
              </div>

              {/* SLUG */}

              <div>
                <dt
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-gray-600
                  "
                >
                  Slug
                </dt>

                <dd
                  className="
                    inline-block
                    rounded-lg
                    bg-gray-50
                    px-3
                    py-1
                    font-mono
                    text-gray-800
                  "
                >
                  /{brand.slug}
                </dd>
              </div>

              {/* ESTADO */}

              <div>
                <dt
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-gray-600
                  "
                >
                  Estado
                </dt>

                <dd>
                  {brand.isActive ? (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border-2
                        border-emerald-200
                        bg-emerald-50
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-emerald-600
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Ativa
                    </span>
                  ) : (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border-2
                        border-gray-300
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-bold
                        text-gray-700
                      "
                    >
                      <span className="h-2 w-2 rounded-full bg-gray-400" />
                      Inativa
                    </span>
                  )}
                </dd>
              </div>

              {/* TOTAL DE PRODUTOS */}

              <div>
                <dt
                  className="
                    mb-1
                    text-sm
                    font-semibold
                    text-gray-600
                  "
                >
                  Total de Produtos
                </dt>

                <dd
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                  "
                >
                  {brand._count.products}
                </dd>
              </div>
            </dl>
          </div>

          {/* DESCRIÇÃO */}

          <div>
            <h2
              className="
                mb-6
                text-xl
                font-bold
                text-gray-900
              "
            >
              Descrição
            </h2>

            <div
              className="
                min-h-[100px]
                rounded-xl
                bg-gray-50
                p-4
              "
            >
              <p
                className="
                  leading-relaxed
                  text-gray-800
                "
              >
                {brand.description || "Sem descrição disponível"}
              </p>
            </div>

            {/* LOGO */}

            {brand.logo && (
              <div className="mt-6">
                <h3
                  className="
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-600
                  "
                >
                  Logo
                </h3>

                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="
                    h-20
                    w-20
                    rounded-lg
                    border-2
                    border-gray-200
                    bg-white
                    object-cover
                  "
                />
              </div>
            )}
          </div>
        </div>
                {/* PRODUTOS DA MARCA */}

        <div className="mt-8 sm:mt-10">
          {/* HEADER DOS PRODUTOS */}

          <div
            className="
              mb-5
              flex
              flex-col
              gap-2
              sm:mb-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <h2
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >
              Produtos
            </h2>

            <span
              className="
                w-fit
                rounded-full
                bg-gray-100
                px-3
                py-1
                text-sm
                font-semibold
                text-gray-600
              "
            >
              {brand.products.length}{" "}
              {brand.products.length === 1
                ? "produto"
                : "produtos"}
            </span>
          </div>

          {/* LISTA DE PRODUTOS */}

          {brand.products.length > 0 ? (
            <div className="space-y-3">
              {brand.products.map((product, index) => (
                <div
                  key={product.id}
                  className="
                    flex
                    flex-col
                    gap-3
                    rounded-xl
                    border-2
                    border-gray-200
                    bg-white
                    p-4
                    transition-all
                    hover:border-pink-300
                    hover:bg-pink-50
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* PRODUTO */}

                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-pink-100
                        text-sm
                        font-bold
                        text-pink-700
                      "
                    >
                      {index + 1}
                    </span>

                    <span
                      className="
                        truncate
                        font-semibold
                        text-gray-900
                      "
                    >
                      {product.name}
                    </span>
                  </div>

                  {/* PREÇO */}

                  <span
                    className="
                      w-fit
                      rounded-lg
                      bg-gray-50
                      px-4
                      py-1.5
                      text-sm
                      font-bold
                      text-gray-800
                    "
                  >
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                rounded-xl
                bg-gray-50
                px-4
                py-8
                text-center
              "
            >
              <p className="text-sm text-gray-600">
                Nenhum produto associado a esta marca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}