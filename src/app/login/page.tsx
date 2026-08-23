import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[85vh] items-center justify-center py-20">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">
              Bem-vindo de volta
            </p>

            <h1 className="section-title mt-4">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Iniciar Sessão
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-zinc-600">
              Acede à tua conta para acompanhar encomendas,
              favoritos e muito mais.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}