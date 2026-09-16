// src/utils/product-grouping.ts

/**
 * Extrai informação estruturada do nome de um produto Dreamlove.
 *
 * Suporta:
 *   - Cores compostas: PRETO/VERMELHO, PRETO E VERMELHO, AZUL-PRETO
 *   - Tamanhos: S, M, L, XL, XXL, S/M, L/XL, Único, etc.
 *   - Volumes: 1 ML, 50 ML, 100 ML, 250 ML, etc.
 *
 * ⚠️  Apenas ML é extraído como variante. CM/MM/KG/G/L ficam no nome
 *     (são dimensões físicas descritivas, não variantes).
 *
 * ✅ Integra normalização PT-BR → PT-PT via product-normalizer.ts
 */

import { normalizeToPT } from "./product-normalizer";

// ✅ Ordem CRÍTICA: mais longos / compostos primeiro
const SIZES = [
  "XXXL",
  "XXL",
  "L/XL",
  "M/L",
  "S/M",
  "S/L",
  "XS",
  "XL",
  "G/GG",
  "GG",
  "ÚNICO",
  "UNICO",
  "G",
  "L",
  "M",
  "S",
];

// ✅ Volumes suportados como variantes (em ML)
// Têm de bater certo com os AttributeValue criados em seed-volume-attribute.ts
const VOLUMES = [
  "1 ML",
  "2 ML",
  "5 ML",
  "10 ML",
  "15 ML",
  "20 ML",
  "30 ML",
  "50 ML",
  "60 ML",
  "75 ML",
  "100 ML",
  "125 ML",
  "150 ML",
  "200 ML",
  "250 ML",
  "500 ML",
  "1000 ML",
];

const COLORS = [
  "AMARELO", "AMARELA",
  "AZUL",
  "BEIGE", "NUDE",
  "BRANCO", "BRANCA",
  "CÁQUI", "CAQUI",
  "CASTANHO", "MARROM",
  "CINZA",
  "CORAL",
  "DOURADO", "PRATEADO",
  "LARANJA",
  "LILAC", "LILÁS",
  "PRETO", "PRETA",
  "ROSA",
  "ROXO", "ROXA", "VIOLETA", "VIOLET",
  "TURQUESA",
  "VERDE",
  "VERMELHO", "VERMELHA",
];

const COMPOSITE_COLOR_REGEX = new RegExp(
  `\\b(${COLORS.join("|")})\\s*(\\/|\\s*E\\s+|\\s*-\\s*)\\s*(${COLORS.join("|")})\\b`,
  "i"
);

// Volume no FIM do nome: "50 ML", "100 ML", "1000ML", etc.
const VOLUME_REGEX = /\s+(\d+(?:[.,]\d+)?)\s*ML\s*$/i;

export interface ParsedProductName {
  base: string;
  color: string | null;
  size: string | null;
  volume: string | null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeColor(color: string): string {
  const c = color.toUpperCase().trim();
  if (c === "AMARELA") return "AMARELO";
  if (c === "PRETA") return "PRETO";
  if (c === "VERMELHA") return "VERMELHO";
  if (c === "BRANCA") return "BRANCO";
  if (c === "ROXA") return "ROXO";
  if (c === "CAQUI") return "CÁQUI";
  if (c === "LILÁS") return "LILAC";
  if (c === "VIOLET") return "VIOLETA";
  return c;
}

/**
 * Normaliza o volume extraído para bater com o AttributeValue.
 * Só aceita valores inteiros que estejam na lista VOLUMES.
 */
function normalizeVolume(value: string): string | null {
  const num = parseFloat(value.replace(",", "."));
  if (isNaN(num)) return null;
  if (!Number.isInteger(num)) return null;

  const candidate = `${num} ML`;
  if (VOLUMES.includes(candidate)) return candidate;
  return null;
}

export function parseProductName(rawName: string): ParsedProductName {
  // 1. Fix mojibake + normalização PT-BR → PT-PT (ANTES do toUpperCase)
  let name = normalizeToPT(rawName);

  // 2. Uppercase
  name = name.toUpperCase();

  // 3. Corrigir erros comuns da Dreamlove
  name = name
    .replace(/\bSRETA\b/g, "PRETA")
    .replace(/\bSRETO\b/g, "PRETO")
    .replace(/\bSUSPERLOR\b/g, "SUSPENSOR")
    .replace(/\bSUSPERLORIDA\b/g, "SUSPENSORIA");

  // 4. Extrair VOLUME (antes do tamanho, porque "ML" pode ser confundido
  //    com o tamanho "L")
  let volume: string | null = null;

  const volMatch = name.match(VOLUME_REGEX);
  if (volMatch) {
    const rawVolume = volMatch[1];
    const normalized = normalizeVolume(rawVolume);
    if (normalized) {
      volume = normalized;
      name = name.replace(VOLUME_REGEX, "").trim();
    }
  }

  // 5. Extrair tamanho (no fim do nome)
  let size: string | null = null;

  for (const s of SIZES) {
    const escaped = escapeRegex(s);
    const pattern = new RegExp(
      `(?:\\s+-\\s+(?:TAMANHO\\s+)?|\\s+(?:TAMANHO\\s+)?)${escaped}\\s*$`,
      "i"
    );

    if (pattern.test(name)) {
      size = s;
      name = name.replace(pattern, "").trim();
      break;
    }
  }

  // 6. Extrair cor composta PRIMEIRO
  let color: string | null = null;

  const compositeMatch = name.match(COMPOSITE_COLOR_REGEX);
  if (compositeMatch) {
    const c1 = normalizeColor(compositeMatch[1]);
    const c2 = normalizeColor(compositeMatch[3]);
    color = `${c1}/${c2}`;
    name = name.replace(COMPOSITE_COLOR_REGEX, "").replace(/\s+/g, " ").trim();
  }

  // 7. Se não houver cor composta, extrair cor simples
  if (!color) {
    for (const c of COLORS) {
      const pattern = new RegExp(`\\b${escapeRegex(c)}\\b`, "i");
      if (pattern.test(name)) {
        color = normalizeColor(c);
        name = name.replace(pattern, "").replace(/\s+/g, " ").trim();
        break;
      }
    }
  }

  // 8. Limpar separadores e espaços duplicados
  name = name
    .replace(/^[\s\-–,\/]+|[\s\-–,\/]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    base: name || rawName.toUpperCase(),
    color,
    size,
    volume,
  };
}

/**
 * Gera uma chave única para agrupar produtos do mesmo "modelo".
 */
export function getProductGroupKey(rawName: string): string {
  const { base, color } = parseProductName(rawName);
  return `${base}|${color ?? "SEM_COR"}`;
}