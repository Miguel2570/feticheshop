export default function AboutPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden">
      <section className="container-custom py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Título */}
          <div className="text-center">
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
          </div>

          {/* Texto */}
          <div className="mt-12 space-y-6 text-left">
            <p className="text-lg leading-9 text-zinc-700">
              Há mais de uma década que a FeticheShop faz parte da vida de quem procura explorar a intimidade, o prazer e o bem-estar com liberdade, confiança e sem preconceitos.
            </p>

            <p className="text-lg leading-9 text-zinc-700">
              Ao longo destes anos, crescemos e evoluímos, mas mantivemos aquilo que sempre nos definiu: proximidade, discrição e um atendimento sem julgamentos.
            </p>

            <p className="text-lg leading-9 text-zinc-700">
              Na FeticheShop acreditamos que cada pessoa, cada casal e cada relação são únicos. Por isso, selecionamos os nossos produtos pensando em diferentes gostos, necessidades e momentos, procurando oferecer qualidade, diversidade e opções para quem está a dar os primeiros passos neste universo e para quem já sabe exatamente aquilo que procura.
            </p>

            <p className="text-lg leading-9 text-zinc-700">
              A experiência adquirida ao longo de mais de uma década de contacto direto com os nossos clientes permite-nos fazer mais do que simplesmente vender produtos. Ouvimos, esclarecemos dúvidas e ajudamos a escolher, sempre com naturalidade, respeito e total discrição.
            </p>

            <p className="text-lg leading-9 text-zinc-700">
              Na nossa loja física ou através da nossa loja online, queremos que se sinta confortável para descobrir e explorar ao seu ritmo.
            </p>

            <p className="text-lg leading-9 text-zinc-700">
              Porque para nós, falar de prazer é falar de bem-estar, cumplicidade e liberdade.
            </p>

            <p className="text-xl font-semibold text-pink-500 pt-4">
              FeticheShop — prazer, confiança e discrição, sem tabus.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}