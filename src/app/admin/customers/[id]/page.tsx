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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {customer.firstName} {customer.lastName}
          </h1>

          <p className="text-muted-foreground">
            Detalhes do cliente
          </p>
        </div>

        <Button
          asChild
          variant="outline"
        >
          <Link href="/admin/customers">
            Voltar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Avatar
              name={`${customer.firstName} ${customer.lastName}`}
              size="xl"
            />

            <div className="text-center">
              <h2 className="text-xl font-semibold">
                {customer.firstName} {customer.lastName}
              </h2>

              <p className="text-sm text-muted-foreground">
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Informações
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Nome
                </p>

                <p className="font-medium">
                  {customer.firstName}{" "}
                  {customer.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p className="font-medium">
                  {customer.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Telefone
                </p>

                <p className="font-medium">
                  {customer.phone ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Perfil
                </p>

                <Badge variant="secondary">
                  {customer.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Criado em
                </p>

                <p className="font-medium">
                  {new Date(
                    customer.createdAt,
                  ).toLocaleDateString("pt-PT")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Último login
                </p>

                <p className="font-medium">
                  {customer.lastLoginAt
                    ? new Date(
                        customer.lastLoginAt,
                      ).toLocaleString(
                        "pt-PT",
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Estatísticas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">
                Encomendas
              </p>

              <p className="text-3xl font-bold">
                {customer.orders.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total gasto
              </p>

              <p className="text-3xl font-bold">
                {totalSpent.toFixed(2)} €
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Newsletter
              </p>

              <Badge
                variant={
                  customer.newsletter
                    ? "success"
                    : "secondary"
                }
              >
                {customer.newsletter
                  ? "Sim"
                  : "Não"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Moradas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {customer.addresses.length === 0 ? (
            <p className="text-muted-foreground">
              O cliente ainda não possui
              moradas.
            </p>
          ) : (
            <div className="space-y-6">
              {customer.addresses.map(
                (address, index) => (
                  <div key={address.id}>
                    {index > 0 && (
                      <Separator className="mb-6" />
                    )}

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

                      <p>
                        {address.firstName}{" "}
                        {address.lastName}
                      </p>

                      <p>
                        {address.addressLine1}
                      </p>

                      {address.addressLine2 && (
                        <p>
                          {
                            address.addressLine2
                          }
                        </p>
                      )}

                      <p>
                        {address.postalCode}{" "}
                        {address.city}
                      </p>

                      <p>
                        {address.country}
                      </p>

                      <p>{address.phone}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Últimas encomendas
          </CardTitle>
        </CardHeader>

        <CardContent>
          {customer.orders.length === 0 ? (
            <p className="text-muted-foreground">
              O cliente ainda não fez
              encomendas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">
                      Nº
                    </th>

                    <th className="p-3 text-center">
                      Estado
                    </th>

                    <th className="p-3 text-right">
                      Total
                    </th>

                    <th className="p-3 text-right">
                      Data
                    </th>

                    <th className="p-3 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customer.orders.map(
                    (order) => (
                      <tr
                        key={order.id}
                        className="border-b"
                      >
                        <td className="p-3">
                          {
                            order.orderNumber
                          }
                        </td>

                        <td className="p-3 text-center">
                          <Badge variant="secondary">
                            {order.status}
                          </Badge>
                        </td>

                        <td className="p-3 text-right font-medium">
                          {Number(
                            order.total,
                          ).toFixed(2)}{" "}
                          €
                        </td>

                        <td className="p-3 text-right">
                          {new Date(
                            order.createdAt,
                          ).toLocaleDateString(
                            "pt-PT",
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                          >
                            <Link
                              href={`/admin/orders/${order.id}`}
                            >
                              Ver
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}