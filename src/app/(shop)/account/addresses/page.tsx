import { redirect } from "next/navigation";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AddressesContent } from "@/components/account/AddressesContent";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function AddressesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const addresses = await prisma.userAddress.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <main className="arabesque-bg relative min-h-screen overflow-hidden">
      <section className="container-custom w-full py-8 sm:py-10 md:py-14 lg:py-20">

        <AccountHeader
          title="As Minhas Moradas"
          description="Gere as tuas moradas de faturação e entrega."
        />

        <div className="mt-8 grid gap-8 md:mt-10 md:gap-10 lg:mt-14 lg:grid-cols-[280px_minmax(0,1fr)]">

          {/* SIDEBAR */}
          <aside className="min-w-0">
            <AccountSidebar />
          </aside>

          {/* CONTEÚDO */}
          <AddressesContent addresses={addresses} />

        </div>
      </section>
    </main>
  );
}
