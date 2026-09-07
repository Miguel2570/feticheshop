"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

interface RelatedProductsProps {
  currentProductId: string;
  currentCategory?: string;
  products: Product[];
}

export function RelatedProducts({
  currentProductId,
  currentCategory,
  products,
}: RelatedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(4);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    function handleResize() {
      const newItemsPerView = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 4;
      setItemsPerView(newItemsPerView);
      setCurrentIndex(0);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sameCategoryProducts = products.filter(
    (product) => product.id !== currentProductId && product.category === currentCategory
  );

  const otherProducts = products.filter(
    (product) => product.id !== currentProductId && product.category !== currentCategory
  );

  const relatedProducts = [...sameCategoryProducts, ...otherProducts];

  const maxIndex = Math.max(0, relatedProducts.length - itemsPerView);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    setIsAutoPlaying(true);
  };

  if (!products || products.length < 2) {
    return null;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  // Calcular qual bolinha está ativa baseado no currentIndex
  const activeDot = maxIndex > 0
    ? Math.round((currentIndex / maxIndex) * 3) // 4 bolinhas = índices 0, 1, 2, 3
    : 0;

  return (
    <section className="arabesque-bg relative overflow-hidden">
      <div className="container-custom py-16">
        <div className="mb-10 text-center">
          <p className="section-eyebrow text-sm font-medium uppercase tracking-wider text-brand-magenta">
            Também poderá gostar
          </p>

          <h2 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              Produtos Relacionados
            </span>
          </h2>
        </div>

        {/* Carrossel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="overflow-hidden -mx-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <ProductCard
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    brand={product.brand}
                    description={product.description || ""}
                    image={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/images/product-placeholder.png"
                    }
                    price={product.price}
                    oldPrice={product.oldPrice}
                    rating={product.rating || 0}
                    reviews={product.reviews || 0}
                    badge={
                      product.oldPrice && product.oldPrice > product.price
                        ? "Promoção"
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Botões de navegação */}
          {maxIndex > 0 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Anterior"
                className="
                  absolute
                  left-0
                  top-1/2
                  -translate-y-1/2
                  z-10
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-zinc-600
                  shadow-lg
                  border
                  border-zinc-200
                  transition-all
                  hover:bg-pink-500
                  hover:text-white
                  hover:border-pink-500
                  cursor-pointer
                "
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Próximo"
                className="
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  z-10
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-zinc-600
                  shadow-lg
                  border
                  border-zinc-200
                  transition-all
                  hover:bg-pink-500
                  hover:text-white
                  hover:border-pink-500
                  cursor-pointer
                "
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* 4 Bolinhas fixas */}
          {maxIndex > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    // Ir para a posição correspondente
                    const targetIndex = Math.round((index / 3) * maxIndex);
                    setCurrentIndex(targetIndex);
                  }}
                  aria-label={`Ir para posição ${index + 1}`}
                  className={`
                    h-2
                    rounded-full
                    transition-all
                    duration-300
                    cursor-pointer
                    ${index === activeDot ? "w-8 bg-pink-500" : "w-2 bg-zinc-300 hover:bg-pink-300"}
                  `}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}