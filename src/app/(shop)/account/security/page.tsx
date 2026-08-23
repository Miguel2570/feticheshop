import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { SecurityForm } from "@/components/account/SecurityForm";

export default function AccountSecurityPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <AccountHeader
          title="Segurança"
          description="Altera a tua palavra-passe e mantém a tua conta protegida."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />

          <SecurityForm />
        </div>
      </section>
    </main>
  );
}