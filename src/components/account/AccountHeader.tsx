import { getCurrentUser } from "@/lib/auth";
import { User2 } from "lucide-react";

type AccountHeaderProps = {
  title?: string;
  description?: string;
};

export async function AccountHeader({
  title = "Minha Conta",
  description = "Gere o teu perfil e encomendas.",
}: AccountHeaderProps) {
  const user = await getCurrentUser();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 to-brand-wine p-8 shadow-xl shadow-pink-500/20">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-lg">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-500 overflow-hidden">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User2 size={28} />
            )}
          </div>

          <div>
            <p className="font-bold text-zinc-900">
              {user ? `${user.firstName} ${user.lastName}` : "Utilizador"}
            </p>

            <p className="text-sm font-medium text-zinc-600">
              {user?.email ?? "Sem email"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}