// app/admin/layout.tsx

import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";

interface AdminLayoutProps {
  children: ReactNode;
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Administrador",
  ADMIN: "Administrador",
  MANAGER: "Gestor",
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const user = await getCurrentUser();

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  if (!isAdmin) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div
      className="
        flex
        min-h-screen
        w-full
        max-w-full
        overflow-x-hidden
      "
      style={{
        backgroundColor: "#fafafa",
      }}
    >
      {/* =====================================================
          MENU MOBILE
      ===================================================== */}

      <AdminMobileMenu />

      {/* =====================================================
          SIDEBAR DESKTOP
      ===================================================== */}

      <aside className="hidden shrink-0 lg:block">
        <AdminSidebar />
      </aside>

      {/* =====================================================
          ÁREA PRINCIPAL
      ===================================================== */}

      <div
        className="
          flex
          min-w-0
          flex-1
          flex-col
          overflow-x-hidden
        "
      >
        {/* ===================================================
            TOPBAR
        =================================================== */}

        <div
          className="
            w-full
            min-w-0
            px-4
            pb-0
            pt-4

            sm:px-5

            lg:px-4
            lg:pt-4
          "
        >
          <AdminTopbar
            userName={
              user
                ? `${user.firstName} ${user.lastName}`
                : "Admin"
            }
            userRole={
              user
                ? roleLabels[user.role] ?? user.role
                : "Administrador"
            }
          />
        </div>

        {/* ===================================================
            CONTEÚDO
        =================================================== */}

        <main
          className="
            w-full
            min-w-0
            max-w-full
            flex-1
            overflow-x-hidden

            p-4
            pt-20

            sm:p-5
            sm:pt-20

            lg:p-6
            lg:pt-6
          "
        >
          <div
            className="
              w-full
              min-w-0
              max-w-full
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}