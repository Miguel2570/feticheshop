import { redirect } from "next/navigation";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { AddressCard } from "@/components/account/AddressCard";

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
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <AccountHeader
          title="As Minhas Moradas"
          description="Gere as tuas moradas de faturação e entrega."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />

          <div>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-display text-4xl text-zinc-900">
                  As Minhas Moradas
                </h1>

                <p className="mt-3 text-zinc-500">
                  Gere as tuas moradas de faturação e entrega.
                </p>
              </div>

              <button
                className="
                  inline-flex
                  h-14
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-500
                  px-8
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  cursor-pointer
                  hover:scale-105
                  hover:bg-pink-600
                  hover:shadow-[0_0_35px_rgba(255,46,136,.35)]
                "
              >
                + Nova Morada
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-pink-100 bg-white p-12 text-center shadow-sm">
                <p className="text-zinc-500">
                  Ainda não tens moradas guardadas.
                </p>
              </div>
            ) : (
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    name={`${address.firstName} ${address.lastName}`}
                    street={address.addressLine1}
                    postalCode={address.postalCode}
                    city={address.city}
                    country={address.country}
                    phone={address.phone}
                    isDefault={address.isDefault}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}