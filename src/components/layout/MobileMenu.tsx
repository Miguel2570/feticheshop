"use client";

import Link from "next/link";
import { useState } from "react";
import { X, ChevronRight, ChevronDown, Shield, UserCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const menuCategories = [
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

export function MobileMenu({
  open,
  onClose,
  categories,
  hasNewProducts = false,
  hasSaleProducts = false,
  isAdmin = false,
  isAuthenticated = false,
}: MobileMenuProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const links = [
    { href: "/product", label: "Todos os Produtos" },
    ...(hasNewProducts ? [{ href: "/new", label: "Novidades" }] : []),
    ...(hasSaleProducts ? [{ href: "/sale", label: "Promoções" }] : []),
  ];

  const toggleCategory = (slug: string) => {
    setExpandedCategory((prev) => (prev === slug ? null : slug));
  };

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

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Categorias
          </p>

          <div className="mt-3 grid gap-1.5">
            {menuCategories.map((category) => {
              const isExpanded = expandedCategory === category.slug;

              return (
                <div key={category.slug}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.slug)}
                    className="
                      flex
                      w-full
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
                      cursor-pointer
                    "
                  >
                    {category.name}

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="shrink-0"
                    >
                      <ChevronDown
                        size={16}
                        className={isExpanded ? "text-pink-500" : "text-zinc-600"}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 grid gap-0.5 border-l border-zinc-800 pl-3">
                          {category.subCategories.map((subCat) => (
                            <motion.div
                              key={subCat.slug}
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Link
                                href={`/product?category=${category.slug}&subcategory=${subCat.slug}`}
                                onClick={onClose}
                                className="
                                  flex
                                  items-center
                                  justify-between
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-xs
                                  font-medium
                                  text-zinc-400
                                  transition-all
                                  duration-200
                                  hover:bg-zinc-900
                                  hover:text-pink-500
                                "
                              >
                                {subCat.name}

                                <ChevronRight
                                  size={14}
                                  className="text-zinc-600"
                                />
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

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