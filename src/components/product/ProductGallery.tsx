"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const currentImage = images[selectedImage] ?? "/images/product-placeholder.png";

  const handlePrev = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[selectedImage] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [selectedImage]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[32px] border border-pink-100 bg-pink-50/50">
        <Image
          src="/images/product-placeholder.png"
          alt="Sem imagem"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
      {/* COLUNA DE MINIATURAS - MOBILE: HORIZONTAL EM BAIXO | DESKTOP: VERTICAL À ESQUERDA */}
      <div className="
        order-2                    // Em mobile, fica em baixo
        sm:order-1                 // Em desktop, volta para esquerda
        flex 
        w-full                     // Largura total em mobile
        sm:w-24 
        sm:flex-col 
        lg:w-28 
        shrink-0 
        gap-2
        min-w-0                    // Impede overflow
      ">
        {/* SETA CIMA - Visível apenas em desktop */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Imagem anterior"
          className="
            hidden
            sm:flex 
            h-9 w-9 mx-auto items-center justify-center
            rounded-full border-2 border-pink-200 bg-white
            text-pink-600 shadow-sm
            transition-all duration-300
            hover:border-pink-500 hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/25
            hover:scale-105
            cursor-pointer shrink-0
          "
        >
          <ChevronUp size={18} />
        </button>

        {/* SETA ESQUERDA - Visível apenas em mobile */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Imagem anterior"
          className="
            sm:hidden
            flex h-8 w-8 items-center justify-center
            rounded-full border-2 border-pink-200 bg-white
            text-pink-600 shadow-sm
            transition-all duration-300
            hover:border-pink-500 hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/25
            hover:scale-105
            cursor-pointer shrink-0 self-center
          "
        >
          <ChevronLeft size={16} />
        </button>

        {/* MINIATURAS - Horizontal em mobile, vertical em desktop */}
        <div
          ref={thumbnailsRef}
          className="
            flex-1
            flex 
            items-center 
            gap-2 
            overflow-x-auto
            sm:max-h-[420px]
            sm:flex-col 
            sm:overflow-y-auto
            sm:overflow-x-hidden
            sm:pr-1 
            scrollbar-thin 
            scrollbar-thumb-pink-300 
            scrollbar-track-pink-50
            pb-1
            sm:pb-0
            min-w-0                    // Impede overflow
          "
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`
                relative
                aspect-square
                w-16                     // Menor em mobile
                sm:w-full
                shrink-0
                overflow-hidden
                rounded-xl
                border-2
                bg-pink-50/50
                transition-all
                duration-300
                cursor-pointer
                ${
                  selectedImage === index
                    ? "border-pink-500 shadow-lg shadow-pink-500/20"
                    : "border-pink-100 hover:border-pink-300 hover:shadow-md"
                }
              `}
            >
              <Image
                src={image}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 640px) 64px, 112px"
                className="object-contain p-1.5 sm:p-2"
              />
            </button>
          ))}
        </div>

        {/* SETA BAIXO - Visível apenas em desktop */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Imagem seguinte"
          className="
            hidden
            sm:flex 
            h-9 w-9 mx-auto items-center justify-center
            rounded-full border-2 border-pink-200 bg-white
            text-pink-600 shadow-sm
            transition-all duration-300
            hover:border-pink-500 hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/25
            hover:scale-105
            cursor-pointer shrink-0
          "
        >
          <ChevronDown size={18} />
        </button>

        {/* SETA DIREITA - Visível apenas em mobile */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Imagem seguinte"
          className="
            sm:hidden
            flex h-8 w-8 items-center justify-center
            rounded-full border-2 border-pink-200 bg-white
            text-pink-600 shadow-sm
            transition-all duration-300
            hover:border-pink-500 hover:bg-pink-500 hover:text-white
            hover:shadow-lg hover:shadow-pink-500/25
            hover:scale-105
            cursor-pointer shrink-0 self-center
          "
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* IMAGEM PRINCIPAL */}
      <div className="
        relative 
        min-w-0 
        flex-1 
        order-1                    // Em mobile, fica em cima
        sm:order-2                 // Em desktop, volta para direita
        w-full                     // Garante largura total
      ">
        <div
          className="
            group
            relative
            w-full
            aspect-square
            overflow-hidden
            rounded-2xl               // Raio menor em mobile
            sm:rounded-[32px]
            border
            border-pink-100
            bg-pink-50/50
            shadow-sm
          "
        >
          <Image
            src={currentImage}
            alt={`Imagem ${selectedImage + 1}`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 600px"
            className="
              object-contain
              p-4
              sm:p-8
              transition-transform
              duration-700
              group-hover:scale-105
            "
          />

          {/* SETAS CIRCULARES - SEMPRE VISÍVEIS E AO CENTRO */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Anterior"
                className="
                  absolute
                  left-2
                  sm:left-3
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-9
                  w-9
                  sm:h-11
                  sm:w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-500
                  text-white
                  shadow-lg
                  shadow-pink-500/30
                  transition-all
                  duration-300
                  hover:bg-pink-600
                  hover:scale-110
                  cursor-pointer
                "
              >
                <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Seguinte"
                className="
                  absolute
                  right-2
                  sm:right-3
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-9
                  w-9
                  sm:h-11
                  sm:w-11
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-500
                  text-white
                  shadow-lg
                  shadow-pink-500/30
                  transition-all
                  duration-300
                  hover:bg-pink-600
                  hover:scale-110
                  cursor-pointer
                "
              >
                <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
            </>
          )}
        </div>

        {/* CONTADOR */}
        <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-zinc-500">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}