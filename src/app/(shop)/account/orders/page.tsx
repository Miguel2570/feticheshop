import { redirect } from "next/navigation";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { OrderCard } from "@/components/account/OrderCard";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-14">
        <AccountHeader
          title="As minhas encomendas"
          description="Consulta todas as tuas encomendas e acompanha o estado."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
          <AccountSidebar />

          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-pink-100 bg-white p-12 text-center shadow-sm">
                <p className="text-zinc-500">
                  Ainda não tens encomendas.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  number={order.orderNumber}
                  status={order.status}
                  total={Number(order.total)}
                  createdAt={order.createdAt}
                  items={order.items.reduce((acc, item) => acc + item.quantity, 0)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}