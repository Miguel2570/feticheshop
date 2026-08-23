import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

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

  // Verifica se é admin
  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  if (!isAdmin) {
    redirect("/login?redirect=/admin");
  }

  return (
    <div 
      className="flex min-h-screen"
      style={{ backgroundColor: "#fafafa" }}
    >
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <div className="p-4 pb-0">
          <AdminTopbar
            userName={user ? `${user.firstName} ${user.lastName}` : "Admin"}
            userRole={user ? roleLabels[user.role] ?? user.role : "Administrador"}
          />
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}