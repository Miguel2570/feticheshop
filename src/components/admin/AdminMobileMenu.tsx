"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  FolderTree,
  BadgePercent,
  ShoppingCart,
  Users,
  Truck,
  Ticket,
  Settings,
  LogOut,
  UserCircle2,
  Menu,
  X,
} from "lucide-react";

const links = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Produtos", href: "/admin/products", icon: Package },
  { title: "Categorias", href: "/admin/categories", icon: FolderTree },
  { title: "Marcas", href: "/admin/brands", icon: BadgePercent },
  { title: "Encomendas", href: "/admin/orders", icon: ShoppingCart },
  { title: "Clientes", href: "/admin/customers", icon: Users },
  { title: "Fornecedor", href: "/admin/suppliers", icon: Truck },
  { title: "Cupões", href: "/admin/coupons", icon: Ticket },
  { title: "Definições", href: "/admin/settings", icon: Settings },
];

export default function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fechar ao mudar de página - usar callback no onClick em vez de effect
  const handleNavigate = () => {
    setIsOpen(false);
  };

  // Bloquear scroll quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        onClick={() => setIsOpen(true)}
        className="
          lg:hidden
          fixed
          top-4
          left-4
          z-40
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-pink-500
          text-white
          shadow-lg
          shadow-pink-500/25
          transition
          hover:bg-pink-600
          cursor-pointer
        "
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`
          lg:hidden
          fixed
          top-0
          left-0
          bottom-0
          z-50
          w-80
          bg-white
          border-r
          border-zinc-200
          shadow-2xl
          transform
          transition-transform
          duration-300
          ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER DO DRAWER */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#18181b" }}>
              Pleasure Shop
            </h2>
            <p className="text-xs" style={{ color: "#71717a" }}>
              Administração
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-zinc-100
              text-zinc-700
              transition
              hover:bg-pink-50
              hover:text-pink-500
              cursor-pointer
            "
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigate}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3.5
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                "
                style={{
                  backgroundColor: active ? "#ec4899" : "transparent",
                  color: active ? "#ffffff" : "#3f3f46",
                }}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}

          <div className="border-t border-zinc-100 my-2" />

          {/* PERFIL */}
          <Link
            href="/admin/profile"
            onClick={handleNavigate}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3.5
              py-3
              text-sm
              font-medium
              transition-all
              duration-200
            "
            style={{
              backgroundColor: pathname === "/admin/profile" ? "#ec4899" : "transparent",
              color: pathname === "/admin/profile" ? "#ffffff" : "#3f3f46",
            }}
          >
            <UserCircle2 size={18} className="shrink-0" />
            <span>Perfil</span>
          </Link>

          {/* LOGOUT */}
          <Link
            href="/logout"
            onClick={handleNavigate}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3.5
              py-3
              text-sm
              font-medium
              text-red-500
              transition-all
              duration-200
              hover:bg-red-50
            "
          >
            <LogOut size={18} className="shrink-0" />
            <span>Terminar Sessão</span>
          </Link>
        </nav>
      </div>
    </>
  );
}