export default function PagamentosEnvioPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mx-auto max-w-4xl">
          <p className="section-eyebrow">Informações</p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Pagamentos e Envio
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            Na FeticheShop oferecemos métodos de pagamento seguros e envios
            discretos para que possas fazer as tuas compras com total confiança
            e comodidade.
          </p>

          <div className="mt-16 space-y-12 text-zinc-600 leading-8">
            {/* PAGAMENTO */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">Pagamento</h2>
              <p className="mt-4">
                A FeticheShop disponibiliza os seguintes métodos de pagamento:
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-zinc-900">Multibanco / Referência</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Será gerada uma referência multibanco automaticamente para
                    efetuares o teu pagamento, através de um protocolo criado
                    com uma empresa certificada pelo Banco de Portugal para
                    este serviço.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-zinc-900">MB Way</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Será enviada uma notificação para efetuares o pagamento
                    através do MB Way, também com base num protocolo criado com
                    uma empresa certificada pelo Banco de Portugal para este
                    serviço.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-zinc-900">Transferência Bancária</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Podes efetuar o pagamento por transferência bancária. A tua
                    encomenda será processada após a receção e confirmação do
                    valor.
                  </p>
                </div>

                <div className="rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-zinc-900">PayPal</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Podes pagar de forma rápida e segura através da tua conta
                    PayPal.
                  </p>
                </div>
              </div>
            </section>

            {/* ENVIO */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">Envio</h2>
              <p className="mt-4">
                As despesas de envio são calculadas automaticamente mediante o
                peso, volume e destino da encomenda, podendo abranger as
                seguintes áreas geográficas:
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li>Portugal Continental</li>
                <li>Ilhas (Açores e Madeira)</li>
                <li>União Europeia</li>
                <li>Resto do mundo</li>
              </ul>

              <p className="mt-4">
                Os envios das encomendas poderão ser feitos das seguintes
                formas:
              </p>

              <div className="mt-6 rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-zinc-900">Envio Registado</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Através de transportadora parceira, numa morada indicada pelo
                  comprador (residencial, profissional ou outra). Assim que a
                  encomenda for despachada, receberás uma SMS ou email a
                  indicar que a encomenda foi enviada com sucesso.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Será sempre necessário informar o teu contacto de
                  telemóvel/telefone para que a transportadora possa entrar em
                  contacto caso não esteja ninguém na morada.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Para acompanhares o estado da encomenda, receberás por SMS ou
                  email o código de rastreamento (tracking number).
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-pink-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-zinc-900">Recolha em Loja</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  A opção de recolha em loja é gratuita. A encomenda só será
                  processada após pagamento. Podes recolher a tua encomenda na
                  loja após 1 (uma) hora, mediante horário de funcionamento.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  As encomendas com opção de recolha em loja têm um prazo de
                  48h para pagamento, caso contrário serão canceladas.
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Para levantamento, apresenta:
                </p>
                <ul className="mt-2 list-disc pl-6 text-sm space-y-1">
                  <li>Número da encomenda</li>
                  <li>Identificação do cliente (CC)</li>
                </ul>
              </div>
            </section>

            {/* PRAZOS */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                Prazos de Entrega
              </h2>
              <p className="mt-4">
                O prazo médio de entrega para Portugal Continental é de{" "}
                <strong className="text-zinc-900">2 a 5 dias úteis</strong>.
              </p>
              <p className="mt-2">
                Para outras opções de envio geográfico, o prazo poderá variar
                entre <strong className="text-zinc-900">9 a 31 dias úteis</strong>.
              </p>
            </section>

            {/* CONTACTO */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                Contacto
              </h2>
              <p className="mt-4">
                Se tiveres alguma dúvida sobre pagamentos ou envios,
                contacta-nos:
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