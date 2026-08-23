"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui podes integrar com a tua API de newsletter
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom py-10 sm:py-14">
        <div className="newsletter-card rounded-3xl px-6 py-10 text-center sm:px-12 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <p className="section-eyebrow text-sm font-medium uppercase tracking-wider text-brand-magenta">
              Junta-te ao clube
            </p>

            <h2 className="section-title mt-3">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
                }}
              >
                Recebe Promoções Exclusivas
              </span>
            </h2>

            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              Subscreve a newsletter e recebe descontos, novidades e campanhas exclusivas.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3 md:flex-row"
            >
              {/* Campo de email com ícone */}
              <div className="relative w-full flex-1">
                <Mail
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-pink-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Insere o teu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    h-14
                    w-full
                    rounded-full
                    border-2
                    border-pink-300
                    bg-white
                    pl-14
                    pr-6
                    text-base
                    text-zinc-900
                    outline-none
                    transition-all
                    placeholder:text-zinc-400
                    hover:border-pink-400
                    focus:border-pink-500
                    focus:ring-4
                    focus:ring-pink-200
                  "
                />
              </div>

              {/* Botão de subscrição */}
              <button
                type="submit"
                className="
                  inline-flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-pink-500
                  px-8
                  text-base
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-pink-600
                  hover:shadow-[0_0_40px_rgba(255,46,136,.45)]
                  md:w-auto
                  md:min-w-[160px]
                "
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={20} />
                    Subscrito!
                  </>
                ) : (
                  <>
                    Subscrever
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-6 text-xs text-zinc-500">
              <span>✓ Sem spam</span>
              <span>✓ Cancela quando quiser</span>
              <span>✓ Ofertas exclusivas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}