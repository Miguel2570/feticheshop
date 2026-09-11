"use client";

import { useState } from "react";

import { Product } from "@/types/product";

export function TabsView({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("Descrição");

  const tabs = ["Descrição", "Características", "Avaliações"];

  const features = product.features || [];

  return (
    <div className="text-zinc-900" style={{ color: "#18181b" }}>
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
            <h3 className="mb-4 text-xl font-bold text-zinc-900">
              Descrição
            </h3>
            {product.description ? (
              <div
                className="prose max-w-none leading-7 whitespace-pre-line text-zinc-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-zinc-500">Sem descrição disponível.</p>
            )}
          </div>
        )}

        {/* CARACTERÍSTICAS */}
        {activeTab === "Características" && (
          <div>
            <h3 className="mb-6 text-xl font-bold text-zinc-900">
              Características
            </h3>
            {features.length === 0 ? (
              <p className="text-zinc-500">Sem características disponíveis.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-5"
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                    <span className="text-zinc-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AVALIAÇÕES */}
        {activeTab === "Avaliações" && (
          <div>
            <h3 className="mb-6 text-xl font-bold text-zinc-900">
              Avaliações
            </h3>
            <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/30 p-12 text-center">
              <p className="text-6xl font-bold text-zinc-900">
                {(product.rating || 0).toFixed(1)}
              </p>
              <p className="mt-3 text-zinc-700">
                Baseado em{" "}
                <strong className="text-zinc-900">{product.reviews || 0}</strong>{" "}
                avaliações.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}