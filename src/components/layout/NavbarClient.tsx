"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: {
    name: string;
  } | null;
  images: {
    url: string;
  }[];
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
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

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

  // ✅ NÃO fechar resultados quando clica fora
  // A pesquisa só fecha quando: clica num produto, faz Enter, ou clica no X

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setShowResults(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.products ?? []);
        }
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      window.location.href = `/product?search=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setShowResults(false);
    setSearchValue("");
    setSearchResults([]);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-800 bg-black/90 backdrop-blur-xl"
          : "bg-black"
      }`}
      onMouseLeave={() => setActiveCategory(null)}
    >
      <div className="mx-auto max-w-[1545px] px-10">
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

            <nav className="hidden items-center gap-6 xl:flex">
              {menuCategories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onMouseEnter={() => {
                    setActiveCategory(cat.slug);
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
            {/* ✅ PESQUISA COM AUTOCOMPLETE */}
            <div ref={searchRef} className="relative flex items-center">
              <button
                type="button"
                aria-label="Pesquisar"
                onClick={() => {
                  if (searchOpen) {
                    // Fechar tudo
                    closeSearch();
                  } else {
                    setSearchOpen(true);
                  }
                }}
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
                  ${searchOpen ? "w-96 opacity-100" : "w-0 opacity-0"}
                `}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchValue.trim()) {
                      handleSearchSubmit();
                      closeSearch();
                    }
                    if (e.key === "Escape") {
                      setShowResults(false);
                    }
                  }}
                  onFocus={() => {
                    if (searchValue.trim().length >= 2) {
                      setShowResults(true);
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

              {/* ✅ RESULTADOS - MESMA LARGURA */}
              {showResults && searchValue.trim().length >= 2 && (
                <div className="absolute right-0 top-full mt-2 w-96 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            onClick={closeSearch}
                            className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 transition hover:bg-pink-50"
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-pink-50/50">
                              <Image
                                src={product.images?.[0]?.url ?? "/placeholder-product.png"}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-zinc-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {product.brand?.name ?? "Sem marca"}
                              </p>
                            </div>

                            <span className="shrink-0 text-sm font-bold text-pink-500">
                              €{Number(product.price || 0).toFixed(2)}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          handleSearchSubmit();
                          closeSearch();
                        }}
                        className="w-full bg-zinc-50 px-4 py-3 text-center text-sm font-semibold text-pink-500 transition hover:bg-pink-50 cursor-pointer"
                      >
                        Ver todos os resultados para &quot;{searchValue}&quot;
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-zinc-500">
                      Nenhum produto encontrado para &quot;{searchValue}&quot;
                    </div>
                  )}
                </div>
              )}
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

            {/* FAVORITOS */}
            <button
              type="button"
              onClick={openWishlist}
              aria-label="Abrir favoritos"
              title="Favoritos"
              className="relative rounded-full p-2.5 text-zinc-200 transition hover:bg-zinc-900 hover:text-pink-500 cursor-pointer"
            >
              <Heart size={22} className="text-zinc-200" />
              {wishlistCount > 0 && !wishlistLoading && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </button>

            {/* CARRINHO */}
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

      {/* MEGA MENU */}
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