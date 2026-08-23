"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function SyncDreamloveButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function sync() {
    setLoading(true);

    try {
      const res = await fetch(
        "/api/admin/supplier/sync",
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={sync}
      loading={loading}
    >
      <RefreshCw className="mr-2 h-4 w-4" />

      Sincronizar Dreamlove
    </Button>
  );
}