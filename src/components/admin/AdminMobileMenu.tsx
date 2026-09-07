"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = () => {
    setIsOpen(false);
  };

  async function handleLogout() {
    setLoading(true);
    try {
      await authClient.signOut();
      console.log("✅ Logout bem sucedido");
      setIsOpen(false);
      router.push("/"); // Redirecionar para home
      router.refresh();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setLoading(false);
    }
  }

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
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500 text-white shadow-lg shadow-pink-500/25 transition hover:bg-pink-600 cursor-pointer"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

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
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition hover:bg-pink-50 hover:text-pink-500 cursor-pointer"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

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
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
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

          <Link
            href="/admin/profile"
            onClick={handleNavigate}
            className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: pathname === "/admin/profile" ? "#ec4899" : "transparent",
              color: pathname === "/admin/profile" ? "#ffffff" : "#3f3f46",
            }}
          >
            <UserCircle2 size={18} className="shrink-0" />
            <span>Perfil</span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="
              flex
              w-full
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
              disabled:opacity-50
            "
          >
            <LogOut size={18} className="shrink-0" />
            <span>{loading ? "A terminar..." : "Terminar Sessão"}</span>
          </button>
        </nav>
      </div>
    </>
  );
}