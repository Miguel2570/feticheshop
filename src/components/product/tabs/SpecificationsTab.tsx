"use client";

import { Product } from "@/types/product";

interface SpecificationsTabProps {
  product: Product;
}

export function SpecificationsTab({ product }: SpecificationsTabProps) {
  const specs = product.specifications;

  return (
    <div>
      <h3 className="mb-8 font-display text-3xl text-white">Especificações</h3>

      {!specs ? (
        <p className="text-zinc-500">Sem especificações disponíveis.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-zinc-800">
                <td className="bg-[#0d0d0d] p-5 font-semibold text-white">
                  Material
                </td>
                <td className="p-5 text-zinc-400">
                  {specs.material || "—"}
                </td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="bg-[#0d0d0d] p-5 font-semibold text-white">
                  Cor
                </td>
                <td className="p-5 text-zinc-400">
                  {specs.color || "—"}
                </td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="bg-[#0d0d0d] p-5 font-semibold text-white">
                  Tamanho
                </td>
                <td className="p-5 text-zinc-400">
                  {specs.size || "—"}
                </td>
              </tr>

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