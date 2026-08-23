"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
  open: boolean;
  onClose: () => void;
}

// Estrutura de categorias principais com subcategorias
const menuCategories = [
  {
    name: "Vibradores",
    slug: "vibradores",
    subCategories: [
      "Dildos",
      "Dildos Anales",
      "Dildos Punto G",
      "Dildos sin Vibración",
      "Dildos para Arneses",
      "Sugadores",
      "Estimuladores de Clitóris",
    ],
  },
  {
    name: "Para Ele",
    slug: "para-ele",
    subCategories: [
      "Masturbadores",
      "Masturbadores Manuais",
      "Masturbadores Elétricos",
      "Anéis Penianos",
      "Estimulantes para Ellos",
    ],
  },
  {
    name: "Para Ela",
    slug: "para-ela",
    subCategories: [
      "Estimulantes para Ellas",
      "Vibradores para Ela",
      "Sugadores para Ela",
    ],
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    subCategories: [
      "Bolas Anales",
      "Bolas Básicas",
      "Bolas Chinas",
      "Bolas e Óvulos",
      "Dilatadores",
      "Estimuladores",
    ],
  },
  {
    name: "BDSM",
    slug: "bdsm",
    subCategories: [
      "Bondage",
      "Esposas",
      "Collares",
      "Acessórios BDSM",
    ],
  },
  {
    name: "Roupa",
    slug: "roupa",
    subCategories: [
      "Lingerie",
      "Bikinis",
      "Bodystocking",
      "Camisetas Masculinas",
    ],
  },
  {
    name: "Essenciais",
    slug: "essenciais",
    subCategories: [
      "Lubrificantes",
      "DROGUERÍA",
      "Con deliciosos Sabores",
      "Potenciadores",
      "Estimulantes",
      "Afrodisíacos",
      "Retardantes",
    ],
  },
  {
    name: "CBD",
    slug: "cbd",
    subCategories: [
      "CBD Sex",
      "Vapes",
      "Joints",
      "Flores",
    ],
  },
];

export function MegaMenu({
  categories,
  open,
  onClose,
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  // Handler para mouse leave com delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 150);
  };

  // Handler para mouse enter - cancela o timeout
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  if (!open) return null;

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
        bg-[#090909]
        shadow-2xl
      "
    >
      <div className="mx-auto max-w-7xl px-8 py-8">
        {/* Grid com categorias e subcategorias */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {menuCategories.map((category) => (
            <div key={category.slug}>
              {/* Categoria principal */}
              <Link
                href={`/product?category=${category.slug}`}
                onClick={onClose}
                className="
                  block
                  text-sm
                  font-semibold
                  uppercase
                  tracking-wider
                  text-pink-500
                  transition-colors
                  hover:text-pink-400
                "
              >
                {category.name}
              </Link>

              {/* Subcategorias */}
              <ul className="mt-3 space-y-2">
                {category.subCategories.map((sub) => (
                  <li key={sub}>
                    <Link
                      href={`/product?subcategory=${encodeURIComponent(sub)}`}
                      onClick={onClose}
                      className="
                        block
                        text-sm
                        text-zinc-400
                        transition-colors
                        hover:text-pink-500
                      "
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Botão Ver todos os produtos */}
        <div className="mt-8 border-t border-zinc-800 pt-5">
          <Link
            href="/product"
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
            Ver todos os produtos
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}