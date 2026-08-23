"use client";

import {
  Search,
  UserCircle2,
} from "lucide-react";

import { AdminNotifications } from "./AdminNotifications";

interface AdminTopbarProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
}

export default function AdminTopbar({
  userName = "Admin",
  userEmail = "Administrador",
  userRole = "Administrador",
}: AdminTopbarProps) {
  return (
    <header 
      className="sticky top-0 z-40 mb-8 flex h-16 items-center justify-between rounded-2xl border border-zinc-200 bg-white px-6 shadow-sm"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Pesquisa */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "#a1a1aa" }}
        />

        <input
          placeholder="Pesquisar..."
          className="
            w-full
            rounded-xl
            border
            border-zinc-200
            bg-zinc-50
            py-2
            pl-10
            pr-4
            text-sm
            outline-none
            transition
            focus:border-pink-500
            focus:ring-2
            focus:ring-pink-200
          "
          style={{ color: "#18181b" }}
        />
      </div>

      {/* Ações */}
      <div className="flex items-center gap-5">
        {/* Notificações */}
        <AdminNotifications />

        {/* Utilizador */}
        <div className="flex items-center gap-3">
          <UserCircle2
            size={36}
            className="text-pink-500"
          />

          <div>
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
        </div>
      </div>
    </header>
  );
}