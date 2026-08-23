"use client";

import {
  ShieldCheck,
  Truck,
  Headphones,
  BadgeCheck,
  Sparkles,
  Clock,
  Gift,
  Star,
} from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Entrega Discreta",
    description: "Todas as encomendas são enviadas em embalagens totalmente neutras.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento Seguro",
    description: "Métodos de pagamento protegidos e encriptados.",
  },
  {
    icon: BadgeCheck,
    title: "Produtos Premium",
    description: "Selecionamos apenas marcas reconhecidas pela sua qualidade.",
  },
  {
    icon: Headphones,
    title: "Apoio ao Cliente",
    description: "Estamos disponíveis para esclarecer qualquer dúvida.",
  },
  {
    icon: Sparkles,
    title: "Ofertas Exclusivas",
    description: "Descontos especiais e novidades para clientes VIP.",
  },
  {
    icon: Clock,
    title: "Entregas Rápidas",
    description: "Processamos e enviamos a tua encomenda no mesmo dia útil.",
  },
  {
    icon: Gift,
    title: "Brindes Especiais",
    description: "Recebe surpresas e mimos em compras selecionadas.",
  },
  {
    icon: Star,
    title: "Clientes Satisfeitos",
    description: "Milhares de clientes confiam na nossa qualidade e discrição.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom pt-10 pb-16 sm:pt-16">
        {/* Cabeçalho */}
        <div className="mb-8 sm:mb-12 text-center">
          <p className="section-eyebrow text-sm font-medium uppercase tracking-wider text-brand-magenta">
            Confiança & Qualidade
          </p>

          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Porque comprar connosco
            </span>
          </h2>
        </div>

        {/* Grelha: 2 colunas no mobile, 2 em tablet, 4 em desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-pink-100
                  bg-pink-50/50
                  p-4
                  sm:p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:border-pink-200
                  hover:bg-pink-50
                  hover:shadow-[0_8px_30px_rgba(255,46,136,.08)]
                  hover:-translate-y-1
                "
              >
                {/* Glow sutil no hover */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-pink-200/30 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div
                  className="
                    mb-3
                    sm:mb-4
                    flex
                    h-10
                    w-10
                    sm:h-14
                    sm:w-14
                    items-center
                    justify-center
                    rounded-xl
                    sm:rounded-2xl
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
                  <Icon size={18} className="sm:w-[26px] sm:h-[26px]" />
                </div>

                <h3 className="mb-1 sm:mb-2 text-sm sm:text-lg font-bold text-zinc-900">
                  {item.title}
                </h3>

                <p className="text-[11px] leading-snug sm:text-sm sm:leading-relaxed text-zinc-600 line-clamp-2 sm:line-clamp-none">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}