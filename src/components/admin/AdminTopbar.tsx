// components/admin/layout/AdminTopbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle2, Menu } from "lucide-react";
import { AdminNotifications } from "./AdminNotifications";
import AdminMobileMenu from "./AdminMobileMenu"; // ✅ Importa o menu

interface AdminTopbarProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

const routeTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Produtos",
  "/admin/categories": "Categorias",
  "/admin/brands": "Marcas",
  "/admin/orders": "Encomendas",
  "/admin/customers": "Clientes",
  "/admin/roles": "Cargos",
  "/admin/suppliers": "Fornecedor",
  "/admin/coupons": "Cupões",
  "/admin/settings": "Definições",
  "/admin/profile": "Perfil",
};

export default function AdminTopbar({
  userName = "Admin",
  userEmail = "Administrador",
  userRole = "Administrador",
}: AdminTopbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ Estado do menu mobile

  const matchedRoute = Object.keys(routeTitles)
    .filter((route) => pathname === route || pathname.startsWith(route + "/"))
    .sort((a, b) => b.length - a.length)[0];

  const currentTitle = matchedRoute ? routeTitles[matchedRoute] : "Admin";

  return (
    <>
      <header
        className="
          sticky top-0 z-30
          mb-4 lg:mb-8
          flex h-14 lg:h-16 items-center justify-between
          rounded-2xl border border-zinc-200 bg-white
          px-3 lg:px-6
          shadow-sm
        "
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* LADO ESQUERDO: Botão mobile + Título */}
        <div className="flex items-center gap-3">
          {/* Botão Hambúrguer (só mobile) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-500 transition hover:bg-pink-100 cursor-pointer"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-base font-bold text-zinc-800 lg:text-lg">
            {currentTitle}
          </h2>
        </div>

        {/* LADO DIREITO: Notificações e Utilizador */}
        <div className="flex items-center gap-2 lg:gap-5">
          <AdminNotifications />

          <Link
            href="/admin/profile"
            className="flex items-center gap-2 lg:gap-3 rounded-xl px-2 py-1 transition-colors hover:bg-pink-50"
            title="Ir para o perfil"
          >
            <UserCircle2
              size={28}
              className="lg:size-9 text-pink-500 shrink-0"
            />

            <div className="hidden lg:block">
              <p
                className="text-sm font-semibold"
                style={{ color: "#18181b" }}
              >
                {userName}
              </p>

              <p
                className="text-xs"
                style={{ color: "#71717a" }}
              >
                {userRole}
              </p>
            </div>
          </Link>
        </div>
      </header>

      <AdminMobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
}