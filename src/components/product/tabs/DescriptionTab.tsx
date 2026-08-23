"use client";

import { Product } from "@/types/product";
import { extractSpecifications } from "@/utils/product-helpers";

interface SpecificationsTabProps {
  product: Product;
}

export function SpecificationsTab({ product }: SpecificationsTabProps) {
  const specs = extractSpecifications(product.description || "");

  // Filtrar specs que têm valor
  const specFields = [
    { key: "material", label: "Material" },
    { key: "color", label: "Cor" },
    { key: "size", label: "Tamanho" },
    { key: "dimensions", label: "Dimensões" },
    { key: "weight", label: "Peso" },
    { key: "battery", label: "Bateria" },
    { key: "waterproof", label: "À prova de água" },
  ];

  const hasSpecs = specFields.some(
    (field) => field.key === "waterproof" ? true : specs[field.key as keyof typeof specs]
  );

  return (
    <div>
      <h3 className="mb-8 font-display text-3xl text-white">Especificações</h3>

      {!hasSpecs ? (
        <p className="text-zinc-500">Sem especificações disponíveis.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full">
            <tbody>
              {specs.material && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Material</td>
                  <td className="p-5 text-zinc-400">{specs.material}</td>
                </tr>
              )}

              {specs.color && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Cor</td>
                  <td className="p-5 text-zinc-400">{specs.color}</td>
                </tr>
              )}

              {specs.size && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Tamanho</td>
                  <td className="p-5 text-zinc-400">{specs.size}</td>
                </tr>
              )}

              {specs.dimensions && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Dimensões</td>
                  <td className="p-5 text-zinc-400">{specs.dimensions}</td>
                </tr>
              )}

              {specs.weight && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Peso</td>
                  <td className="p-5 text-zinc-400">{specs.weight}</td>
                </tr>
              )}

              {specs.battery && (
                <tr className="border-b border-zinc-800">
                  <td className="bg-[#0d0d0d] p-5 font-semibold text-white">Bateria</td>
                  <td className="p-5 text-zinc-400">{specs.battery}</td>
                </tr>
              )}

              <tr>
                <td className="bg-[#0d0d0d] p-5 font-semibold text-white">
                  À prova de água
                </td>
                <td className="p-5 text-zinc-400">
                  {specs.waterproof ? "Sim" : "Não"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}