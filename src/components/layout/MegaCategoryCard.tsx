"use client";

import Link from "next/link";

interface MegaCategoryCardProps {
  name: string;
  slug: string;
}

export function MegaCategoryCard({
  name,
  slug,
}: MegaCategoryCardProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="
        group
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        px-5
        py-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-pink-500
        hover:bg-zinc-900
      "
    >
      <div
        className="
          mb-4
          h-12
          w-12
          rounded-full
          bg-pink-500/10
          transition
          group-hover:bg-pink-500
        "
      />

      <h3
        className="
          text-sm
          font-semibold
          text-zinc-200
          transition
          group-hover:text-pink-500
        "
      >
        {name}
      </h3>
    </Link>
  );
}