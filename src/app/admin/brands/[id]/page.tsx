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
  if (price === null || price === undefined) return "Preço não definido";
  
  const numericPrice = Number(price);
  
  if (isNaN(numericPrice)) return "Preço não definido";
  
  return numericPrice.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
  });
}

export default async function BrandDetailPage({ params }: Props) {
  const { id } = await params;

  const brand = await prisma.brand.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
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
        select: { products: true },
      },
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
          <p className="text-gray-600 mt-1">Detalhes da marca</p>
        </div>
        <Link
          href="/admin/brands"
          className="h-10 px-5 text-sm font-semibold rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 inline-flex items-center justify-center transition-colors"
        >
          ← Voltar
        </Link>
      </div>

      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informações</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-1">Nome</dt>
                <dd className="font-medium text-gray-900 text-lg">{brand.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-1">Slug</dt>
                <dd className="font-mono text-gray-800 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                  /{brand.slug}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-1">Estado</dt>
                <dd>
                  {brand.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 border-2 border-green-300 px-3 py-1 text-xs font-bold text-green-800">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Ativa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border-2 border-gray-300 px-3 py-1 text-xs font-bold text-gray-700">
                      <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                      Inativa
                    </span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-semibold text-gray-600 mb-1">Total de Produtos</dt>
                <dd className="font-bold text-gray-900 text-2xl">
                  {brand._count.products}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Descrição</h2>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[100px]">
              <p className="text-gray-800 leading-relaxed">
                {brand.description || "Sem descrição disponível"}
              </p>
            </div>
            
            {brand.logo && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Logo</h3>
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200 bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Lista de produtos da marca */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Produtos</h2>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {brand.products.length} {brand.products.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
          
          {brand.products.length > 0 ? (
            <div className="space-y-3">
              {brand.products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-all bg-white"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-700 text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-gray-900">{product.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800 bg-gray-50 px-4 py-1.5 rounded-lg">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-600">Nenhum produto associado a esta marca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}