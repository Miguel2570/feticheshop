"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

const banners = [
  {
    id: 1,
    image: "/images/banners/mobile/banner-7.jpg",
    alt: "Banner 1",
    link: "/product/mia-sicilia-duplo-prazer-vibrando-mordendo",
  },
  {
    id: 2,
    image: "/images/banners/mobile/banner-10.jpg",
    alt: "Banner 2",
    link: "/product/intt-suck-my-clit-gel-com-efeito-de-succao-morango-silvestre-15-ml",
  },
  {
    id: 3,
    image: "/images/banners/mobile/banner-3.jpg",
    alt: "Banner 3",
    link: "/product/satisfyer-tecnologia-de-ar-liquido-pro-2-gerao-3-preto",
  },
  {
    id: 4,
    image: "/images/banners/mobile/banner-4.jpg",
    alt: "Banner 4",
    link: "/intt-suck-my-clit-gel-com-efeito-de-succao-manga-tropical-15-ml",
  },
];

export function BannerCarouselMobile() {
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

  const handleDragStart = (
    clientX: number,
    clientY: number
  ) => {
    setIsDragging(true);

    startXRef.current = clientX;
    startYRef.current = clientY;

    isHorizontalSwipeRef.current = null;
  };

  const handleDragMove = (
    clientX: number,
    clientY: number
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

    if (isHorizontalSwipeRef.current === false) {
      return;
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

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    handleDragStart(
      touch.clientX,
      touch.clientY
    );
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    handleDragMove(
      touch.clientX,
      touch.clientY
    );
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const dragPercent =
    containerWidth > 0
      ? (dragOffset / containerWidth) * 100
      : 0;

  const translatePercent =
    -currentIndex * 100 + dragPercent;

  return (
    <section className="w-full">
      <div
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* CARROSSEL MOBILE */}
        <div
          ref={containerRef}
          className={`
            relative
            w-full
            overflow-hidden
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            select-none
          `}
          style={{
            backgroundColor: "#ffffff",
            touchAction: "pan-y",
          }}
        >
          <div
            className={`
              flex
              ${isDragging ? "" : "transition-transform duration-500 ease-out"}
            `}
            style={{
              transform: `translateX(${translatePercent}%)`,
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full shrink-0"
              >
                <Link
                  href={banner.link}
                  className="block w-full"
                  onClick={(e) => {
                    if (Math.abs(dragOffset) > 5) {
                      e.preventDefault();
                    }
                  }}
                  draggable={false}
                >
                  <div
                    className="
                      relative
                      w-full
                      aspect-[1000/650]
                      overflow-hidden
                      bg-white
                    "
                  >
                    <Image
                      src={banner.image}
                      alt={banner.alt}
                      fill
                      priority={banner.id === 1}
                      sizes="100vw"
                      className="
                        object-fill
                        pointer-events-none
                      "
                      draggable={false}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* INDICADORES */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);

                setTimeout(() => {
                  setIsAutoPlaying(true);
                }, 3000);
              }}
              aria-label={`Ir para banner ${index + 1}`}
              className={`
                h-2
                rounded-full
                transition-all
                duration-300
                ${
                  index === currentIndex
                    ? "w-8 bg-[var(--primary)]"
                    : "w-2 bg-zinc-400"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}