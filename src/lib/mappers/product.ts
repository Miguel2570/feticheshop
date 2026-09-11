// lib/mappers/product.ts

import { Prisma } from "@prisma/client";
import { Product } from "@/types/product";
import { 
  extractFeatures, 
  extractSpecifications,
  extractDescription
} from "@/utils/product-helpers";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    images: true;
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

const cleanText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/&ntilde;/g, "ñ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
};

export function mapProduct(product: ProductWithRelations): Product {
  const rawDescription = product.description ?? "";

  const features = extractFeatures(rawDescription);
  const specs = extractSpecifications(rawDescription);
  const description = extractDescription(rawDescription);

  const cleanedFeatures = features.map(cleanText);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name ?? "",
    description: description,
    price: Number(product.price),
    oldPrice: product.comparePrice ? Number(product.comparePrice) : undefined,
    rating: product.ratingAverage,
    reviews: product.ratingCount,
    stock: product.stock > 0,
    sku: product.sku ?? "",
    category: product.categories[0]?.category.name ?? "",
    images: product.images.map((image) => image.url),
    features: cleanedFeatures,
    specifications: {
      material: cleanText(specs.material ?? ""),
      color: cleanText(specs.color ?? ""),
      size: cleanText(specs.size ?? ""),
      waterproof: specs.waterproof ?? false,
      dimensions: cleanText(specs.dimensions ?? ""),
      weight: cleanText(specs.weight ?? ""),
      battery: cleanText(specs.battery ?? ""),
    },
  };
}