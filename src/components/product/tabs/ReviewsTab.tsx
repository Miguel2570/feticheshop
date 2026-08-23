"use client";

import { Product } from "@/types/product";

interface ReviewsTabProps {
  product: Product;
}

export function ReviewsTab({ product }: ReviewsTabProps) {
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;

  return (
    <div>
      <h3 className="mb-8 font-display text-3xl text-white">Avaliações</h3>

      <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center">
        <p className="text-6xl font-bold text-white">
          {rating.toFixed(1)}
        </p>

        <p className="mt-3 text-zinc-400">
          Baseado em{" "}
          <strong className="text-white">{reviews}</strong>{" "}
          {reviews === 1 ? "avaliação" : "avaliações"}.
        </p>

        <p className="mt-8 text-zinc-500">
          O sistema de avaliações será ligado após integração da base de dados.
        </p>
      </div>
    </div>
  );
}