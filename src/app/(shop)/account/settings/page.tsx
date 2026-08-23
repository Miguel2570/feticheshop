import { redirect } from "next/navigation";

import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SettingsForm } from "@/components/account/SettingsForm";

import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <AccountHeader
          title="Dados Pessoais"
          description="Atualiza as informações da tua conta."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />

          <SettingsForm
            defaultValues={{
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
              email: user.email,
              phone: user.phone ?? "",
              birthDate: "",
            }}
          />
        </div>
      </section>
    </main>
  );
}