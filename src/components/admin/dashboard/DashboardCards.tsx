"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

interface DashboardCardsProps {
  cards: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
  };
}

export function DashboardCards({
  cards,
}: DashboardCardsProps) {
  const items = [
    {
      title: "Receita",
      value: `€${cards.revenue.toLocaleString("pt-PT", {
        minimumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "from-pink-500 to-fuchsia-500",
    },
    {
      title: "Encomendas",
      value: cards.orders.toLocaleString("pt-PT"),
      icon: ShoppingCart,
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "Clientes",
      value: cards.customers.toLocaleString("pt-PT"),
      icon: Users,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Produtos",
      value: cards.products.toLocaleString("pt-PT"),
      icon: Package,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-zinc-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-pink-300
              hover:shadow-[0_8px_30px_rgba(255,46,136,.10)]
            "
          >
            <div
              className={`
                absolute
                right-0
                top-0
                h-32
                w-32
                rounded-full
                bg-gradient-to-br
                ${item.color}
                opacity-10
                blur-3xl
                transition-all
                duration-500
                group-hover:opacity-20
              `}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p 
                  className="text-sm"
                  style={{ color: "#71717a" }}
                >
                  {item.title}
                </p>

                <h2 
                  className="mt-3 text-4xl font-bold"
                  style={{ color: "#18181b" }}
                >
                  {item.value}
                </h2>
              </div>

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${item.color}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={28} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}