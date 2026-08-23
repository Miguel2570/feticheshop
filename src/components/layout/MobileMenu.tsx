"use client";

import Link from "next/link";
import { X, ChevronRight, Shield, UserCircle2 } from "lucide-react";

interface MobileMenuCategory {
  id: string;
  name: string;
  slug: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: MobileMenuCategory[];
  hasNewProducts?: boolean;
  hasSaleProducts?: boolean;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
}

// Categorias principais
const menuCategories = [
  { name: "Vibradores", slug: "vibradores" },
  { name: "Para Ele", slug: "para-ele" },
  { name: "Para Ela", slug: "para-ela" },
  { name: "Acessórios", slug: "acessorios" },
  { name: "BDSM", slug: "bdsm" },
  { name: "Roupa", slug: "roupa" },
  { name: "Essenciais", slug: "essenciais" },
  { name: "CBD", slug: "cbd" },
];

export function MobileMenu({
  open,
  onClose,
  categories,
  hasNewProducts = false,
  hasSaleProducts = false,
  isAdmin = false,
  isAuthenticated = false,
}: MobileMenuProps) {
  if (!open) {
    return null;
  }

  const links = [
    { href: "/product", label: "Todos os Produtos" },
    ...(hasNewProducts ? [{ href: "/new", label: "Novidades" }] : []),
    ...(hasSaleProducts ? [{ href: "/sale", label: "Promoções" }] : []),
  ];

  return (
    <div
      className="
        fixed
        inset-0
        z-[60]
        bg-black
        overflow-y-auto
        lg:hidden
      "
    >
      <div className="container-custom py-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Menu</p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="
              rounded-full
              p-2
              text-zinc-200
              transition
              hover:bg-zinc-900
              hover:text-pink-500
              cursor-pointer
            "
          >
            <X size={28} />
          </button>
        </div>

        {/* Navegação Principal */}
        <div className="mt-6 grid gap-1.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="
                group
                flex
                items-center
                justify-between
                rounded-xl
                px-4
                py-3.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-zinc-900
                hover:text-pink-500
              "
            >
              {link.label}

              <ChevronRight
                size={16}
                className="text-zinc-500 transition-transform group-hover:translate-x-0.5 group-hover:text-pink-500"
              />
            </Link>
          ))}
        </div>

        {/* Categorias Principais */}
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Categorias
          </p>

          <div className="mt-3 grid gap-1.5">
            {menuCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/product?category=${category.slug}`}
                onClick={onClose}
                className="
                  group
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-zinc-300
                  transition-all
                  duration-200
                  hover:bg-zinc-900
                  hover:text-pink-500
                "
              >
                {category.name}

                <ChevronRight
                  size={16}
                  className="text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-pink-500"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Admin */}
        {isAdmin && (
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <Link
              href="/admin"
              onClick={onClose}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-pink-500/30
                bg-pink-500/10
                px-6
                py-3.5
                text-sm
                font-semibold
                text-pink-500
                transition-all
                duration-300
                hover:bg-pink-500
                hover:text-white
              "
            >
              <Shield size={18} />
              Administração
            </Link>
          </div>
        )}

        {/* Conta - mostra Minha Conta se autenticado, Entrar se não */}
        <div className="mt-6 border-t border-zinc-800 pt-6">
          {isAuthenticated ? (
            <Link
              href="/account"
              onClick={onClose}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-pink-500
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-pink-600
              "
            >
              <UserCircle2 size={18} />
              Minha Conta
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-pink-500
                px-6
                py-3.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-pink-600
              "
            >
              Iniciar Sessão
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}