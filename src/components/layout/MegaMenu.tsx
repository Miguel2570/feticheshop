// components/layout/MegaMenu.tsx
"use client";

import Link from "next/link";
import { useRef, useEffect, useMemo } from "react";
import { ChevronRight } from "lucide-react";

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
}

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
  allCategories: NavbarCategory[];
}

export function MegaMenu({
  activeCategory,
  onClose,
  allCategories,
}: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Categorias raiz (para saber o nome e a estrutura)
  const activeMenu = useMemo(
    () =>
      allCategories.find(
        (cat) => cat.slug === activeCategory && cat.parentId === null
      ) ?? null,
    [allCategories, activeCategory]
  );

  // ✅ Subcategorias: filhos da categoria ativa
  const subCategories = useMemo(() => {
    if (!activeMenu) return [];
    return allCategories
      .filter((c) => c.parentId === activeMenu.id)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [allCategories, activeMenu]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
      if (e.key === "Escape") onClose();
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
        absolute left-0 right-0 top-full z-40
        border-t border-zinc-800 bg-[#0a0a0a]
        shadow-2xl shadow-black/50
      "
    >
      <div className="mx-auto max-w-[1545px] px-10 py-8">
        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {subCategories.map((subCat) => (
              <Link
                key={subCat.slug}
                href={`/product?category=${activeMenu.slug}&subcategory=${subCat.slug}`}
                onClick={onClose}
                className="
                  group flex items-center justify-between
                  rounded-lg px-4 py-3
                  text-sm font-semibold text-zinc-300
                  transition-all
                  hover:bg-pink-500/10 hover:text-pink-500
                "
              >
                <span>{subCat.name}</span>
                <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-zinc-500">
            Sem subcategorias.
          </p>
        )}

        <div className="mt-8 border-t border-zinc-800 pt-5">
          <Link
            href={`/product?category=${activeMenu.slug}`}
            onClick={onClose}
            className="
              inline-flex items-center gap-2
              text-sm font-semibold text-pink-500
              transition-colors hover:text-pink-400
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