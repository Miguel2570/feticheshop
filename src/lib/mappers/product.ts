// lib/mappers/product.ts

import { Prisma } from "@prisma/client";
import { Product, ProductVariant } from "@/types/product";
import {
  extractFeatures,
  extractSpecifications,
  extractDescription,
  getEffectiveStock,
} from "@/utils/product-helpers";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    images: true;
    categories: { include: { category: true } };
    attributes: {
      include: {
        attributeValue: { include: { attribute: true } };
      };
    };
    variants: {
      include: {
        images: true;
        attributeValues: {
          include: {
            attributeValue: { include: { attribute: true } };
          };
        };
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

// ─────────────────────────────────────────────────────────────
// ORDENAÇÃO DE VARIANTES
// ─────────────────────────────────────────────────────────────

type VarianteParseada = {
  tipo: "tamanho" | "volume" | "combo" | "outro";
  valor: number;
  raw: string;
};

function parseVariante(nome: string): VarianteParseada {
  const n = nome.trim().toUpperCase();

  const tamanhoOrdem: Record<string, number> = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
    XXL: 6,
    XXXL: 7,
    PP: 1,
    P: 2,
    G: 4,
    GG: 5,
    GGG: 6,
    ÚNICO: 99,
    UNICO: 99,
    UNIQUE: 99,
  };

  const comboMatch = n.match(/\/\s*([A-Z/]+)$/);
  if (comboMatch) {
    const parte = comboMatch[1].trim();
    const partes = parte.split("/").map((p) => tamanhoOrdem[p] ?? 50);
    return {
      tipo: "combo",
      valor: Math.max(...partes),
      raw: n,
    };
  }

  if (tamanhoOrdem[n] != null) {
    return { tipo: "tamanho", valor: tamanhoOrdem[n], raw: n };
  }

  const volumeMatch = n.match(/^(\d+(?:[.,]\d+)?)\s*(ML|L|G|KG|GR)$/);
  if (volumeMatch) {
    const num = parseFloat(volumeMatch[1].replace(",", "."));
    const unidade = volumeMatch[2];

    let normalizado = num;
    if (unidade === "L" || unidade === "KG") normalizado = num * 1000;
    else if (unidade === "GR") normalizado = num;

    return { tipo: "volume", valor: normalizado, raw: n };
  }

  return { tipo: "outro", valor: 0, raw: n };
}

function sortVariants<T extends { name: string }>(variants: T[]): T[] {
  return [...variants].sort((a, b) => {
    const aP = parseVariante(a.name);
    const bP = parseVariante(b.name);

    const ordemTipos: Record<string, number> = {
      tamanho: 1,
      volume: 2,
      combo: 3,
      outro: 4,
    };

    if (aP.tipo !== bP.tipo) {
      return ordemTipos[aP.tipo] - ordemTipos[bP.tipo];
    }

    if (aP.valor !== bP.valor) return aP.valor - bP.valor;

    return aP.raw.localeCompare(bP.raw);
  });
}

export function mapProduct(product: ProductWithRelations): Product {
  const rawDescription = product.description ?? "";

  const features = extractFeatures(rawDescription);
  const specs = extractSpecifications(rawDescription);
  const description = extractDescription(rawDescription);

  const cleanedFeatures = features.map(cleanText);

  // Mapear variantes + ordenar
  const variants: ProductVariant[] = sortVariants(
    product.variants
      .filter((v) => v.isActive)
      .map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: v.price != null ? Number(v.price) : null,
        comparePrice:
          v.comparePrice != null ? Number(v.comparePrice) : null,
        stock: v.stock,
        isActive: v.isActive,
        attributes: v.attributeValues.map((av) => ({
          slug: av.attributeValue.attribute.slug,
          name: av.attributeValue.attribute.name,
          value: av.attributeValue.value,
          valueSlug: av.attributeValue.slug,
          colorHex: av.attributeValue.colorHex,
        })),
        images: v.images
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            url: img.url,
            videoUrl: img.videoUrl ?? null,
          })),
      }))
  );

  const generalImages = product.images
    .filter((img) => !img.variantId)
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      url: img.url,
      videoUrl: img.videoUrl ?? null,
    }));

  const images =
    generalImages.length > 0
      ? generalImages
      : product.images
          .sort((a, b) => a.position - b.position)
          .map((img) => ({
            url: img.url,
            videoUrl: img.videoUrl ?? null,
          }));

  // Stock efetivo
  const effectiveStock = getEffectiveStock({
    stock: product.stock,
    variants: product.variants,
  });

  const effectivePrice = Number(product.price);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name ?? "",
    description: description,
    price: effectivePrice,
    oldPrice: product.comparePrice
      ? Number(product.comparePrice)
      : undefined,
    rating: product.ratingAverage,
    reviews: product.ratingCount,
    stock: effectiveStock > 0,
    sku: product.sku ?? "",
    category: product.categories[0]?.category.name ?? "",
    images,
    features: cleanedFeatures,
    variants,
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