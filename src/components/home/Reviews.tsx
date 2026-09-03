"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    id: 1,
    name: "Marta S.",
    rating: 5,
    text: "Encomenda discreta e rápida. Os produtos são de excelente qualidade. Super recomendo!",
    product: "Vibrador Premium",
    date: "Há 2 semanas",
    verified: true,
  },
  {
    id: 2,
    name: "João P.",
    rating: 5,
    text: "Muito profissionalismo. O site é fácil de usar e a entrega foi super rápida e discreta.",
    product: "Kit Casal",
    date: "Há 1 mês",
    verified: true,
  },
  {
    id: 3,
    name: "Ana R.",
    rating: 4,
    text: "Gostei muito da variedade de produtos. O atendimento ao cliente foi excelente e atencioso.",
    product: "Lubrificante",
    date: "Há 3 semanas",
    verified: true,
  },
  {
    id: 4,
    name: "Carlos M.",
    rating: 5,
    text: "Embalagem totalmente discreta como prometido. Voltarei a comprar com certeza!",
    product: "Kit BDSM",
    date: "Há 2 meses",
    verified: true,
  },
  {
    id: 5,
    name: "Sofia L.",
    rating: 5,
    text: "Produtos premium a preços justos. A qualidade supera as expectativas. Aconselho!",
    product: "Sugador Clitoriano",
    date: "Há 1 semana",
    verified: true,
  },
  {
    id: 6,
    name: "Pedro A.",
    rating: 5,
    text: "Excelente experiência de compra. Site intuitivo, entrega rápida e produtos fantásticos.",
    product: "Anel Vibratório",
    date: "Há 5 dias",
    verified: true,
  },
];

export function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [direction, setDirection] = useState(1);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setVisibleCount(3);
      } else {
        setVisibleCount(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => {
      if (prev >= reviews.length - visibleCount) {
        return 0;
      }
      return prev + 1;
    });
  }, [visibleCount]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      if (prev === 0) {
        return reviews.length - visibleCount;
      }
      return Math.max(prev - 1, 0);
    });
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
  }, [visibleCount, handleNext]);

  const handleManualNext = () => {
    handleNext();
    resetAutoPlay();
  };

  const handleManualPrev = () => {
    handlePrev();
    resetAutoPlay();
  };

  const visibleReviews = reviews.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  return (
    <section className="arabesque-bg relative overflow-visible">
      <div className="container-custom py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">Avaliações</p>

          <h2 className="section-title mt-4">
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #f3ccd8 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Clientes satisfeitos
            </span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Vê o que os nossos clientes dizem sobre a experiência de compra.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className="fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-zinc-900">4.9</span>
            <span className="text-sm text-zinc-500">(127 avaliações)</span>
          </div>
        </div>

        <div className="relative mt-12 px-2 sm:px-4 lg:px-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col rounded-3xl border border-pink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={15}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-300"
                          }
                        />
                      ))}
                    </div>

                    {review.verified && (
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        ✓ Verificada
                      </span>
                    )}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-7 text-zinc-700">
                    {review.text}
                  </p>

                  <p className="mt-3 text-xs font-medium text-pink-600">
                    {review.product}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-600">
                        {review.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-zinc-900">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400">{review.date}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

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

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: reviews.length - visibleCount + 1 }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                    resetAutoPlay();
                  }}
                  aria-label={`Ir para slide ${index + 1}`}
                  className={`
                    h-2.5
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      currentIndex === index
                        ? "w-8 bg-pink-500"
                        : "w-2.5 bg-zinc-300 hover:bg-pink-300 cursor-pointer"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}