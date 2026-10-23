"use client";

import { useMemo, useState, useEffect } from "react";
import { Product, ProductVariant } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Arranca logo com a primeira variante ativa se existir
  const [activeVariantId, setActiveVariantId] = useState<string | null>(() => {
    return product.variants.length > 0 ? product.variants[0].id : null;
  });

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

  // ✅ PREÇO: Usa o da variante, se existir. Senão, o do produto.
  const effectivePrice = activeVariant?.price ?? product.price;
  
  // ✅ PREÇO ANTIGO: Mesma lógica.
  const effectiveComparePrice = activeVariant?.comparePrice ?? product.oldPrice;

  // ✅ STOCK: Usa o número real da variante.
  const effectiveStock = activeVariant ? activeVariant.stock > 0 : product.stock;

  // Se o preço da variante for nulo, herda o do pai (para o ProductInfo não quebrar)
  const finalPrice = effectivePrice ?? product.price;

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 w-full">
      <div className="w-full min-w-0 order-2 lg:order-1">
        <ProductGallery images={displayImages} />
      </div>

      <div className="w-full min-w-0 order-3 lg:order-2 flex flex-col gap-6">
        <ProductInfo
          product={product}
          activeVariant={activeVariant}
          overridePrice={finalPrice}
          overrideComparePrice={effectiveComparePrice ?? undefined}
          overrideStock={effectiveStock}
          selectedVariantId={activeVariantId}
          onVariantSelect={(v) => setActiveVariantId(v.id)}
        />
      </div>
    </div>
  );
}