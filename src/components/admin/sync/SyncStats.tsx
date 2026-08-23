interface SyncStatsProps {
  imported: number;
  updated: number;
  failed: number;
  elapsed: string;
}

export function SyncStats({
  imported,
  updated,
  failed,
  elapsed,
}: SyncStatsProps) {
  const stats = [
    { label: "Importados", value: imported, color: "#059669" },
    { label: "Atualizados", value: updated, color: "#ec4899" },
    { label: "Erros", value: failed, color: "#ef4444" },
    { label: "Tempo", value: elapsed, color: "#18181b" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm" style={{ color: "#71717a" }}>
            {stat.label}
          </p>
          <p className="mt-3 text-4xl font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}