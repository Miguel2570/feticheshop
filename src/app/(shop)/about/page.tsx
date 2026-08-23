import {
  Award,
  HeartHandshake,
  ShieldCheck,
  Truck,
} from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Qualidade",
    description:
      "Selecionamos apenas produtos de elevada qualidade e marcas reconhecidas.",
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description:
      "Expedimos rapidamente para que recebas a tua encomenda o mais depressa possível.",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description:
      "Todos os pagamentos são protegidos por tecnologias de segurança modernas.",
  },
  {
    icon: HeartHandshake,
    title: "Apoio ao Cliente",
    description:
      "Estamos disponíveis para esclarecer dúvidas antes e depois da compra.",
  },
];

export default function AboutPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden">
      <section className="container-custom py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-eyebrow">
            Sobre Nós
          </p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Muito mais do que uma Loja Online
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            Trabalhamos diariamente para oferecer produtos de qualidade,
            uma experiência de compra simples e um serviço de excelência
            desde o primeiro clique até à entrega da encomenda.
          </p>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div
            className="
              rounded-[30px]
              border
              border-pink-100
              bg-white/70
              backdrop-blur-sm
              p-10
              shadow-sm
            "
          >
            <h2 className="font-display text-3xl text-zinc-900">
              A nossa missão
            </h2>

            <p className="mt-8 leading-8 text-zinc-600">
              Queremos proporcionar uma experiência de compra moderna,
              rápida e totalmente segura, disponibilizando uma seleção
              cuidada de produtos e um atendimento próximo de todos os
              nossos clientes.
            </p>

            <p className="mt-6 leading-8 text-zinc-600">
              Apostamos na transparência, rapidez de envio e apoio ao
              cliente para construir relações duradouras baseadas na
              confiança.
            </p>
          </div>

          <div
            className="
              rounded-[30px]
              border
              border-pink-100
              bg-white/70
              backdrop-blur-sm
              p-10
              shadow-sm
            "
          >
            <h2 className="font-display text-3xl text-zinc-900">
              Porque escolher-nos?
            </h2>

            <div className="mt-10 space-y-8">
              {values.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex gap-5"
                  >
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-pink-500
                        to-brand-wine
                        text-white
                        shadow-lg
                        shadow-pink-500/25
                      "
                    >
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 leading-7 text-zinc-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}