// src/utils/product-grouping.ts

/**
 * Extrai informação estruturada do nome de um produto Dreamlove.
 *
 * ✅ Suporta tamanhos compostos: S/M, L/XL, XXL/XXXL, M/L, S/L, G/GG
 * ✅ Suporta cores compostas: PRETO/VERMELHO, PRETO E VERMELHO, AZUL-PRETO
 * ✅ Trata "&" como separador (ex: "TEDDY & PRETO" → "TEDDY / PRETO")
 */

import { normalizeToPT } from "./product-normalizer";

// ─── Tamanhos ──────────────────────────────────────────────────
// Ordem crítica: mais longos / compostos primeiro
const SIZES = [
  "XXXL",
  "XXL/XXXL",
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

// Regex para apanhar tamanhos compostos genéricos X/Y (ex: XXL/XXXL)
// Aplicado DEPOIS da lista SIZES, como fallback
const COMPOSITE_SIZE_REGEX =
  /\b(XXS|XS|S|M|L|XL|XXL|XXXL|G|GG)\s*\/\s*(XXS|XS|S|M|L|XL|XXL|XXXL|G|GG)\b/i;

const VOLUMES = [
  "1 ML", "2 ML", "5 ML", "10 ML", "15 ML", "20 ML",
  "30 ML", "50 ML", "60 ML", "75 ML", "100 ML", "125 ML",
  "150 ML", "200 ML", "250 ML", "500 ML", "1000 ML",
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
  `\\b(${COLORS.join("|")})\\s*(\\/|\\s+E\\s+|\\s*-\\s*)\\s*(${COLORS.join("|")})\\b`,
  "i"
);

const VOLUME_REGEX = /\s+(\d+(?:[.,]\d+)?)\s*ML\s*$/i;

export interface ParsedProductName {
  base: string;
  color: string | null;         // pode ser composta: "Vermelho/Preto"
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
 * Normaliza o volume — devolve "N ML" (o AttributeValue exato).
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
  // 1. Normalização PT-BR → PT-PT
  let name = normalizeToPT(rawName);

  // 2. Uppercase
  name = name.toUpperCase();

  // 3. Corrigir erros comuns
  name = name
    .replace(/\bSRETA\b/g, "PRETA")
    .replace(/\bSRETO\b/g, "PRETO")
    .replace(/\bSUSPERLOR\b/g, "SUSPENSOR")
    .replace(/\bSUSPERLORIDA\b/g, "SUSPENSORIA");

  // 4. ✅ NOVO — Tratar "&" como "/" para cor composta
  //    Ex: "ZULMIRA TEDDY & PRETO" → "ZULMIRA TEDDY / PRETO"
  //    Só substitui quando precedido de espaço e seguido de palavra
  name = name.replace(/\s*&\s*/g, " / ");

  // 5. Extrair VOLUME (antes do tamanho)
  let volume: string | null = null;
  const volMatch = name.match(VOLUME_REGEX);
  if (volMatch) {
    const normalized = normalizeVolume(volMatch[1]);
    if (normalized) {
      volume = normalized;
      name = name.replace(VOLUME_REGEX, "").trim();
    }
  }

  // 6. Extrair tamanho (no fim do nome)
  let size: string | null = null;

  // 6a. Tentar a lista SIZES (mais específica)
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

  // 6b. ✅ NOVO — Fallback: tamanho composto genérico (ex: XXL/XXXL)
  if (!size) {
    const compMatch = name.match(COMPOSITE_SIZE_REGEX);
    if (compMatch) {
      // Garantir que está no fim do nome
      const afterIdx = compMatch.index! + compMatch[0].length;
      const afterStr = name.slice(afterIdx).trim();
      if (afterStr === "") {
        size = `${compMatch[1].toUpperCase()}/${compMatch[2].toUpperCase()}`;
        name = name.replace(COMPOSITE_SIZE_REGEX, "").trim();
      }
    }
  }

  // 7. Extrair cor composta PRIMEIRO
  let color: string | null = null;

  const compositeMatch = name.match(COMPOSITE_COLOR_REGEX);
  if (compositeMatch) {
    const c1 = normalizeColor(compositeMatch[1]);
    const c2 = normalizeColor(compositeMatch[3]);
    // ✅ Decisão B — valor composto único "Vermelho/Preto"
    color = `${c1}/${c2}`;
    name = name
      .replace(COMPOSITE_COLOR_REGEX, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // 8. Cor simples (se não encontrou composta)
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

  // 9. Limpar
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

export function getProductGroupKey(rawName: string): string {
  const { base, color } = parseProductName(rawName);
  return `${base}|${color ?? "SEM_COR"}`;
}