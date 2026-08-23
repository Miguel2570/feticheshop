"use client";

import { useState } from "react";

import { Product } from "@/types/product";

export function TabsView({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const tabs = ["Descrição", "Características", "Especificações", "Avaliações"];

  const specs = product.specifications;
  const features = product.features || [];

  const hasSpecs = !!(
    specs?.material ||
    specs?.color ||
    specs?.size ||
    specs?.dimensions ||
    specs?.weight ||
    specs?.battery
  );

  return (
    <div>
      {/* Botões das tabs */}
      <div className="mb-6 flex flex-wrap gap-3 border-b border-pink-100 pb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              rounded-full px-6 py-3 text-sm font-semibold
              transition-all duration-300 cursor-pointer
              ${
                activeTab === tab
                  ? "bg-pink-500 text-white shadow-[0_0_25px_rgba(255,46,136,.35)]"
                  : "bg-white text-zinc-600 border border-pink-200 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-300"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div>
        {/* DESCRIÇÃO */}
        {activeTab === "Descrição" && (
          <div>
            <h3 className="mb-4 text-xl font-bold" style={{ color: "#18181b" }}>
              Descrição
            </h3>
            {product.description ? (
              <div
                className="prose max-w-none leading-7 whitespace-pre-line"
                style={{ color: "#52525b" }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p style={{ color: "#71717a" }}>Sem descrição disponível.</p>
            )}
          </div>
        )}

        {/* CARACTERÍSTICAS */}
        {activeTab === "Características" && (
          <div>
            <h3 className="mb-6 text-xl font-bold" style={{ color: "#18181b" }}>
              Características
            </h3>
            {features.length === 0 ? (
              <p style={{ color: "#71717a" }}>Sem características disponíveis.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-5"
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                    <span style={{ color: "#52525b" }}>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ESPECIFICAÇÕES */}
        {activeTab === "Especificações" && (
          <div>
            <h3 className="mb-6 text-xl font-bold" style={{ color: "#18181b" }}>
              Especificações
            </h3>
            {!hasSpecs ? (
              <p style={{ color: "#71717a" }}>Sem especificações disponíveis.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-pink-100">
                <table className="w-full">
                  <tbody>
                    {specs.material && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold w-1/3" style={{ color: "#18181b" }}>
                          Material
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.material}
                        </td>
                      </tr>
                    )}
                    {specs.color && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                          Cor
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.color}
                        </td>
                      </tr>
                    )}
                    {specs.size && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                          Tamanho
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.size}
                        </td>
                      </tr>
                    )}
                    {specs.dimensions && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                          Dimensões
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.dimensions}
                        </td>
                      </tr>
                    )}
                    {specs.weight && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                          Peso
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.weight}
                        </td>
                      </tr>
                    )}
                    {specs.battery && (
                      <tr className="border-b border-pink-100">
                        <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                          Bateria
                        </td>
                        <td className="p-4" style={{ color: "#52525b" }}>
                          {specs.battery}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="bg-pink-50/50 p-4 font-semibold" style={{ color: "#18181b" }}>
                        À prova de água
                      </td>
                      <td className="p-4" style={{ color: "#52525b" }}>
                        {specs.waterproof ? "Sim" : "Não"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* AVALIAÇÕES */}
        {activeTab === "Avaliações" && (
          <div>
            <h3 className="mb-6 text-xl font-bold" style={{ color: "#18181b" }}>
              Avaliações
            </h3>
            <div className="rounded-2xl border border-dashed border-pink-200 p-12 text-center bg-pink-50/30">
              <p className="text-6xl font-bold" style={{ color: "#18181b" }}>
                {(product.rating || 0).toFixed(1)}
              </p>
              <p style={{ color: "#52525b", marginTop: "12px" }}>
                Baseado em{" "}
                <strong style={{ color: "#18181b" }}>{product.reviews || 0}</strong>{" "}
                avaliações.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}