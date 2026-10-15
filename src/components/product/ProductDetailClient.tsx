"use client";

import { useMemo, useState } from "react";

import { Product, ProductVariant } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);

  const activeVariant: ProductVariant | null = useMemo(
    () => product.variants.find((v) => v.id === activeVariantId) ?? null,
    [product.variants, activeVariantId]
  );

  // ✅ Imagens mudam com a variante ativa
  const displayImages = useMemo(() => {
    if (activeVariant && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    return product.images;
  }, [activeVariant, product.images]);

  // ✅ Preço é SEMPRE o do produto-pai
  const effectivePrice = product.price;

  // ✅ Preço antigo também vem do pai
  const effectiveComparePrice = product.oldPrice;

  // ✅ Stock: usa o da variante escolhida; senão, o do produto
  const effectiveStock = useMemo(() => {
    if (activeVariant) {
      return activeVariant.stock > 0;
    }
    return product.stock;
  }, [activeVariant, product.stock]);

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 w-full">
      <div className="w-full min-w-0 order-2 lg:order-1">
        <ProductGallery images={displayImages} />
      </div>

      <div className="w-full min-w-0 order-3 lg:order-2 flex flex-col gap-6">
        <ProductInfo
          product={product}
          activeVariant={activeVariant}
          overridePrice={effectivePrice}
          overrideComparePrice={effectiveComparePrice ?? undefined}
          overrideStock={effectiveStock}
          selectedVariantId={activeVariantId}
          onVariantSelect={(v) => setActiveVariantId(v.id)}
        />
      </div>
    </div>
  );
}