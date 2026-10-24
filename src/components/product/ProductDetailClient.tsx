"use client";

import { useMemo, useState } from "react";
import { Product, ProductVariant, ProductImage } from "@/types/product";
import { ProductGallery, GalleryItem } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeVariantId, setActiveVariantId] = useState<string | null>(() => {
    return product.variants.length > 0 ? product.variants[0].id : null;
  });

  const activeVariant: ProductVariant | null = useMemo(
    () => product.variants.find((v) => v.id === activeVariantId) ?? null,
    [product.variants, activeVariantId]
  );

  const galleryItems: GalleryItem[] = useMemo(() => {
    const imagesToUse: (string | ProductImage)[] =
      activeVariant && activeVariant.images.length > 0
        ? activeVariant.images
        : product.images;

    return imagesToUse.map((img) => {
      // Se já for o objeto novo (com url e videoUrl)
      if (typeof img === "object" && img !== null) {
        return { url: img.url, videoUrl: img.videoUrl || null };
      }
      // Se for a string antiga (por compatibilidade)
      return { url: img as string, videoUrl: null };
    });
  }, [activeVariant, product.images]);

  const effectivePrice = activeVariant?.price ?? product.price;
  
  const effectiveComparePrice = activeVariant?.comparePrice ?? product.oldPrice;

  const effectiveStock = activeVariant ? activeVariant.stock > 0 : product.stock;

  const finalPrice = effectivePrice ?? product.price;

  return (
    <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 w-full">
      <div className="w-full min-w-0 order-2 lg:order-1">
        <ProductGallery items={galleryItems} />
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