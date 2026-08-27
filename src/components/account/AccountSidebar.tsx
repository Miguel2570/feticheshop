"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Shield,
  Heart,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "Encomendas", icon: Package },
  { href: "/wishlist", label: "Favoritos", icon: Heart },
  { href: "/account/addresses", label: "Moradas", icon: MapPin },
  { href: "/account/settings", label: "Definições", icon: Settings },
  { href: "/account/security", label: "Segurança", icon: Shield },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Chamar a API de logout
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirecionar para home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  };

  return (
    <aside 
      className="rounded-3xl border border-pink-200 p-5 shadow-sm"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="px-3 pb-5 pt-2">
        <h2 
          className="text-xl font-bold"
          style={{ color: "#18181b" }}
        >
          Minha Conta
        </h2>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200"
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
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-pink-100 pt-3">
        <button 
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium cursor-pointer transition-colors"
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
        </button>
      </div>
    </aside>
  );
}