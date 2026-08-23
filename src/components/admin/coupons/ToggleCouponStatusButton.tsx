"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/Button";

import { ToggleCouponStatus } from "@/actions/coupons/ToggleCouponStatus";

type Props = {
  id: string;
  active: boolean;
};

export function ToggleCouponStatusButton({
  id,
  active,
}: Props) {
  const [isPending, startTransition] =
    useTransition();

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await ToggleCouponStatus(id);
        })
      }
    >
      {active ? "Desativar" : "Ativar"}
    </Button>
  );
}