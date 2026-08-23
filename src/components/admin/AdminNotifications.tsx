"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Usa useCallback para a função
  const loadNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }, []);

  async function markAllRead() {
    try {
      await fetch("/api/admin/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Erro ao marcar notificações:", error);
    }
  }

  // Carrega notificações de forma assíncrona
  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => clearTimeout(timeout);
  }, [loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const typeColors: Record<string, string> = {
    stock_low: "bg-yellow-50 text-yellow-600",
    new_order: "bg-emerald-50 text-emerald-600",
    new_user: "bg-sky-50 text-sky-600",
    sync_error: "bg-red-50 text-red-500",
    sync_success: "bg-pink-50 text-pink-600",
  };

  const typeLabels: Record<string, string> = {
    stock_low: "Stock Baixo",
    new_order: "Nova Encomenda",
    new_user: "Novo Cliente",
    sync_error: "Erro Sync",
    sync_success: "Sync OK",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer"
        aria-label="Notificações"
      >
        <Bell size={22} style={{ color: "#3f3f46" }} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-2xl border border-zinc-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <p className="text-sm font-semibold" style={{ color: "#18181b" }}>
              Notificações
            </p>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-pink-500 hover:text-pink-600 cursor-pointer"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm" style={{ color: "#71717a" }}>
                Sem notificações
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-zinc-50 px-4 py-3 transition hover:bg-zinc-50 ${
                    !notification.isRead ? "bg-pink-50/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#18181b" }}>
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="mt-0.5 text-xs" style={{ color: "#71717a" }}>
                          {notification.message}
                        </p>
                      )}
                    </div>

                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-pink-500 mt-1.5" />
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        typeColors[notification.type] ?? "bg-zinc-50 text-zinc-500"
                      }`}
                    >
                      {typeLabels[notification.type] ?? notification.type}
                    </span>

                    <span className="text-[10px]" style={{ color: "#a1a1aa" }}>
                      {new Date(notification.createdAt).toLocaleString("pt-PT")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            href="/admin/notifications"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-center text-xs font-medium text-pink-500 hover:text-pink-600 border-t border-zinc-100"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}