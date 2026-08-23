import { ExternalLink } from "lucide-react";

export default function LivroReclamacoesPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-eyebrow">Apoio ao Cliente</p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Livro de Reclamações
            </span>
          </h1>

          <p className="mt-8 text-lg leading-8 text-zinc-600">
            Para apresentar uma reclamação, podes aceder ao Livro de
            Reclamações Eletrónico, em conformidade com a legislação portuguesa.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://www.livroreclamacoes.pt/Inicio/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-pink-500 px-8 py-4 font-semibold text-white transition hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/25"
            >
              <ExternalLink size={18} />
              Aceder ao Livro de Reclamações
            </a>
          </div>

          <p className="mt-10 text-sm text-zinc-500">
            Também podes contactar-nos diretamente através de:
          </p>
          <ul className="mt-3 space-y-2 text-zinc-600">
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
        </div>
      </section>
    </main>
  );
}