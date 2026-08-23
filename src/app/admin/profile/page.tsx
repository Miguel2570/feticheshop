import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";

import {
  UserCircle2,
  Mail,
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Administrador",
    ADMIN: "Administrador",
    MANAGER: "Gestor",
    CUSTOMER: "Cliente",
  };

  const infoItems = [
    {
      icon: UserCircle2,
      label: "Nome",
      value: `${user.firstName} ${user.lastName}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email,
    },
    {
      icon: Shield,
      label: "Perfil",
      value: roleLabels[user.role] ?? user.role,
      isBadge: true,
    },
    {
      icon: CheckCircle2,
      label: "Estado",
      value: user.isActive ? "Ativo" : "Inativo",
      isStatus: true,
      isActive: user.isActive,
    },
    {
      icon: Calendar,
      label: "Criado em",
      value: new Date(user.createdAt).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: Clock,
      label: "Último Login",
      value: user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Nunca",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER COM AVATAR */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-brand-wine p-6 shadow-lg">
        {/* Decoração de fundo */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <UserCircle2 size={36} className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-white/80 text-sm">
              {roleLabels[user.role] ?? user.role}
            </p>
          </div>
        </div>
      </div>

      {/* GRID DE INFORMAÇÕES */}
      <div className="grid gap-4 sm:grid-cols-2">
        {infoItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex items-center gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10">
                <Icon size={18} className="text-pink-500" />
              </div>

              <div className="min-w-0">
                <p className="text-xs" style={{ color: "#71717a" }}>
                  {item.label}
                </p>

                {item.isBadge ? (
                  <span className="mt-1 inline-block rounded-full bg-pink-50 border border-pink-200 px-3 py-0.5 text-xs font-semibold text-pink-600">
                    {item.value}
                  </span>
                ) : item.isStatus ? (
                  <span
                    className={`
                      mt-1 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold
                      ${
                        item.isActive
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-red-50 border-red-200 text-red-500"
                      }
                    `}
                  >
                    {item.value}
                  </span>
                ) : (
                  <p className="mt-0.5 text-sm font-medium truncate" style={{ color: "#18181b" }}>
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AÇÕES */}
      <div className="flex gap-3">
        <Link
          href="/account"
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            bg-pink-500 text-white
            hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
          "
        >
          Ir para a Minha Conta
        </Link>

        <Link
          href="/account/settings"
          className="
            inline-flex items-center justify-center
            h-10 px-5 text-sm font-semibold rounded-xl
            transition-all duration-200 cursor-pointer
            bg-pink-500 text-white
            hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25
          "
        >
          Editar Dados
        </Link>
      </div>
    </div>
  );
}