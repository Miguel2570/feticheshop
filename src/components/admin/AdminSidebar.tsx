"use client";

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
} from "lucide-react";

const links = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Marcas",
    href: "/admin/brands",
    icon: BadgePercent,
  },
  {
    title: "Encomendas",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Clientes",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Fornecedor",
    href: "/admin/suppliers",
    icon: Truck,
  },
  {
    title: "Cupões",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    title: "Definições",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden
        lg:flex
        sticky
        top-0
        h-screen
        w-64
        flex-col
        border-r
        border-zinc-200
        shrink-0
      "
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Logo */}
      <div className="border-b border-zinc-100 px-5 py-5 shrink-0">
        <h1
          className="text-lg font-bold"
          style={{ color: "#18181b" }}
        >
          Pleasure Shop
        </h1>

        <p
          className="mt-0.5 text-xs"
          style={{ color: "#71717a" }}
        >
          Administração
        </p>
      </div>

      {/* Navegação */}
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
              className="
                flex
                items-center
                gap-3
                rounded-xl
                px-3.5
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200
              "
              style={{
                backgroundColor: active ? "#ec4899" : "transparent",
                color: active ? "#ffffff" : "#3f3f46",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "#fdf2f8";
                  e.currentTarget.style.color = "#ec4899";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#3f3f46";
                }
              }}
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* SEPARADOR */}
        <div className="border-t border-zinc-100 my-2" />

        {/* PERFIL DO ADMINISTRADOR */}
        <Link
          href="/admin/profile"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3.5
            py-2.5
            text-sm
            font-medium
            transition-all
            duration-200
          "
          style={{
            backgroundColor: pathname === "/admin/profile" ? "#ec4899" : "transparent",
            color: pathname === "/admin/profile" ? "#ffffff" : "#3f3f46",
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/admin/profile") {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/admin/profile") {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#3f3f46";
            }
          }}
        >
          <UserCircle2 size={18} className="shrink-0" />
          <span>Perfil</span>
        </Link>
      </nav>

      {/* Footer - Logout */}
      <div className="border-t border-zinc-100 p-3 shrink-0">
        <Link
          href="/logout"
          className="
            flex
            items-center
            gap-3
            rounded-xl
            px-3.5
            py-2.5
            text-sm
            font-medium
            transition-all
            duration-200
            cursor-pointer
          "
          style={{ color: "#ef4444" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <LogOut size={18} className="shrink-0" />
          <span>Terminar Sessão</span>
        </Link>
      </div>
    </aside>
  );
}