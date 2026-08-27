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
    <div className="flex gap-4 sm:gap-6">
      {/* COLUNA DE MINIATURAS - ESQUERDA */}
      <div className="flex w-24 sm:w-28 shrink-0 flex-col gap-2">
        {/* SETA CIMA */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Imagem anterior"
          className="
            flex h-9 w-9 mx-auto items-center justify-center
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

        {/* MINIATURAS */}
        <div
          ref={thumbnailsRef}
          className="flex max-h-[420px] flex-col items-center gap-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`
                relative
                aspect-square
                w-full
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
                sizes="112px"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>

        {/* SETA BAIXO */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Imagem seguinte"
          className="
            flex h-9 w-9 mx-auto items-center justify-center
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
      </div>

      {/* IMAGEM PRINCIPAL */}
      <div className="relative min-w-0 flex-1">
        <div
          className="
            group
            relative
            aspect-square
            overflow-hidden
            rounded-[32px]
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
            sizes="(max-width:768px)100vw,600px"
            className="
              object-contain
              p-8
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
                  left-3
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-11
                  w-11
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
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Seguinte"
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  flex
                  h-11
                  w-11
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
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* CONTADOR */}
        <div className="mt-3 text-center text-sm text-zinc-500">
          {selectedImage + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}