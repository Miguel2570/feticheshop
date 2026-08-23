import { prisma } from "@/lib/prisma";

export default async function AdminNotificationsPage() {
  const notifications = await prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const typeLabels: Record<string, string> = {
    stock_low: "Stock Baixo",
    new_order: "Nova Encomenda",
    new_user: "Novo Cliente",
    sync_error: "Erro de Sincronização",
    sync_success: "Sincronização Concluída",
  };

  const typeColors: Record<string, string> = {
    stock_low: "bg-yellow-50 text-yellow-600 border-yellow-200",
    new_order: "bg-emerald-50 text-emerald-600 border-emerald-200",
    new_user: "bg-sky-50 text-sky-600 border-sky-200",
    sync_error: "bg-red-50 text-red-500 border-red-200",
    sync_success: "bg-pink-50 text-pink-600 border-pink-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "#18181b" }}>
          Notificações
        </h1>
        <p style={{ color: "#71717a" }}>
          Todas as notificações do painel
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <div className="py-12 text-center" style={{ color: "#71717a" }}>
            Sem notificações
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-4">
                <span
                  className={`mt-0.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                    typeColors[notification.type] ?? "bg-zinc-50 text-zinc-500 border-zinc-200"
                  }`}
                >
                  {typeLabels[notification.type] ?? notification.type}
                </span>

                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#18181b" }}>
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="mt-0.5 text-sm" style={{ color: "#71717a" }}>
                      {notification.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs" style={{ color: "#a1a1aa" }}>
                    {new Date(notification.createdAt).toLocaleString("pt-PT")}
                  </p>
                </div>

                {!notification.isRead && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-pink-500 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}