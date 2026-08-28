// src/components/layout/MegaMenu.tsx
"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
}

// Estrutura atualizada com Jogos Eróticos
const menuStructure = [
  {
    name: "Sex Toys",
    slug: "sex-toys",
    subCategories: [
      { name: "Vibradores", slug: "vibradores" },
      { name: "Dildos", slug: "dildos" },
      { name: "Sugadores", slug: "sugadores" },
      { name: "Bolas Anales", slug: "bolas-anales" },
      { name: "Estimuladores", slug: "estimuladores" },
      { name: "Baterias e Acessórios", slug: "baterias-acessorios" },
    ],
  },
  {
    name: "Para o Pénis",
    slug: "para-ele",
    subCategories: [
      { name: "Masturbadores", slug: "masturbadores" },
      { name: "Anéis Penianos", slug: "aneis-penianos" },
      { name: "Estimulantes", slug: "estimulantes" },
    ],
  },
  {
    name: "Saúde e Bem-Estar",
    slug: "essenciais",
    subCategories: [
      { name: "Lubrificantes", slug: "lubrificantes" },
      { name: "Afrodisíacos", slug: "afrodisiacos" },
      { name: "Jogos Eróticos", slug: "jogos-eroticos" },
    ],
  },
  {
    name: "Lingerie",
    slug: "roupa",
    subCategories: [
      { name: "Lingerie Sexy", slug: "lingerie-sexy" },
      { name: "Bodystocking", slug: "bodystocking" },
      { name: "Bikinis", slug: "bikinis" },
    ],
  },
  {
    name: "BDSM",
    slug: "bdsm",
    subCategories: [
      { name: "Bondage", slug: "bondage" },
      { name: "Acessórios BDSM", slug: "acessorios-bdsm" },
    ],
  },
];

export function MegaMenu({
  activeCategory,
  onClose,
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeMenu = menuStructure.find(
    (cat) => cat.slug === activeCategory
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (activeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu, onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (activeMenu) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [activeMenu, onClose]);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 150);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  if (!activeMenu) return null;

  return (
    <div
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        absolute
        left-0
        right-0
        top-full
        z-40
        border-t
        border-zinc-800
        bg-[#0a0a0a]
        shadow-2xl
        shadow-black/50
      "
    >
      <div className="mx-auto max-w-[1545px] px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {activeMenu.subCategories.map((subCat) => (
            <Link
              key={subCat.slug}
              href={`/product?category=${activeMenu.slug}&subcategory=${subCat.slug}`}
              onClick={onClose}
              className="
                group
                flex
                items-center
                justify-between
                rounded-lg
                px-4
                py-3
                text-sm
                font-semibold
                text-zinc-300
                transition-all
                hover:bg-pink-500/10
                hover:text-pink-500
              "
            >
              <span>{subCat.name}</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>

        {/* Ver todos */}
        <div className="mt-8 border-t border-zinc-800 pt-5">
          <Link
            href={`/product?category=${activeMenu.slug}`}
            onClick={onClose}
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-pink-500
              transition-colors
              hover:text-pink-400
            "
          >
            Ver todos {activeMenu.name.toLowerCase()}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}