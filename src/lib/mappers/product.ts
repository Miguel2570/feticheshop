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

// Função para limpar entidades HTML
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
  const features = extractFeatures(product.description ?? "");
  const specs = extractSpecifications(product.description ?? "");
  const description = extractDescription(product.description ?? "");

  console.log("📝 Descrição original:", product.description);
  console.log("📝 Descrição extraída:", description);
  console.log("📋 Features extraídas:", features);
  console.log("📋 Specs extraídas:", specs);

  // Limpa as entidades HTML das características
  const cleanedFeatures = features.map(cleanText);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name ?? "",
    description: description, // ← USA A DESCRIÇÃO EXTRAÍDA
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