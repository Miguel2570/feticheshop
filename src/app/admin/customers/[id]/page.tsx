import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";

export default async function CustomerDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      addresses: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const totalSpent = customer.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  const vipProgress = customer.vipLevel === "GOLD"
    ? 100
    : customer.vipLevel === "SILVER"
    ? Math.min(100, ((customer.totalSpent - 250) / (750 - 250)) * 100)
    : Math.min(100, (customer.totalSpent / 250) * 100);

  const vipNextLevel = customer.vipLevel === "BRONZE"
    ? { name: "Prata", target: 250 }
    : customer.vipLevel === "SILVER"
    ? { name: "Ouro", target: 750 }
    : null;

  const vipRemaining = vipNextLevel
    ? vipNextLevel.target - customer.totalSpent
    : 0;

  return (
    <div className="space-y-6 text-zinc-900" style={{ color: "#18181b" }}>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">
            {customer.firstName} {customer.lastName}
          </h1>

          <p className="text-zinc-500">
            Detalhes do cliente
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/customers">
            Voltar
          </Link>
        </Button>
      </div>

      {/* CLIENTE + INFORMAÇÕES */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PERFIL */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Avatar
              name={`${customer.firstName} ${customer.lastName}`}
              size="xl"
            />

            <div className="text-center">
              <h2 className="text-xl font-semibold text-zinc-900">
                {customer.firstName} {customer.lastName}
              </h2>

              <p className="text-sm text-zinc-500">
                {customer.email}
              </p>
            </div>

            <Badge
              variant={
                customer.isActive
                  ? "success"
                  : "danger"
              }
            >
              {customer.isActive
                ? "Ativo"
                : "Inativo"}
            </Badge>

            <Badge
              variant={
                customer.vipLevel === "GOLD"
                  ? "success"
                  : customer.vipLevel === "SILVER"
                  ? "secondary"
                  : "outline"
              }
            >
              {customer.vipLevel === "GOLD"
                ? "👑 Ouro"
                : customer.vipLevel === "SILVER"
                ? "🎁 Prata"
                : "⭐ Bronze"}
            </Badge>
          </CardContent>
        </Card>

        {/* INFORMAÇÕES */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-zinc-900">
              Informações
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">Nome</p>
                <p className="font-medium text-zinc-900">
                  {customer.firstName} {customer.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Email</p>
                <p className="font-medium text-zinc-900">
                  {customer.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Telefone</p>
                <p className="font-medium text-zinc-900">
                  {customer.phone ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Perfil</p>
                <Badge variant="secondary">
                  {customer.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Nível VIP</p>
                <Badge
                  variant={
                    customer.vipLevel === "GOLD"
                      ? "success"
                      : customer.vipLevel === "SILVER"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {customer.vipLevel === "GOLD"
                    ? "👑 Ouro"
                    : customer.vipLevel === "SILVER"
                    ? "🎁 Prata"
                    : "⭐ Bronze"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Total Gasto (VIP)</p>
                <p className="font-medium text-zinc-900">
                  {customer.totalSpent.toFixed(2)} €
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Criado em</p>
                <p className="font-medium text-zinc-900">
                  {new Date(customer.createdAt).toLocaleDateString("pt-PT")}
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-500">Último login</p>
                <p className="font-medium text-zinc-900">
                  {customer.lastLoginAt
                    ? new Date(customer.lastLoginAt).toLocaleString("pt-PT")
                    : "-"}
                </p>
              </div>
            </div>

            {/* BARRA DE PROGRESSO VIP */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-zinc-900">
                  Progresso VIP
                </p>
                <p className="text-xs text-zinc-500">
                  {customer.vipLevel === "GOLD"
                    ? "Nível máximo"
                    : `Faltam €${vipRemaining.toFixed(0)} para ${vipNextLevel?.name}`}
                </p>
              </div>

              <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    customer.vipLevel === "GOLD"
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                      : customer.vipLevel === "SILVER"
                      ? "bg-gradient-to-r from-zinc-400 to-zinc-500"
                      : "bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
                  style={{ width: `${vipProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESTATÍSTICAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">
            Estatísticas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-zinc-500">Encomendas</p>
              <p className="text-3xl font-bold text-zinc-900">
                {customer.orders.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Total gasto</p>
              <p className="text-3xl font-bold text-zinc-900">
                {totalSpent.toFixed(2)} €
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Newsletter</p>
              <Badge
                variant={customer.newsletter ? "success" : "secondary"}
              >
                {customer.newsletter ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MORADAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">
            Moradas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {customer.addresses.length === 0 ? (
            <p className="text-zinc-500">
              O cliente ainda não possui moradas.
            </p>
          ) : (
            <div className="space-y-6">
              {customer.addresses.map((address, index) => (
                <div key={address.id}>
                  {index > 0 && <Separator className="mb-6" />}

                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {address.type}
                      </Badge>

                      {address.isDefault && (
                        <Badge variant="success">
                          Principal
                        </Badge>
                      )}
                    </div>

                    <p className="text-zinc-900">
                      {address.firstName} {address.lastName}
                    </p>

                    <p className="text-zinc-900">
                      {address.addressLine1}
                    </p>

                    {address.addressLine2 && (
                      <p className="text-zinc-900">
                        {address.addressLine2}
                      </p>
                    )}

                    <p className="text-zinc-900">
                      {address.postalCode} {address.city}
                    </p>

                    <p className="text-zinc-900">
                      {address.country}
                    </p>

                    <p className="text-zinc-900">{address.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ÚLTIMAS ENCOMENDAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">
            Últimas encomendas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {customer.orders.length === 0 ? (
            <p className="text-zinc-500">
              O cliente ainda não fez encomendas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="p-3 text-left text-zinc-900">Nº</th>
                    <th className="p-3 text-center text-zinc-900">Estado</th>
                    <th className="p-3 text-right text-zinc-900">Total</th>
                    <th className="p-3 text-right text-zinc-900">Data</th>
                    <th className="p-3 text-right text-zinc-900">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {customer.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-zinc-100"
                    >
                      <td className="p-3 text-zinc-900">
                        {order.orderNumber}
                      </td>

                      <td className="p-3 text-center">
                        <Badge variant="secondary">
                          {order.status}
                        </Badge>
                      </td>

                      <td className="p-3 text-right font-medium text-zinc-900">
                        {Number(order.total).toFixed(2)} €
                      </td>

                      <td className="p-3 text-right text-zinc-900">
                        {new Date(order.createdAt).toLocaleDateString("pt-PT")}
                      </td>

                      <td className="p-3 text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/orders/${order.id}`}>
                            Ver
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}