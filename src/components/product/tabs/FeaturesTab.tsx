"use client";

import { Product } from "@/types/product";
import { extractFeatures } from "@/utils/product-helpers";

interface FeaturesTabProps {
  product: Product;
}

export function FeaturesTab({ product }: FeaturesTabProps) {
  const features = extractFeatures(product.description || "");

  return (
    <div>
      <h3 className="mb-8 font-display text-3xl text-white">Características</h3>

      {features.length === 0 ? (
        <p className="text-zinc-500">Sem características disponíveis.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5"
            >
              <div className="h-2 w-2 rounded-full bg-pink-500" />
              <span className="text-zinc-300">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}