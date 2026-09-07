import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom flex min-h-[85vh] items-center justify-center py-20">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">
              Verificação
            </p>

            <h1 className="section-title">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Confirmar Email
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-zinc-600">
              Introduz o código enviado para o teu email para ativares a tua conta.
            </p>
          </div>

          <VerifyEmailForm />
        </div>
      </section>
    </main>
  );
}