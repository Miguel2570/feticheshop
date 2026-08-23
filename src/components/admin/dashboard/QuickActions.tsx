"use client";

import Link from "next/link";

import {
  Package,
  ShoppingCart,
  Tags,
  UserPlus,
} from "lucide-react";

const actions = [
  {
    title: "Novo Produto",
    description: "Adicionar produto",
    href: "/admin/products/new",
    icon: Package,
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    title: "Nova Encomenda",
    description: "Ver encomendas",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Novo Cupão",
    description: "Criar promoção",
    href: "/admin/coupons/new",
    icon: Tags,
    color: "from-orange-500 to-yellow-500",
  },
  {
    title: "Novo Cliente",
    description: "Lista de clientes",
    href: "/admin/customers",
    icon: UserPlus,
    color: "from-emerald-500 to-green-500",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.title}
            href={action.href}
            className="
              group
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-zinc-200
              bg-white
              px-5
              py-3
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-pink-300
              hover:shadow-[0_8px_25px_rgba(255,46,136,.10)]
            "
          >
            <div
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                ${action.color}
                text-white
                shadow-lg
              `}
            >
              <Icon size={20} />
            </div>

            <div>
              <p 
                className="font-semibold"
                style={{ color: "#18181b" }}
              >
                {action.title}
              </p>

              <p 
                className="text-xs"
                style={{ color: "#71717a" }}
              >
                {action.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}