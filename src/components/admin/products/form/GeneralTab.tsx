"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export function GeneralTab() {
  return (
    <div className="space-y-10">

      {/* ============================= */}

      <div>

        <h2 className="text-xl font-semibold text-white">
          Informação Geral
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Dados principais do produto.
        </p>

      </div>

      {/* ============================= */}

      <div className="grid gap-6 md:grid-cols-2">

        <div className="space-y-2">

          <Label>Nome</Label>

          <Input
            placeholder="Ex.: Vibrador Premium"
          />

        </div>

        <div className="space-y-2">

          <Label>Slug</Label>

          <Input
            placeholder="vibrador-premium"
          />

        </div>

      </div>

      {/* ============================= */}

      <div className="grid gap-6 md:grid-cols-2">

        <div className="space-y-2">

          <Label>SKU</Label>

          <Input
            placeholder="SKU0001"
          />

        </div>

        <div className="space-y-2">

          <Label>EAN</Label>

          <Input
            placeholder="5600000000000"
          />

        </div>

      </div>

      {/* ============================= */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="space-y-2">

          <Label>Preço</Label>

          <Input
            type="number"
            step="0.01"
            placeholder="39.90"
          />

        </div>

        <div className="space-y-2">

          <Label>Preço Promoção</Label>

          <Input
            type="number"
            step="0.01"
            placeholder="29.90"
          />

        </div>

        <div className="space-y-2">

          <Label>Custo</Label>

          <Input
            type="number"
            step="0.01"
            placeholder="18.50"
          />

        </div>

      </div>

      {/* ============================= */}

      <div className="space-y-2">

        <Label>Descrição Curta</Label>

        <Textarea
          rows={4}
          placeholder="Pequena descrição..."
        />

      </div>

      {/* ============================= */}

      <div className="space-y-2">

        <Label>Descrição Completa</Label>

        <Textarea
          rows={10}
          placeholder="Descrição completa..."
        />

      </div>

      {/* ============================= */}

      <div className="grid gap-6 md:grid-cols-2">

        <div className="space-y-2">

          <Label>Marca</Label>

          <select
            className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              px-4
              py-3
              text-white
            "
          >
            <option>
              Selecionar marca
            </option>
          </select>

        </div>

        <div className="space-y-2">

          <Label>Estado</Label>

          <select
            className="
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-900
              px-4
              py-3
              text-white
            "
          >
            <option>Rascunho</option>
            <option>Ativo</option>
            <option>Oculto</option>
            <option>Sem Stock</option>
            <option>Arquivado</option>
          </select>

        </div>

      </div>

      {/* ============================= */}

      <div className="grid gap-5 md:grid-cols-3">

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          <span className="text-white">
            Produto em Destaque
          </span>

        </label>

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          <span className="text-white">
            Produto Novo
          </span>

        </label>

        <label className="flex items-center gap-3">

          <input type="checkbox" />

          <span className="text-white">
            Produto em Promoção
          </span>

        </label>

      </div>

    </div>
  );
}