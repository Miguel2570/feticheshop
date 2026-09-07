export default function PoliticaReembolsoPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mx-auto max-w-4xl">
          <p className="section-eyebrow">Legal</p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Política de Reembolso
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            Todos os artigos comprados na FeticheShop podem ser trocados ou
            devolvidos, de acordo com as condições descritas abaixo.
          </p>

          <div className="mt-16 space-y-12 text-zinc-600 leading-8">
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                1. Prazo de Devolução
              </h2>
              <p className="mt-4">
                O cliente beneficia de um prazo de 15 (quinze) dias, a contar
                da data da receção dos artigos, para avaliar os produtos e, no
                caso de estes não corresponderem à expetativa, proceder à
                devolução.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                2. Condições de Devolução e Troca
              </h2>
              <p className="mt-4">
                Caso o cliente pretenda efetuar a troca de algum artigo, esta
                só é possível escolhendo outro artigo da loja, do mesmo valor
                ou superior. Os artigos devolvidos terão de estar sem qualquer
                tipo de marca de uso, assim como a respetiva embalagem.
              </p>
              <p className="mt-2">
                Os artigos devem ser devolvidos nas seguintes condições:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li>
                  Em estado novo, com embalagem original completa;
                </li>
                <li>
                  Acompanhados da respetiva fatura original;
                </li>
                <li>
                  Sem quaisquer sinais de utilização efetiva.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                3. Direito de Livre Resolução
              </h2>
              <p className="mt-4">
                O cliente poderá optar pela livre resolução do contrato, nos
                termos legais aplicáveis (art. 10.º do DL n.º 24/2014, de 14
                de fevereiro). Para exercer o direito de livre resolução, o
                cliente deve comunicar, até 14 dias após a receção do produto,
                por e-mail para{" "}
                <a
                  href="mailto:feticheshop.leiria@gmail.com"
                  className="text-pink-500 hover:underline"
                >
                  feticheshop.leiria@gmail.com
                </a>
                , a sua decisão de resolução do contrato por meio de uma
                declaração na qual explique a sua intenção de forma clara.
              </p>
              <p className="mt-2">
                A FeticheShop enviará pela mesma via, no prazo de 24 (vinte e
                quatro) horas, a confirmação do recebimento do pedido de
                resolução, de modo a respeitar os prazos legais.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                4. Contacto
              </h2>
              <p className="mt-4">
                Para qualquer dúvida relacionada com devoluções ou reembolsos,
                contacta-nos através de:
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:feticheshop.leiria@gmail.com"
                    className="text-pink-500 hover:underline"
                  >
                    feticheshop.leiria@gmail.com
                  </a>
                </li>
                <li>
                  Telefone:{" "}
                  <a
                    href="tel:+351919292567"
                    className="text-pink-500 hover:underline"
                  >
                    +351 919 292 567
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}