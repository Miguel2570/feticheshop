"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";

import { ProductVariant } from "@/types/product";

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
}

interface AttributeGroup {
  slug: string;
  name: string;
  values: Array<{
    value: string;
    valueSlug: string;
    colorHex?: string | null;
  }>;
}

/**
 * Agrupa os valores únicos de cada atributo (cor, tamanho, volume).
 */
function buildGroups(variants: ProductVariant[]): AttributeGroup[] {
  const map = new Map<string, AttributeGroup>();

  for (const variant of variants) {
    for (const attr of variant.attributes) {
      if (!map.has(attr.slug)) {
        map.set(attr.slug, {
          slug: attr.slug,
          name: attr.name,
          values: [],
        });
      }
      const group = map.get(attr.slug)!;
      if (!group.values.some((v) => v.valueSlug === attr.valueSlug)) {
        group.values.push({
          value: attr.value,
          valueSlug: attr.valueSlug,
          colorHex: attr.colorHex,
        });
      }
    }
  }

  // Ordem preferida: cor, tamanho, volume; resto por ordem de aparição
  const order = ["cor", "tamanho", "volume"];
  return Array.from(map.values()).sort((a, b) => {
    const ia = order.indexOf(a.slug);
    const ib = order.indexOf(b.slug);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

/**
 * Dado o estado atual de seleção (mapa slug → valueSlug),
 * devolve a variante que corresponde, ou null se não existe.
 */
function findVariant(
  variants: ProductVariant[],
  selection: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((v) => {
      // A variante tem de ter exatamente os atributos selecionados
      return v.attributes.every((attr) => {
        const selected = selection[attr.slug];
        if (!selected) return false;
        return selected === attr.valueSlug;
      });
    }) ?? null
  );
}

/**
 * Verifica se uma combinação (parcial) existe.
 * Útil para desativar botões.
 */
function combinationExists(
  variants: ProductVariant[],
  selection: Record<string, string>
): boolean {
  return variants.some((v) => {
    return Object.entries(selection).every(([slug, valueSlug]) => {
      return v.attributes.some(
        (attr) => attr.slug === slug && attr.valueSlug === valueSlug
      );
    });
  });
}

export function ProductVariants({
  variants,
  selectedVariantId,
  onSelect,
}: ProductVariantsProps) {
  const groups = useMemo(() => buildGroups(variants), [variants]);

  // Seleção atual extraída da variante ativa
  const selection = useMemo<Record<string, string>>(() => {
    const active = variants.find((v) => v.id === selectedVariantId);
    if (!active) return {};
    const sel: Record<string, string> = {};
    for (const attr of active.attributes) {
      sel[attr.slug] = attr.valueSlug;
    }
    return sel;
  }, [variants, selectedVariantId]);

  if (groups.length === 0) return null;

  function handleSelect(slug: string, valueSlug: string) {
    const nextSelection = { ...selection, [slug]: valueSlug };
    const variant = findVariant(variants, nextSelection);
    if (variant) {
      onSelect(variant);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.slug} className="flex flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
            {group.name}
          </span>

          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const isSelected = selection[group.slug] === value.valueSlug;

              // Verifica se esta combinação existe
              const testSelection = { ...selection, [group.slug]: value.valueSlug };
              const exists = combinationExists(variants, testSelection);

              // Cor com hex → mostra bolinha
              const isColor = group.slug === "cor" && value.colorHex;

              return (
                <button
                  key={value.valueSlug}
                  type="button"
                  disabled={!exists}
                  onClick={() => handleSelect(group.slug, value.valueSlug)}
                  title={value.value}
                  className={`
                    relative
                    flex
                    h-11
                    min-w-[44px]
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border-2
                    px-4
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "border-pink-500 bg-pink-500 text-white shadow-md shadow-pink-500/30"
                        : exists
                        ? "border-pink-200 bg-white text-zinc-700 hover:border-pink-500 hover:text-pink-500 cursor-pointer"
                        : "border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
                    }
                  `}
                >
                  {isColor && (
                    <span
                      className="h-4 w-4 rounded-full border border-zinc-300"
                      style={{ backgroundColor: value.colorHex ?? "#ccc" }}
                    />
                  )}
                  <span>{value.value}</span>
                  {isSelected && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}