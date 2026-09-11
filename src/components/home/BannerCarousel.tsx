// src/components/home/BannerCarousel.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    image: "/images/banner-7.jpg",
    alt: "Banner 1",
    link: "/product/mia-sicilia-duplo-prazer-vibrando-mordendo",
  },
  {
    id: 2,
    image: "/images/banner-10.jpg",
    alt: "Banner 2",
    link: "/product/intt-suck-my-clit-gel-com-efeito-de-succao-morango-silvestre-15-ml",
  },
  {
    id: 3,
    image: "/images/banner-3.jpg",
    alt: "Banner 3",
    link: "/product/satisfyer-tecnologia-de-ar-liquido-pro-2-gerao-3-preto",
  },
  {
    id: 4,
    image: "/images/banner-4.jpg",
    alt: "Banner 4",
    link: "/intt-suck-my-clit-gel-com-efeito-de-succao-manga-tropical-15-ml",
  },
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const currentIndexRef = useRef(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const totalSlides = banners.length;

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoPlaying || isDragging) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isDragging, nextSlide]);

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startYRef.current = clientY;
    isHorizontalSwipeRef.current = null;
  };

  const handleDragMove = (
    clientX: number,
    clientY: number,
    e?: React.MouseEvent | React.TouchEvent
  ) => {
    if (!isDragging) return;

    const deltaX = clientX - startXRef.current;
    const deltaY = clientY - startYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalSwipeRef.current = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX)) {
        isHorizontalSwipeRef.current = false;
      }
    }

    if (isHorizontalSwipeRef.current === false) return;

    if (e && "preventDefault" in e) {
      e.preventDefault();
    }

    setDragOffset(deltaX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const threshold = containerWidth * 0.15;
    const currentIdx = currentIndexRef.current;

    if (dragOffset > threshold) {
      if (currentIdx > 0) {
        prevSlide();
      } else {
        setCurrentIndex(totalSlides - 1);
      }
    } else if (dragOffset < -threshold) {
      if (currentIdx < totalSlides - 1) {
        nextSlide();
      } else {
        setCurrentIndex(0);
      }
    }

    setDragOffset(0);
    setIsDragging(false);
    isHorizontalSwipeRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY, e);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY, e);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const dragPercent = containerWidth > 0 ? (dragOffset / containerWidth) * 100 : 0;
  const translatePercent = -currentIndex * 100 + dragPercent;

  return (
    <section className="container-custom">
      <div
        className="relative px-0 sm:px-14"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Setas - apenas DESKTOP */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Banner anterior"
          className="
            absolute
            left-0
            top-[calc(50%-24px)]
            -translate-y-1/2
            z-10
            hidden
            sm:flex
            h-10
            w-10
            sm:h-12
            sm:w-12
            items-center
            justify-center
            rounded-full
            bg-white
            text-zinc-900
            border
            border-zinc-200
            shadow-lg
            transition-all
            duration-300
            cursor-pointer
            hover:bg-[var(--primary)]
            hover:text-white
            hover:border-[var(--primary)]
            hover:scale-110
          "
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Banner seguinte"
          className="
            absolute
            right-0
            top-[calc(50%-24px)]
            -translate-y-1/2
            z-10
            hidden
            sm:flex
            h-10
            w-10
            sm:h-12
            sm:w-12
            items-center
            justify-center
            rounded-full
            bg-white
            text-zinc-900
            border
            border-zinc-200
            shadow-lg
            transition-all
            duration-300
            cursor-pointer
            hover:bg-[var(--primary)]
            hover:text-white
            hover:border-[var(--primary)]
            hover:scale-110
          "
        >
          <ChevronRight size={22} />
        </button>

        {/* ✅ Container REDONDO mas SEM borda preta */}
        <div
          ref={containerRef}
          className={`
            relative overflow-hidden rounded-2xl shadow-xl
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            select-none
          `}
          style={{ backgroundColor: "#ffffff", touchAction: "pan-y" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={`flex ${isDragging ? "" : "transition-transform duration-500 ease-out"}`}
            style={{ transform: `translateX(${translatePercent}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full shrink-0">
                <Link
                  href={banner.link}
                  className="block relative"
                  onClick={(e) => {
                    if (Math.abs(dragOffset) > 5) {
                      e.preventDefault();
                    }
                  }}
                  draggable={false}
                >
                  <div
                    className="relative w-full bg-white"
                    style={{ aspectRatio: "1792 / 592" }}
                  >
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      priority={banner.id === 1}
                      sizes="(max-width: 1500px) 100vw, 1500px"
                      className="object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* DOTS - FORA da imagem */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para banner ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                cursor-pointer
                ${
                  index === currentIndex
                    ? "w-8 bg-[var(--primary)]"
                    : "w-2 bg-zinc-400 hover:bg-pink-300"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}