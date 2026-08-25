import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface SupplierPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SupplierDetailsPage({
  params,
}: SupplierPageProps) {
  const { id } = await params;

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
          syncs: true,
        },
      },
      syncs: {
        orderBy: {
          startedAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!supplier) {
    notFound();
  }

  const lastSync = supplier.syncs[0];

  const statusSyncLabels: Record<string, string> = {
    RUNNING: "Em execução",
    SUCCESS: "Concluída",
    FAILED: "Falhou",
    PENDING: "Pendente",
    CANCELLED: "Cancelada",
  };

  const statusSyncColors: Record<string, string> = {
    RUNNING: "bg-sky-50 text-sky-600 border-sky-200",
    SUCCESS: "bg-emerald-50 text-emerald-600 border-emerald-200",
    FAILED: "bg-red-50 text-red-500 border-red-200",
    PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
    CANCELLED: "bg-zinc-50 text-zinc-500 border-zinc-200",
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "#18181b" }}
          >
            {supplier.name}
          </h1>

          <p style={{ color: "#71717a" }}>
            Detalhes do fornecedor
          </p>
        </div>

        <div className="flex gap-2">
          {/* VOLTAR */}
          <Link
            href="/admin/suppliers"
            className="
              inline-flex
              h-9
              items-center
              justify-center
              rounded-lg
              bg-pink-500
              px-4
              text-xs
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-pink-600
              hover:shadow-lg
              hover:shadow-pink-500/25
            "
          >
            Voltar
          </Link>

          {/* EDITAR */}
          <Link
            href={`/admin/suppliers/${supplier.id}/edit`}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              rounded-lg
              bg-pink-500
              px-4
              text-xs
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-pink-600
              hover:shadow-lg
              hover:shadow-pink-500/25
            "
          >
            Editar
          </Link>
        </div>
      </div>

      {/* RESUMO */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p
            className="text-xs"
            style={{ color: "#71717a" }}
          >
            Produtos
          </p>

          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            {supplier._count.products}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p
            className="text-xs"
            style={{ color: "#71717a" }}
          >
            Sincronizações
          </p>

          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            {supplier._count.syncs}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p
            className="text-xs"
            style={{ color: "#71717a" }}
          >
            Estado
          </p>

          <div className="mt-2">
            {supplier.isActive ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Ativo
              </span>
            ) : (
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                Inativo
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p
            className="text-xs"
            style={{ color: "#71717a" }}
          >
            Última sincronização
          </p>

          <p
            className="mt-2 text-sm font-medium"
            style={{ color: "#18181b" }}
          >
            {lastSync
              ? new Date(lastSync.startedAt).toLocaleString("pt-PT")
              : "-"}
          </p>
        </div>
      </div>

      {/* INFORMAÇÃO */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-5">
          <h2
            className="text-lg font-bold"
            style={{ color: "#18181b" }}
          >
            Informação do fornecedor
          </h2>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: "#71717a" }}
            >
              Nome
            </span>

            <span
              className="font-medium"
              style={{ color: "#18181b" }}
            >
              {supplier.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: "#71717a" }}
            >
              Slug
            </span>

            <span
              className="font-medium"
              style={{ color: "#18181b" }}
            >
              {supplier.slug}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: "#71717a" }}
            >
              Website
            </span>

            {supplier.website ? (
              <a
                href={supplier.website}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-pink-500 hover:underline"
              >
                {supplier.website}
              </a>
            ) : (
              <span
                className="font-medium"
                style={{ color: "#18181b" }}
              >
                -
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: "#71717a" }}
            >
              API
            </span>

            <span
              className="font-medium"
              style={{ color: "#18181b" }}
            >
              {supplier.apiUrl ?? "-"}
            </span>
          </div>
        </div>
      </div>
            {/* HISTÓRICO */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-5">
          <h2
            className="text-lg font-bold"
            style={{ color: "#18181b" }}
          >
            Histórico de sincronizações
          </h2>
        </div>

        <div className="p-5">
          {supplier.syncs.length === 0 ? (
            <p style={{ color: "#71717a" }}>
              Ainda não existem sincronizações.
            </p>
          ) : (
            <div className="space-y-3">
              {supplier.syncs.map((sync) => (
                <div
                  key={sync.id}
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-zinc-100
                    pb-3
                    last:border-b-0
                    last:pb-0
                  "
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#18181b" }}
                    >
                      {new Date(
                        sync.startedAt
                      ).toLocaleString("pt-PT")}
                    </p>

                    <p
                      className="mt-1 text-xs"
                      style={{ color: "#71717a" }}
                    >
                      {sync.imported} importados ·{" "}
                      {sync.updated} atualizados ·{" "}
                      {sync.failed} falhados
                    </p>
                  </div>

                  <span
                    className={`
                      inline-flex
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${
                        statusSyncColors[sync.status] ??
                        "bg-zinc-50 text-zinc-500 border-zinc-200"
                      }
                    `}
                  >
                    {statusSyncLabels[sync.status] ??
                      sync.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}