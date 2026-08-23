"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Quanto tempo demora a entrega?",
    answer:
      "As encomendas são normalmente entregues entre 24 e 72 horas úteis após confirmação do pagamento.",
  },
  {
    question: "Quais são os métodos de pagamento disponíveis?",
    answer:
      "Aceitamos MB Way, Multibanco, Cartão de Crédito, PayPal e outros métodos seguros.",
  },
  {
    question: "Posso devolver um produto?",
    answer:
      "Sim. Tens 14 dias para efetuar a devolução, desde que o produto esteja nas condições originais.",
  },
  {
    question: "Como acompanho a minha encomenda?",
    answer:
      "Após o envio receberás um email com o código de tracking para acompanhares a entrega.",
  },
  {
    question: "Os pagamentos são seguros?",
    answer:
      "Sim. Todas as transações utilizam ligações encriptadas SSL e gateways certificados.",
  },
  {
    question: "Como posso contactar o apoio ao cliente?",
    answer:
      "Podes contactar-nos por email, telefone ou através do formulário da página de contactos.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="
        group
        rounded-xl
        border
        border-pink-100
        bg-pink-50/50
        transition-all
        duration-300
        hover:border-pink-200
        hover:shadow-lg
      "
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="
          flex
          w-full
          cursor-pointer
          items-center
          justify-between
          gap-3
          px-4
          py-3.5
          text-left
        "
      >
        <h3 className="text-sm font-medium text-zinc-900 md:text-base">
          {question}
        </h3>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 text-pink-500"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <motion.p
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.2 }}
                className="text-sm leading-relaxed text-zinc-600"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="arabesque-bg relative overflow-hidden">
      <section className="container-custom pt-10 pb-16 sm:pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-pink-500/10
              text-pink-500
            "
          >
            <HelpCircle size={24} />
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-pink-500">
            Perguntas Frequentes
          </p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Como te podemos ajudar?
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Encontra rapidamente respostas às dúvidas mais comuns.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </section>
    </main>
  );
}