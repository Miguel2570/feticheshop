"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ChevronDown,
  Heart,
  Menu,
  Search as SearchIcon,
  Shield,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
}

interface NavbarClientProps {
  categories: NavbarCategory[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasNewProducts: boolean;
  hasSaleProducts: boolean;
}

export function NavbarClient({
  categories,
  isAuthenticated,
  isAdmin,
  hasNewProducts,
  hasSaleProducts,
}: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // ✅ Adicionado wishlistLoading para evitar hidratação incorreta
  const { count: wishlistCount, openWishlist, loading: wishlistLoading } = useWishlist();
  const { itemCount: cartCount, openCart } = useCart();

  const menuCategories = [
    { name: "Sex Toys", slug: "sex-toys" },
    { name: "Para o Pénis", slug: "para-ele" },
    { name: "Saúde e Bem-Estar", slug: "essenciais" },
    { name: "Lingerie", slug: "roupa" },
    { name: "BDSM", slug: "bdsm" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800 bg-black/90 backdrop-blur-xl"
          : "bg-black"
      }`}
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="mx-auto max-w-[1500px] px-10">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* ESQUERDA - LOGO + CATEGORIAS */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="relative h-12 w-36 shrink-0"
              aria-label="Fetiche Shop"
            >
              <Image
                src="/images/logo_sexshop3.png"
                alt="Fetiche Shop"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </Link>

            {/* CATEGORIAS PRINCIPAIS COM HOVER */}
            <nav className="hidden items-center gap-6 xl:flex">
              {menuCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onMouseEnter={() => {
                    setActiveCategory(cat.slug);
                    setSearchOpen(false);
                  }}
                  onClick={() => {
                    setActiveCategory(activeCategory === cat.slug ? null : cat.slug);
                  }}
                  className={`
                    flex items-center gap-1
                    text-sm font-semibold
                    transition
                    cursor-pointer
                    whitespace-nowrap
                    ${
                      activeCategory === cat.slug
                        ? "text-pink-500"
                        : "text-zinc-300 hover:text-pink-500"
                    }
                  `}
                >
                  {cat.name}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      activeCategory === cat.slug ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* DIREITA - PESQUISA + AÇÕES */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* PESQUISA INLINE */}
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Pesquisar"
                onClick={() => setSearchOpen((value) => !value)}
                className="rounded-full p-2.5 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500 cursor-pointer"
              >
                {searchOpen ? <X size={22} /> : <SearchIcon size={22} />}
              </button>

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ease-in-out
                  ${searchOpen ? "w-72 opacity-100" : "w-0 opacity-0"}
                `}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchValue.trim()) {
                      window.location.href = `/product?search=${encodeURIComponent(searchValue.trim())}`;
                    }
                  }}
                  placeholder="Pesquisar produtos..."
                  className="
                    h-10
                    w-full
                    rounded-full
                    border
                    border-zinc-700
                    bg-zinc-900
                    pl-5
                    pr-5
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-zinc-500
                    focus:border-pink-500
                  "
                />
              </div>
            </div>

            {/* ADMIN */}
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Administração"
                title="Administração"
                className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2.5 text-sm font-semibold text-pink-500 transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <Shield size={18} />
                <span>Admin</span>
              </Link>
            )}

            {/* CONTA / LOGIN */}
            {isAuthenticated ? (
              <Link
                href="/account"
                aria-label="A minha conta"
                title="A minha conta"
                className="rounded-full p-2.5 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500"
              >
                <User size={22} />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Iniciar sessão"
                title="Iniciar sessão"
                className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-500"
              >
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}

            {/* FAVORITOS - ✅ ABRE O MODAL */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label="Abrir favoritos"
              title="Favoritos"
              className="relative rounded-full p-2.5 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500 cursor-pointer"
            >
              <Heart
                size={22}
                className="text-zinc-200"
              />
              {/* ✅ Badge escondido durante carregamento (evita hidratação) */}
              {wishlistCount > 0 && !wishlistLoading && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>

            {/* CARRINHO - ✅ ABRE O SIDE PANEL */}
            <button
              type="button"
              onClick={openCart}
              aria-label="Abrir carrinho"
              title="Carrinho"
              className="relative rounded-full p-2.5 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500 cursor-pointer"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* MOBILE */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="ml-auto rounded-full p-2 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500 lg:hidden cursor-pointer"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MEGA MENU - ABRE POR CATEGORIA */}
      <MegaMenu
        activeCategory={activeCategory}
        onClose={() => setActiveCategory(null)}
      />

      {/* MOBILE MENU */}
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        hasNewProducts={hasNewProducts}
        hasSaleProducts={hasSaleProducts}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
}