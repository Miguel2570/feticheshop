import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <main className="bg-[#090909] text-white">
      <section className="container-custom flex min-h-[85vh] items-center justify-center py-20">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">
              Verificação
            </p>

            <h1 className="section-title">
              Confirmar
              <span className="text-gradient">
                {" "}Email
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-zinc-400">
              Introduz o código enviado para o teu email para ativares a tua conta.
            </p>
          </div>

          <VerifyEmailForm />
        </div>
      </section>
    </main>
  );
}