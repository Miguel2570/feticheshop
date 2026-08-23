"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesChartProps {
  sales: {
    month: string;
    revenue: number;
  }[];
}

export function SalesChart({
  sales,
}: SalesChartProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-200
        bg-white
        p-8
        shadow-sm
      "
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: "#18181b" }}
          >
            Vendas
          </h2>

          <p 
            className="mt-2 text-sm"
            style={{ color: "#71717a" }}
          >
            Receita dos últimos 12 meses
          </p>
        </div>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={sales}>
            <defs>
              <linearGradient
                id="salesGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#ff2e88"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#ff2e88"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e4e4e7"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#71717a",
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#71717a",
              }}
              tickFormatter={(value) =>
                `€${value}`
              }
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e4e4e7",
                borderRadius: 18,
                color: "#18181b",
                boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
              }}
              formatter={(value: unknown) => [
                `€${Number(value).toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                })}`,
                "Receita",
              ]}
              labelStyle={{
                color: "#18181b",
                fontWeight: 600,
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ff2e88"
              strokeWidth={4}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}