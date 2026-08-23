"use client";

import {
  CreditCard,
  Lock,
  RotateCcw,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  Package,
} from "lucide-react";

export function ProductActions() {
  const actions = [
    {
      icon: Truck,
      title: "Entrega Discreta",
      description: "Embalagem totalmente anónima sem qualquer referência ao conteúdo.",
    },
    {
      icon: Lock,
      title: "Pagamento Seguro",
      description: "Pagamentos protegidos com encriptação SSL e métodos seguros.",
    },
    {
      icon: RotateCcw,
      title: "Devolução Fácil",
      description: "30 dias para devolução caso o produto cumpra os requisitos.",
    },
    {
      icon: ShieldCheck,
      title: "Qualidade Garantida",
      description: "Produtos originais das melhores marcas internacionais.",
    },
    {
      icon: CreditCard,
      title: "Pagamento Flexível",
      description: "MB Way, Multibanco, Cartão, PayPal e muito mais.",
    },
    {
      icon: Heart,
      title: "Atendimento Personalizado",
      description: "Suporte dedicado para esclarecer todas as tuas dúvidas.",
    },
    {
      icon: Star,
      title: "Produtos Premium",
      description: "Selecionamos apenas marcas reconhecidas pela sua qualidade.",
    },
    {
      icon: Package,
      title: "Envio Rápido",
      description: "Processamos e enviamos a tua encomenda no mesmo dia útil.",
    },
  ];

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom py-16">
        <div className="mb-10 text-center">
          <p className="section-eyebrow text-sm font-medium uppercase tracking-wider text-brand-magenta">
            Porque comprar connosco
          </p>

          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Confiança & Qualidade
            </span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-pink-100
                  bg-pink-50/50
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-pink-200
                  hover:bg-pink-50
                  hover:shadow-[0_8px_30px_rgba(255,46,136,.08)]
                "
              >
                {/* Glow sutil no hover */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-pink-200/30 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div
                  className="
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-pink-500
                    shadow-sm
                    transition-all
                    duration-300
                    group-hover:scale-110
                    group-hover:bg-pink-500
                    group-hover:text-white
                    group-hover:shadow-[0_4px_16px_rgba(255,46,136,.30)]
                  "
                >
                  <Icon size={22} />
                </div>

                <h3 className="text-base font-bold text-zinc-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}