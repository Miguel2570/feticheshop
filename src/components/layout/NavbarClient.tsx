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
import { Search } from "./Search";

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
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { count: wishlistCount } = useWishlist();
  const { itemCount: cartCount } = useCart();

  const links = [
    { href: "/product", label: "Produtos" },
    ...(hasNewProducts ? [{ href: "/new", label: "Novidades" }] : []),
    ...(hasSaleProducts ? [{ href: "/sale", label: "Promoções" }] : []),
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
    >
      {/* Usar o mesmo container-custom da TopBar */}
      <div className="mx-auto max-w-[1545px] px-10">
        <div className="flex h-24 items-center justify-between">
          {/* ESQUERDA - LOGO + NAVEGAÇÃO */}
          <div className="flex items-center gap-10 lg:gap-14">
            {/* LOGO */}
            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="Fetiche Shop"
            >
              <Image
                src="/images/logo_sexshop2.png"
                alt="Fetiche Shop"
                width={1024}
                height={1024}
                className="h-20 w-auto object-contain"
                priority
              />
            </Link>

            {/* NAVEGAÇÃO DESKTOP */}
            <nav className="hidden items-center gap-8 xl:flex">
              {/* CATEGORIAS */}
              <button
                type="button"
                onMouseEnter={() => {
                  setMegaOpen(true);
                  setSearchOpen(false);
                }}
                onClick={() => setMegaOpen((value) => !value)}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-medium
                  text-zinc-300
                  transition
                  hover:text-pink-500
                  cursor-pointer
                "
              >
                Categorias
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    megaOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* OUTROS LINKS */}
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setMegaOpen(false)}
                  className="
                    text-sm
                    font-medium
                    text-zinc-300
                    transition
                    hover:text-pink-500
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* DIREITA - AÇÕES */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* PESQUISA */}
            <button
              type="button"
              aria-label={searchOpen ? "Fechar pesquisa" : "Abrir pesquisa"}
              title="Pesquisar"
              onClick={() => {
                setSearchOpen((value) => !value);
                setMegaOpen(false);
              }}
              className="
                rounded-full
                p-2.5
                text-zinc-200
                transition
                hover:bg-zinc-900
                hover:text-pink-500
                cursor-pointer
              "
            >
              {searchOpen ? <X size={22} /> : <SearchIcon size={22} />}
            </button>

            {/* ADMIN */}
            {isAdmin && (
              <Link
                href="/admin"
                aria-label="Administração"
                title="Administração"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-pink-500/30
                  bg-pink-500/10
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-pink-500
                  transition
                  hover:border-pink-500
                  hover:bg-pink-500
                  hover:text-white
                "
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
                className="
                  rounded-full
                  p-2.5
                  text-zinc-200
                  transition
                  hover:bg-zinc-900
                  hover:text-pink-500
                "
              >
                <User size={22} />
              </Link>
            ) : (
              <Link
                href="/login"
                aria-label="Iniciar sessão"
                title="Iniciar sessão"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-zinc-800
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-zinc-200
                  transition
                  hover:border-pink-500
                  hover:bg-pink-500/10
                  hover:text-pink-500
                "
              >
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}

            {/* FAVORITOS */}
            <Link
              href="/wishlist"
              aria-label="Os meus favoritos"
              title="Favoritos"
              className="
                relative
                rounded-full
                p-2.5
                text-zinc-200
                transition
                hover:bg-zinc-900
                hover:text-pink-500
              "
            >
              <Heart
                size={22}
                className={
                  wishlistCount > 0
                    ? "fill-pink-500 text-pink-500"
                    : "text-zinc-200"
                }
              />

              {wishlistCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-pink-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* CARRINHO */}
            <Link
              href="/cart"
              aria-label="Carrinho"
              title="Carrinho"
              className="
                relative
                rounded-full
                p-2.5
                text-zinc-200
                transition
                hover:bg-zinc-900
                hover:text-pink-500
              "
            >
              <ShoppingBag size={22} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-pink-500
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* MOBILE */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => {
              setOpen((value) => !value);
              setSearchOpen(false);
            }}
            className="
              ml-auto
              rounded-full
              p-2
              text-zinc-200
              transition
              hover:bg-zinc-900
              hover:text-pink-500
              lg:hidden
              cursor-pointer
            "
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* PESQUISA EXPANDIDA */}
      <div
        className={`
          arabesque-bg
          overflow-hidden
          border-t
          border-pink-100
          transition-all
          duration-300
          ${
            searchOpen
              ? "max-h-32 opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >
        <div className="container-custom">
          <div className="py-4">
            <div className="mx-auto w-full max-w-3xl">
              <Search />
            </div>
          </div>
        </div>
      </div>

      {/* MEGA MENU */}
      <MegaMenu
        categories={categories}
        open={megaOpen}
        onClose={() => setMegaOpen(false)}
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