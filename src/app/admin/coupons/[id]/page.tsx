import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CouponDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const coupon = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });

  if (!coupon) {
    notFound();
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {coupon.code}
          </h1>

          <p className="text-muted-foreground">
            Detalhes do cupão
          </p>
        </div>

        <div className="flex gap-2">

          <Button
            variant="outline"
            asChild
          >
            <Link href="/admin/coupons">
              Voltar
            </Link>
          </Button>

          <Button asChild>
            <Link
              href={`/admin/coupons/${coupon.id}/edit`}
            >
              Editar
            </Link>
          </Button>

        </div>

      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            Informações Gerais
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted-foreground">
              Código
            </p>

            <p className="font-semibold">
              {coupon.code}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Nome
            </p>

            <p className="font-semibold">
              {coupon.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Tipo
            </p>

            <p className="font-semibold">
              {coupon.isPercentage
                ? "Percentagem"
                : "Valor Fixo"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Valor
            </p>

            <p className="font-semibold">
              {coupon.isPercentage
                ? `${Number(coupon.discountValue)}%`
                : `${Number(coupon.discountValue).toFixed(2)} €`}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Compra mínima
            </p>

            <p className="font-semibold">
              {coupon.minimumAmount
                ? `${Number(coupon.minimumAmount).toFixed(2)} €`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Desconto máximo
            </p>

            <p className="font-semibold">
              {coupon.maximumDiscount
                ? `${Number(coupon.maximumDiscount).toFixed(2)} €`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Limite de utilizações
            </p>

            <p className="font-semibold">
              {coupon.usageLimit ?? "Ilimitado"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Utilizações
            </p>

            <p className="font-semibold">
              {coupon.usedCount}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Limite por utilizador
            </p>

            <p className="font-semibold">
              {coupon.usagePerUser ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Estado
            </p>

            <p>
              {coupon.isActive ? (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-500">
                  Ativo
                </span>
              ) : (
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-500">
                  Inativo
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Início
            </p>

            <p className="font-semibold">
              {coupon.startsAt
                ? coupon.startsAt.toLocaleDateString("pt-PT")
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Fim
            </p>

            <p className="font-semibold">
              {coupon.endsAt
                ? coupon.endsAt.toLocaleDateString("pt-PT")
                : "-"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground">
              Descrição
            </p>

            <p className="font-semibold">
              {coupon.description || "-"}
            </p>
          </div>

        </CardContent>

      </Card>

    </div>
  );
}