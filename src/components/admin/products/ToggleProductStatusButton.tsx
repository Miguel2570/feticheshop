"use client";

import { useTransition } from "react";
import { toggleProductStatus } from "../../../actions/products/toggleProductStatus";
import { Button } from "@/components/ui/Button";

export function ToggleProductStatusButton({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductStatus(id);
        })
      }
    >
      {active ? "Ocultar" : "Mostrar"}
    </Button>
  );
}