import Link from "next/link";

export default function CookiesPage() {
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
              Política de Cookies
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            Esta política explica como utilizamos cookies e tecnologias
            semelhantes no nosso website, em conformidade com o Regulamento
            Geral de Proteção de Dados (RGPD) e a legislação europeia aplicável.
          </p>

          <div className="mt-16 space-y-12 text-zinc-600 leading-8">
            {/* 1. O que são cookies */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                1. O que são Cookies?
              </h2>
              <p className="mt-4">
                Cookies são pequenos ficheiros de texto armazenados no teu
                dispositivo quando visitas um website. São amplamente utilizados
                para que os sites funcionem de forma eficiente, melhorarem a
                experiência do utilizador e fornecerem informações aos
                proprietários do site.
              </p>
            </section>

            {/* 2. Tipos de Cookies que Utilizamos */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                2. Tipos de Cookies que Utilizamos
              </h2>
              <p className="mt-4">
                Utilizamos diferentes categorias de cookies no nosso website:
              </p>

              <h3 className="mt-6 font-semibold text-zinc-900">
                Cookies Essenciais
              </h3>
              <p className="mt-2">
                Indispensáveis para o funcionamento da loja. Permitem a
                autenticação, o carrinho de compras, a segurança e a confirmação
                de idade. Sem estes cookies, o site não funcionaria corretamente.
                Não requerem consentimento.
              </p>

              <h3 className="mt-6 font-semibold text-zinc-900">
                Cookies de Desempenho e Análise
              </h3>
              <p className="mt-2">
                Estes cookies recolhem informação sobre como os visitantes
                utilizam o website (por exemplo, páginas mais visitadas, tempo de
                permanência). Os dados são agregados e anónimos, usados apenas
                para melhorar o desempenho e a experiência do utilizador.
              </p>

              <h3 className="mt-6 font-semibold text-zinc-900">
                Cookies de Marketing
              </h3>
              <p className="mt-2">
                Utilizados para apresentar publicidade mais relevante para o
                utilizador e medir a eficácia das campanhas. Podem ser definidos
                por parceiros de publicidade terceiros e rastrear a navegação
                entre diferentes sites.
              </p>
            </section>

            {/* 3. Como gerir cookies */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                3. Como Gerir os Cookies
              </h2>
              <p className="mt-4">
                Podes alterar as tuas preferências de cookies a qualquer momento
                através do banner de consentimento apresentado no website ou
                configurando o teu navegador para bloquear ou alertar sobre
                cookies.
              </p>
              <p className="mt-2">
                A desativação de alguns cookies poderá afetar o funcionamento de
                determinadas funcionalidades da loja.
              </p>
            </section>

            {/* 4. Consentimento */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                4. Consentimento
              </h2>
              <p className="mt-4">
                Ao visitares o nosso website pela primeira vez, será apresentado
                um banner de consentimento onde podes aceitar todos os cookies,
                rejeitar os não essenciais ou personalizar as tuas preferências.
                A tua escolha ficará guardada durante um período máximo de 12
                meses.
              </p>
            </section>

            {/* 5. Atualizações */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                5. Atualizações a esta Política
              </h2>
              <p className="mt-4">
                Podemos atualizar esta política periodicamente para refletir
                alterações legais ou técnicas. A data da última atualização será
                indicada no topo desta página.
              </p>
            </section>

            {/* 6. Contacto */}
            <section>
              <h2 className="font-display text-2xl text-zinc-900">
                6. Contacto
              </h2>
              <p className="mt-4">
                Se tiveres dúvidas sobre esta política ou sobre a forma como
                tratamos os teus dados, contacta-nos através de:
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