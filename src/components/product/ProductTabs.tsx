"use client";

import { useState } from "react";

import { Product } from "@/types/product";

interface ProductTabsProps {
  product: Product;
}

const tabs = [
  "Descrição",
  "Características",
];

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const features = product.features || [];
  const specs = product.specifications;

  // ✅ Construir lista de especificações para juntar à descrição
  const specsList: string[] = [];

  if (specs?.material) specsList.push(`**Material:** ${specs.material}`);
  if (specs?.color) specsList.push(`**Cor:** ${specs.color}`);
  if (specs?.size) specsList.push(`**Tamanho:** ${specs.size}`);
  if (specs?.dimensions && specs.dimensions !== specs.size) {
    specsList.push(`**Dimensões:** ${specs.dimensions}`);
  }
  if (specs?.weight) specsList.push(`**Peso:** ${specs.weight}`);
  if (specs?.battery) specsList.push(`**Bateria:** ${specs.battery}`);
  if (specs?.waterproof !== undefined) {
    specsList.push(`**À prova de água:** ${specs.waterproof ? "Sim" : "Não"}`);
  }

  return (
    <section className="py-24">
      <div className="container-custom">
        <div className="mb-14 text-center">
          <p className="section-eyebrow">Informações do Produto</p>
          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Tudo o que precisa de saber
            </span>
          </h2>
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-3 border-b border-pink-100 pb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                rounded-full
                px-6
                py-3
                text-sm
                font-semibold
                transition-all
                duration-300
                cursor-pointer
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

        <div className="rounded-[32px] border border-pink-100 bg-white p-10 shadow-sm">
          {activeTab === "Descrição" && (
            <div className="space-y-6">
              <h3 className="font-display text-3xl text-zinc-900">Descrição</h3>

              {product.description ? (
                <div
                  className="prose max-w-none text-zinc-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-strong:text-zinc-900 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              ) : (
                <p className="text-zinc-500">Sem descrição disponível.</p>
              )}

              {/* ✅ ESPECIFICAÇÕES JUNTAS À DESCRIÇÃO */}
              {specsList.length > 0 && (
                <div className="mt-8 border-t border-pink-100 pt-6">
                  <h4 className="mb-4 font-display text-xl text-zinc-900">
                    Especificações
                  </h4>
                  <ul className="space-y-2">
                    {specsList.map((spec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-base leading-8 text-zinc-700"
                      >
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                        <span
                          dangerouslySetInnerHTML={{
                            __html: spec.replace(
                              /\*\*(.*?)\*\*/g,
                              "<strong>$1</strong>"
                            ),
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "Características" && (
            <div>
              <h3 className="mb-8 font-display text-3xl text-zinc-900">Características</h3>

              {features.length === 0 ? (
                <p className="text-zinc-500">Sem características disponíveis.</p>
              ) : (
                <div className="space-y-3">
                  {features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-start gap-3 text-base leading-8 text-zinc-700"
                    >
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                      {feature}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}