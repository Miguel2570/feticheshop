import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="bg-[#090909] text-white">
      <section className="container-custom flex min-h-[85vh] items-center justify-center py-20">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <p className="section-eyebrow">
              Nova Palavra-passe
            </p>

            <h1 className="section-title">
              Redefinir
              <span className="text-gradient">
                {" "}Palavra-passe
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-zinc-400">
              Introduz uma nova palavra-passe para voltares a
              aceder à tua conta em segurança.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}