import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { CouponForm } from "../_components/CouponForm";

export default function NewCouponPage() {
  return (
    <div className="space-y-6 text-zinc-900" style={{ color: "#18181b" }}>

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
          <h1 className="text-3xl font-bold text-zinc-900">
            Novo Cupão
          </h1>

          <p className="text-zinc-500">
            Criar um novo cupão de desconto
          </p>
        </div>

      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-zinc-900">
            Dados do Cupão
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CouponForm />
        </CardContent>

      </Card>

    </div>
  );
}