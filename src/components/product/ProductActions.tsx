"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    description: "MB Way e Multibanco.",
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

export function ProductActions() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = 2;
  const itemsPerSlide = 4;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  };

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  useEffect(() => {
    resetAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [handleNext]);

  const handleManualNext = () => {
    handleNext();
    resetAutoPlay();
  };

  const handleManualPrev = () => {
    handlePrev();
    resetAutoPlay();
  };

  const visibleItems = actions.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="arabesque-bg relative overflow-visible">
      <div className="container-custom pt-10 pb-16 sm:pt-16">
        <div className="mb-8 sm:mb-12 text-center">
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

        <div className="relative mt-12 px-2 sm:px-4 lg:px-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid gap-6 lg:grid-cols-4"
            >
              {visibleItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-3xl
                      border
                      border-pink-100
                      bg-white
                      p-6
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-pink-300
                      hover:shadow-lg
                      hover:shadow-pink-500/10
                    "
                  >
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-pink-500/10
                        text-pink-500
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:bg-pink-500
                        group-hover:text-white
                      "
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 text-base font-bold text-zinc-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-zinc-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Setas fora dos cards */}
          <button
            onClick={handleManualPrev}
            aria-label="Anterior"
            className="
              absolute
              -left-3
              sm:-left-5
              lg:-left-16
              top-1/2
              -translate-y-1/2
              z-30
              flex
              h-11
              w-11
              sm:h-12
              sm:w-12
              items-center
              justify-center
              rounded-full
              bg-pink-500
              text-white
              shadow-xl
              shadow-pink-500/30
              transition-all
              duration-300
              cursor-pointer
              hover:bg-pink-600
              hover:scale-110
            "
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleManualNext}
            aria-label="Seguinte"
            className="
              absolute
              -right-3
              sm:-right-5
              lg:-right-16
              top-1/2
              -translate-y-1/2
              z-30
              flex
              h-11
              w-11
              sm:h-12
              sm:w-12
              items-center
              justify-center
              rounded-full
              bg-pink-500
              text-white
              shadow-xl
              shadow-pink-500/30
              transition-all
              duration-300
              cursor-pointer
              hover:bg-pink-600
              hover:scale-110
            "
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                  resetAutoPlay();
                }}
                aria-label={`Ir para slide ${index + 1}`}
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    currentSlide === index
                      ? "w-8 bg-pink-500"
                      : "w-2.5 bg-zinc-300 hover:bg-pink-300 cursor-pointer"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}