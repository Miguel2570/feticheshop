"use client";

import { useState } from "react";

import { ProductTabs } from "./ProductTabs";

import { GeneralTab } from "./GeneralTab";
import { ImagesTab } from "./ImagesTab";
import { CategoriesTab } from "./CategoriesTab";
import { InventoryTab } from "./InventoryTab";
import { VariantsTab } from "./VariantsTab";
import { SeoTab } from "./SeoTab";

import { ProductActions } from "./ProductActions";

type Tab =
  | "general"
  | "images"
  | "categories"
  | "inventory"
  | "variants"
  | "seo";

export function ProductForm() {
  const [tab, setTab] =
    useState<Tab>("general");

  return (
    <div className="space-y-8">

      <ProductTabs
        active={tab}
        onChange={setTab}
      />

      <div
        className="
          rounded-3xl
          border
          border-zinc-800
          bg-[#111]
          p-8
        "
      >
        {tab === "general" && (
          <GeneralTab />
        )}

        {tab === "images" && (
          <ImagesTab />
        )}

        {tab === "categories" && (
          <CategoriesTab />
        )}

        {tab === "inventory" && (
          <InventoryTab />
        )}

        {tab === "variants" && (
          <VariantsTab />
        )}

        {tab === "seo" && (
          <SeoTab />
        )}
      </div>

      <ProductActions />

    </div>
  );
}