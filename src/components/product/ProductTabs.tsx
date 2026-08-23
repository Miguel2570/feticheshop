"use client";

import { useState } from "react";

import { Product } from "@/types/product";
import { extractDescription } from "@/utils/product-helpers";

interface ProductTabsProps {
  product: Product;
}

const tabs = [
  "Descrição",
  "Características",
  "Especificações",
  "Avaliações",
];

// Função para limpar entidades HTML
const cleanDescription = (html: string) => {
  if (!html) return "";
  return html
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

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const specs = product.specifications;
  const features = product.features || [];

  // Verifica se há especificações para mostrar
  const hasSpecs = specs?.material || specs?.color || specs?.size || specs?.dimensions || specs?.weight;

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
          {/* DESCRIÇÃO - CORRIGIDA */}
          {activeTab === "Descrição" && (
          <div className="space-y-6">
            <h3 className="font-display text-3xl text-zinc-900">Descrição</h3>

            {product.description ? (
              <div
                className="prose max-w-none text-zinc-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 prose-strong:text-zinc-900 whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: product.description, // A descrição já vem limpa do mapper
                }}
              />
            ) : (
              <p className="text-zinc-500">Sem descrição disponível.</p>
            )}
          </div>
        )}

          {/* CARACTERÍSTICAS */}
          {activeTab === "Características" && (
            <div>
              <h3 className="mb-8 font-display text-3xl text-zinc-900">Características</h3>

              {features.length === 0 ? (
                <p className="text-zinc-500">Sem características disponíveis.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-5"
                    >
                      <div className="h-2 w-2 rounded-full bg-pink-500" />
                      <span className="text-zinc-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ESPECIFICAÇÕES */}
          {activeTab === "Especificações" && (
            <div>
              <h3 className="mb-8 font-display text-3xl text-zinc-900">Especificações</h3>

              {!hasSpecs ? (
                <p className="text-zinc-500">Sem especificações disponíveis.</p>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-pink-100">
                  <table className="w-full">
                    <tbody>
                      {specs.material && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900 w-1/3">Material</td>
                          <td className="p-5 text-zinc-600">{specs.material}</td>
                        </tr>
                      )}
                      {specs.color && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">Cor</td>
                          <td className="p-5 text-zinc-600">{specs.color}</td>
                        </tr>
                      )}
                      {specs.size && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">Tamanho</td>
                          <td className="p-5 text-zinc-600">{specs.size}</td>
                        </tr>
                      )}
                      {specs.dimensions && specs.dimensions !== specs.size && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">Dimensões</td>
                          <td className="p-5 text-zinc-600">{specs.dimensions}</td>
                        </tr>
                      )}
                      {specs.weight && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">Peso</td>
                          <td className="p-5 text-zinc-600">{specs.weight}</td>
                        </tr>
                      )}
                      {specs.battery && (
                        <tr className="border-b border-pink-100">
                          <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">Bateria</td>
                          <td className="p-5 text-zinc-600">{specs.battery}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="bg-pink-50/50 p-5 font-semibold text-zinc-900">À prova de água</td>
                        <td className="p-5 text-zinc-600">{specs.waterproof ? "Sim" : "Não"}</td>
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
              <h3 className="mb-8 font-display text-3xl text-zinc-900">Avaliações</h3>

              <div className="rounded-2xl border border-dashed border-pink-200 p-12 text-center bg-pink-50/30">
                <p className="text-6xl font-bold text-zinc-900">
                  {(product.rating || 0).toFixed(1)}
                </p>
                <p className="mt-3 text-zinc-600">
                  Baseado em{" "}
                  <strong className="text-zinc-900">{product.reviews || 0}</strong>{" "}
                  avaliações.
                </p>
                <p className="mt-8 text-zinc-500">
                  O sistema de avaliações será ligado após integração da base de dados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}