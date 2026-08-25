"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

import { toggleFeatured } from "../../../actions/products/toggleFeatured";

export function ToggleFeaturedButton({
  id,
  featured,
}: {
  id: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleFeatured(id);
          router.refresh();
        })
      }
    >
      <Star
        size={20}
        className={
          featured
            ? "fill-yellow-400 text-yellow-400"
            : "text-zinc-500"
        }
      />
    </button>
  );
}