"use client";

import { useTransition } from "react";

import { toggleCategoryStatus } from "@/actions/categories/toggleCategoryStatus";
import { Button } from "@/components/ui/Button";

interface ToggleCategoryStatusButtonProps {
  id: string;
  active: boolean;
}

export function ToggleCategoryStatusButton({
  id,
  active,
}: ToggleCategoryStatusButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCategoryStatus(id);
    });
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={pending}
      onClick={handleToggle}
    >
      {pending
        ? "Aguarde..."
        : active
        ? "Ocultar"
        : "Mostrar"}
    </Button>
  );
}