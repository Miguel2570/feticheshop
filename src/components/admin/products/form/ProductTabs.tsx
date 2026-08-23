"use client";

import {
  Boxes,
  FolderTree,
  Globe,
  ImageIcon,
  Package,
  Settings2,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

type Tab =
  | "general"
  | "images"
  | "categories"
  | "inventory"
  | "variants"
  | "seo";

interface ProductTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

interface ProductTab {
  id: Tab;
  label: string;
  icon: LucideIcon;
}

const tabs: ProductTab[] = [
  {
    id: "general",
    label: "Geral",
    icon: Package,
  },
  {
    id: "images",
    label: "Imagens",
    icon: ImageIcon,
  },
  {
    id: "categories",
    label: "Categorias",
    icon: FolderTree,
  },
  {
    id: "inventory",
    label: "Inventário",
    icon: Boxes,
  },
  {
    id: "variants",
    label: "Variantes",
    icon: Settings2,
  },
  {
    id: "seo",
    label: "SEO",
    icon: Globe,
  },
];

export function ProductTabs({
  active,
  onChange,
}: ProductTabsProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-800
        bg-[#111]
        p-3
      "
    >
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                flex
                items-center
                gap-2
                rounded-2xl
                px-5
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
                ${
                  isActive
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }
              `}
            >
              <Icon size={18} />

              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}