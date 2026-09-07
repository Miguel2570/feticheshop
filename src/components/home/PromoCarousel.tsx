// src/components/home/PromoCarousel.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoBanner {
  id: string;
  imageUrl: string;
  link: string;
}

interface PromoCarouselProps {
  banners: PromoBanner[];
}

export function PromoCarousel({ banners }: PromoCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = banners.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
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
  }, [handleNext, totalSlides]);

  const handleManualNext = () => {
    handleNext();
    resetAutoPlay();
  };

  const handleManualPrev = () => {
    handlePrev();
    resetAutoPlay();
  };

  if (banners.length === 0) return null;

  return (
    <section className="arabesque-bg relative overflow-visible">
      <div className="container-custom pt-10 pb-16 sm:pt-14">
        <div className="relative mt-4 px-0 sm:px-2 lg:px-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {banners
                .slice(currentSlide * 3, currentSlide * 3 + 3)
                .map((banner) => (
                  <Link
                    key={banner.id}
                    href={banner.link}
                    className="group relative block overflow-hidden rounded-3xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/15"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={banner.imageUrl}
                        alt="Promoção"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                ))}
            </motion.div>
          </AnimatePresence>

          {/* Setas */}
          {totalSlides > 3 && (
            <>
              <button
                onClick={handleManualPrev}
                aria-label="Anterior"
                className="
                  absolute -left-3 sm:-left-5 lg:-left-14 top-1/2 -translate-y-1/2 z-30
                  flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center
                  rounded-full bg-pink-500 text-white shadow-xl shadow-pink-500/30
                  transition-all duration-300 cursor-pointer hover:bg-pink-600 hover:scale-110
                "
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleManualNext}
                aria-label="Seguinte"
                className="
                  absolute -right-3 sm:-right-5 lg:-right-14 top-1/2 -translate-y-1/2 z-30
                  flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center
                  rounded-full bg-pink-500 text-white shadow-xl shadow-pink-500/30
                  transition-all duration-300 cursor-pointer hover:bg-pink-600 hover:scale-110
                "
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Indicadores */}
          {totalSlides > 3 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: Math.ceil(totalSlides / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > Math.floor(currentSlide / 3) ? 1 : -1);
                    setCurrentSlide(index * 3);
                    resetAutoPlay();
                  }}
                  aria-label={`Ir para slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentSlide / 3) === index
                      ? "w-8 bg-pink-500"
                      : "w-2.5 bg-zinc-300 hover:bg-pink-300 cursor-pointer"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}