import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[85vh] items-center justify-center py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">
              Junta-te à Pleasure Shop
            </p>

            <h1 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Criar Conta
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-zinc-600">
              Cria a tua conta para acompanhar encomendas,
              guardar favoritos e desfrutar de uma experiência
              de compra mais rápida e personalizada.
            </p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}