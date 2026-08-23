import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <AccountHeader />

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          <AccountSidebar />

          <div className="flex items-center justify-center rounded-2xl border border-pink-100 bg-white p-12 text-center shadow-sm">
            <div className="max-w-md">
              <h2 className="font-display text-3xl text-zinc-900">
                Bem-vindo à tua conta
              </h2>

              <p className="mt-4 text-zinc-500 leading-relaxed">
                Utiliza o menu ao lado para gerir as tuas encomendas, moradas e definições.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}