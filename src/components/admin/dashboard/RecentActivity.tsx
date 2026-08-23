"use client";

import {
  Clock3,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

interface RecentActivityProps {
  activities: {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
  }[];
}

function getActivityIcon(title: string) {
  const value = title.toLowerCase();

  if (value.includes("order"))
    return {
      icon: ShoppingCart,
      color: "bg-sky-500/15 text-sky-600",
    };

  if (value.includes("product"))
    return {
      icon: Package,
      color: "bg-orange-500/15 text-orange-600",
    };

  if (value.includes("user"))
    return {
      icon: User,
      color: "bg-emerald-500/15 text-emerald-600",
    };

  return {
    icon: Clock3,
    color: "bg-pink-500/15 text-pink-600",
  };
}

export function RecentActivity({
  activities,
}: RecentActivityProps) {
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
      <h2 
        className="text-2xl font-bold"
        style={{ color: "#18181b" }}
      >
        Atividade
      </h2>

      <p 
        className="mt-2 text-sm"
        style={{ color: "#71717a" }}
      >
        Últimos acontecimentos
      </p>

      <div className="mt-8 space-y-6">
        {activities.map((activity) => {
          const { icon: Icon, color } =
            getActivityIcon(activity.title);

          return (
            <div
              key={activity.id}
              className="flex gap-4"
            >
              <div
                className={`
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  ${color}
                `}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 
                      className="font-semibold"
                      style={{ color: "#18181b" }}
                    >
                      {activity.title}
                    </h3>

                    <p 
                      className="mt-1 text-sm"
                      style={{ color: "#71717a" }}
                    >
                      {activity.description}
                    </p>
                  </div>

                  <span 
                    className="text-xs whitespace-nowrap"
                    style={{ color: "#a1a1aa" }}
                  >
                    {formatDistanceToNow(
                      new Date(activity.createdAt),
                      {
                        addSuffix: true,
                        locale: pt,
                      },
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-zinc-300
              py-12
              text-center
            "
          >
            <Clock3
              size={40}
              className="mx-auto mb-4 text-zinc-400"
            />

            <h3 
              className="text-lg font-semibold"
              style={{ color: "#18181b" }}
            >
              Sem atividade
            </h3>

            <p 
              className="mt-2"
              style={{ color: "#71717a" }}
            >
              A atividade recente aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}