export default function PrivacidadePage() {
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
              Política de Privacidade
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            A FeticheShop respeita a tua privacidade e compromete-se a proteger
            os teus dados pessoais, em conformidade com o Regulamento Geral de
            Proteção de Dados (RGPD) e a legislação portuguesa aplicável.
          </p>

          <div className="mt-16 space-y-12 text-zinc-600 leading-8">
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                1. Responsável pelo Tratamento de Dados
              </h2>
              <p className="mt-4">
                Empresa: FeticheShop
                <br />
                Morada: Rua da Nazaré, Lote 3, R/C Loja A, 2415-780 Leiria, Portugal
                <br />
                Email:{" "}
                <a
                  href="mailto:feticheshop.leiria@gmail.com"
                  className="text-pink-500 hover:underline"
                >
                  feticheshop.leiria@gmail.com
                </a>
                <br />
                Telefone:{" "}
                <a
                  href="tel:+351919292567"
                  className="text-pink-500 hover:underline"
                >
                  +351 919 292 567
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                2. Informação e Consentimento
              </h2>
              <p className="mt-4">
                O Regulamento Geral de Proteção de Dados (Regulamento (UE)
                2016/679 do Parlamento Europeu e do Conselho de 27 de abril de
                2016) assegura a proteção das pessoas singulares no que diz
                respeito ao tratamento de dados pessoais. A FeticheShop
                procede ao tratamento dos teus dados pessoais quando fazes uma
                compra ou utilizas o nosso website.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                3. Finalidades do Tratamento de Dados Pessoais
              </h2>
              <p className="mt-4">
                Os dados pessoais que tratamos através desta página serão
                utilizados para:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li>Processamento da encomenda;</li>
                <li>Envio dos produtos;</li>
                <li>Informação do estado da encomenda;</li>
                <li>Resposta a dúvidas, reclamações ou devoluções.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                4. Conservação dos Dados Pessoais
              </h2>
              <p className="mt-4">
                A FeticheShop retém os teus dados pessoais apenas pelo período
                estritamente necessário para a gestão do contrato de compra e
                venda, durante um período de 2 anos. A FeticheShop é ainda
                obrigada a conservar os dados pelo período de 10 anos nos
                termos da lei fiscal aplicável.
              </p>
              <p className="mt-2">
                No final dos períodos de conservação, eliminamos os teus dados
                pessoais.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                5. Transmissão dos Dados Pessoais
              </h2>
              <p className="mt-4">
                No âmbito da gestão de dados de cliente, os dados pessoais
                recolhidos serão transmitidos a subcontratados que sejam
                empresas que apoiem na execução dos serviços, bem como
                transportadoras de mercadorias, tendo como única e exclusiva
                finalidade a realização e execução dos serviços ou produtos
                comprados pelo cliente. Os teus dados pessoais podem também ser
                comunicados, no cumprimento da lei, a entidades do Estado,
                como a Autoridade Tributária.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                6. Direitos RGPD
              </h2>
              <p className="mt-4">
                O titular de dados pessoais tem os seguintes direitos:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li>Direito de acesso;</li>
                <li>Direito de retificação;</li>
                <li>Direito de apagamento;</li>
                <li>Direito de limitação;</li>
                <li>Direito de portabilidade.</li>
              </ul>
              <p className="mt-2">
                Para exercer qualquer um destes direitos, deverá fazê-lo
                através do email{" "}
                <a
                  href="mailto:feticheshop.leiria@gmail.com"
                  className="text-pink-500 hover:underline"
                >
                  feticheshop.leiria@gmail.com
                </a>.
              </p>
              <p className="mt-2">
                Caso necessite, o titular de dados pessoais poderá, ainda,
                apresentar reclamação junto da Comissão Nacional de Proteção de
                Dados (CNPD).
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}