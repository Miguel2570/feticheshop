import { getDashboard } from "@/actions/dashboard/getDashboard";

import { DashboardCards } from "@/components/admin/dashboard/DashboardCards";
import { SalesChart } from "@/components/admin/dashboard/SalesChart";

export default async function AdminDashboard() {
  const result = await getDashboard();

  if (!result.success || !result.data) {
    return (
      <div 
        className="rounded-2xl border border-red-200 bg-red-50 p-8"
        style={{ color: "#ef4444" }}
      >
        Erro ao carregar Dashboard.
      </div>
    );
  }

  const dashboard = result.data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 
          className="text-3xl font-bold"
          style={{ color: "#18181b" }}
        >
          Dashboard
        </h1>

        <p 
          className="mt-1"
          style={{ color: "#71717a" }}
        >
          Bem-vindo ao painel de administração.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <DashboardCards
        cards={dashboard.cards}
      />

      {/* Gráfico de vendas */}
      <SalesChart
        sales={dashboard.sales}
      />
    </div>
  );
}