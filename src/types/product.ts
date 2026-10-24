// types/product.ts

export interface ProductVariantAttribute {
  slug: string;      // "cor" | "tamanho" | "volume"
  name: string;      // "Cor" | "Tamanho" | "Volume"
  value: string;     // "AZUL" | "S" | "30 ML"
  valueSlug: string; // "azul" | "s" | "30-ml"
  colorHex?: string | null;
}

export interface ProductImage {
  url: string;
  videoUrl: string | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  comparePrice: number | null;
  stock: number;
  isActive: boolean;
  attributes: ProductVariantAttribute[];
  images: ProductImage[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: boolean;
  sku: string;
  category: string;
  images: ProductImage[];
  features: string[];
  variants: ProductVariant[];
  specifications: {
    material: string;
    color: string;
    size: string;
    waterproof: boolean;
    dimensions?: string;
    weight?: string;
    battery?: string;
  };
}