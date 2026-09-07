import { getCurrentUser } from "@/lib/auth";
import { User2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VIPBadge } from "./VIPBadge";

type AccountHeaderProps = {
  title?: string;
  description?: string;
};

export async function AccountHeader({
  title = "Minha Conta",
  description = "Gere o teu perfil e encomendas.",
}: AccountHeaderProps) {
  const user = await getCurrentUser();

  let vipLevel = "BRONZE";
  let totalSpent = 0;

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { vipLevel: true, totalSpent: true },
    });

    if (dbUser) {
      vipLevel = dbUser.vipLevel;
      totalSpent = dbUser.totalSpent;
    }
  }

  const vipThresholds = {
    BRONZE: { next: "Prata", target: 250 },
    SILVER: { next: "Ouro", target: 750 },
    GOLD: { next: null, target: 0 },
  };

  const vipInfo = vipThresholds[vipLevel as keyof typeof vipThresholds] || vipThresholds.BRONZE;
  const progressPercent = vipInfo.target > 0 
    ? Math.min(100, (totalSpent / vipInfo.target) * 100)
    : 100;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 to-brand-wine p-6 sm:p-8 shadow-xl shadow-pink-500/20">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Título à esquerda */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
            Área de Cliente
          </p>

          <h1 className="mt-2 font-display text-4xl text-white">
            {title}
          </h1>

          <p className="mt-3 max-w-xl text-white/90">
            {description}
          </p>
        </div>

        {/* ✅ 2 colunas - Perfil mais largo, VIP mais compacto */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
          {/* Coluna 1: Perfil - largura flexível */}
          <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-lg sm:min-w-[280px]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User2 size={28} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-zinc-900 truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Utilizador"}
              </p>
              <p className="text-sm text-zinc-600 break-all">
                {user?.email ?? "Sem email"}
              </p>
            </div>
          </div>

          {/* Coluna 2: VIP + Barra */}
          <div className="rounded-2xl bg-white px-5 py-4 shadow-lg flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <VIPBadge level={vipLevel} />
              <span className="text-xs text-zinc-500">
                €{totalSpent.toFixed(0)} / €{vipInfo.target > 0 ? vipInfo.target : "—"}
              </span>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  vipLevel === "GOLD"
                    ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                    : vipLevel === "SILVER"
                    ? "bg-gradient-to-r from-zinc-400 to-zinc-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              {vipLevel === "GOLD" ? (
                "👑 Nível máximo!"
              ) : (
                <>Faltam <strong className="text-zinc-700">€{(vipInfo.target - totalSpent).toFixed(0)}</strong> para {vipInfo.next}</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}