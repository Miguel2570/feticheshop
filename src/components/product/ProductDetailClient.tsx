"use client";

import { useMemo, useState } from "react";

import { Product, ProductVariant } from "@/types/product";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailClientProps {
  product: Product;
}

/**
 * Wrapper cliente que junta:
 *  - ProductGallery (imagens mudam com a cor)
 *  - ProductInfo (preço/stock + seletor de variantes + botão de carrinho)
 */
export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeVariantId, setActiveVariantId] = useState<string | null>(
    product.variants[0]?.id ?? null
  );

  const activeVariant: ProductVariant | null = useMemo(
    () => product.variants.find((v) => v.id === activeVariantId) ?? null,
    [product.variants, activeVariantId]
  );

  // Imagens a mostrar na galeria:
  //  1. Se há variante ativa e essa variante tem imagens → usa-as
  //  2. Senão → usa as imagens gerais
  const displayImages = useMemo(() => {
    if (activeVariant && activeVariant.images.length > 0) {
      return activeVariant.images;
    }
    return product.images;
  }, [activeVariant, product.images]);

  // Preço efetivo (variante sobrepõe produto se tiver price)
  const effectivePrice =
    activeVariant?.price != null ? activeVariant.price : product.price;

  const effectiveComparePrice =
    activeVariant?.comparePrice != null
      ? activeVariant.comparePrice
      : product.oldPrice;

  const effectiveStock =
    activeVariant != null ? activeVariant.stock > 0 : product.stock;

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 w-full">
      <div className="w-full min-w-0 order-2 lg:order-1">
        <ProductGallery images={displayImages} />
      </div>

      <div className="w-full min-w-0 order-3 lg:order-2 flex flex-col gap-6">
        {/* Info com preço/stock da variante ativa + seletor de variantes */}
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