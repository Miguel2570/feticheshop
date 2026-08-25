import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { CouponForm } from "../../_components/CouponForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCouponPage({
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

  // Converter Decimal para number
  const plainCoupon = {
    id: coupon.id,
    code: coupon.code,
    name: coupon.name,
    description: coupon.description,
    discountValue: Number(coupon.discountValue),
    isPercentage: coupon.isPercentage,
    maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : null,
    minimumAmount: coupon.minimumAmount ? Number(coupon.minimumAmount) : null,
    usageLimit: coupon.usageLimit,
    usagePerUser: coupon.usagePerUser,
    startsAt: coupon.startsAt,
    endsAt: coupon.endsAt,
    isActive: coupon.isActive,
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-4">

        <Button
          variant="outline"
          size="icon"
          asChild
        >
          <Link href="/admin/coupons">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>

          <h1 className="text-3xl font-bold">
            Editar Cupão
          </h1>

          <p className="text-muted-foreground">
            {coupon.code}
          </p>

        </div>

      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            Editar Dados
          </CardTitle>
        </CardHeader>

        <CardContent>

          <CouponForm
            coupon={plainCoupon}
          />

        </CardContent>

      </Card>

    </div>
  );
}