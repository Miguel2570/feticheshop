import {
  Heart,
  MapPin,
  Package,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function AccountStats() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [ordersCount, wishlistCount, addressesCount] = await Promise.all([
    prisma.order.count({
      where: { userId: user.id },
    }),
    prisma.wishlistItem.count({
      where: {
        wishlist: {
          userId: user.id,
        },
      },
    }),
    prisma.userAddress.count({
      where: { userId: user.id },
    }),
  ]);

  const stats = [
    { title: "Encomendas", value: ordersCount, icon: Package },
    { title: "Favoritos", value: wishlistCount, icon: Heart },
    { title: "Moradas", value: addressesCount, icon: MapPin },
    { title: "Pontos", value: 0, icon: Star },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="
              group
              rounded-2xl
              border
              border-pink-100
              bg-white
              p-5
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-pink-300
              hover:shadow-lg
              hover:shadow-pink-500/10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-500 transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}