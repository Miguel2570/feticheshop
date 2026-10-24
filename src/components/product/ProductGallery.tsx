"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Play, Maximize2 } from "lucide-react";

export interface GalleryItem {
  url: string;
  videoUrl?: string | null;
}

interface ProductGalleryProps {
  items: GalleryItem[];
}

export function ProductGallery({ items }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const currentItem = items[selectedIndex];

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsVideoPlaying(false);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setIsVideoPlaying(false);
  }, [items.length]);

  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[selectedIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[32px] border border-pink-100 bg-pink-50/50">
        <Image src="/images/product-placeholder.png" alt="Sem imagem" width={300} height={300} className="object-contain" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6">
      {/* COLUNA DE MINIATURAS */}
      <div className="order-2 sm:order-1 flex w-full sm:w-24 sm:flex-col lg:w-28 shrink-0 gap-2 min-w-0">
        <button type="button" onClick={handlePrev} aria-label="Anterior" className="hidden sm:flex h-9 w-9 mx-auto items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-600 shadow-sm transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 cursor-pointer shrink-0">
          <ChevronUp size={18} />
        </button>
        <button type="button" onClick={handlePrev} aria-label="Anterior" className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-600 shadow-sm transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 cursor-pointer shrink-0 self-center">
          <ChevronLeft size={16} />
        </button>

        <div ref={thumbnailsRef} className="flex-1 flex items-center gap-2 overflow-x-auto sm:max-h-[420px] sm:flex-col sm:overflow-y-auto sm:overflow-x-hidden sm:pr-1 scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-50 pb-1 sm:pb-0 min-w-0">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setIsVideoPlaying(false);
              }}
              className={`relative aspect-square w-16 sm:w-full shrink-0 overflow-hidden rounded-xl border-2 bg-pink-50/50 transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? "border-pink-500 shadow-lg shadow-pink-500/20"
                  : "border-pink-100 hover:border-pink-300 hover:shadow-md"
              }`}
            >
              <Image
                src={item.url}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 640px) 64px, 112px"
                className="object-contain p-1.5 sm:p-2"
              />
              {item.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-pink-600">
                    <Play size={12} fill="currentColor" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <button type="button" onClick={handleNext} aria-label="Seguinte" className="hidden sm:flex h-9 w-9 mx-auto items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-600 shadow-sm transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 cursor-pointer shrink-0">
          <ChevronDown size={18} />
        </button>
        <button type="button" onClick={handleNext} aria-label="Seguinte" className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-600 shadow-sm transition-all duration-300 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 cursor-pointer shrink-0 self-center">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* IMAGEM/VIDEO PRINCIPAL */}
      <div className="relative min-w-0 flex-1 order-1 sm:order-2 w-full">
        <div className="group relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-[32px] border border-pink-100 bg-pink-50/50 shadow-sm">
          
          {/* ✅ SE TIVER VÍDEO, MOSTRA O IFRAME COM CONTROLES */}
          {currentItem.videoUrl ? (
            <div className="relative h-full w-full">
              {/* Overlay de "play" se o vídeo ainda não estiver a tocar */}
              {!isVideoPlaying && (
                <div 
                  className="absolute inset-0 z-20 flex cursor-pointer items-center justify-center bg-black/40 transition-opacity hover:bg-black/50"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-pink-600 shadow-xl transition-transform hover:scale-110">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
              )}
              
              {/* Iframe do Vimeo/YouTube (com controlos nativos) */}
              <iframe
                src={isVideoPlaying ? currentItem.videoUrl : `${currentItem.videoUrl}?autoplay=1`}
                title="Vídeo do produto"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full rounded-2xl sm:rounded-[32px]"
              />
            </div>
          ) : (
            <Image
              src={currentItem.url}
              alt={`Imagem ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 600px"
              className="object-contain p-4 sm:p-8 transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Navegação (só se houver mais de 1 item) */}
          {items.length > 1 && (
            <>
              <button type="button" onClick={handlePrev} aria-label="Anterior" className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:bg-pink-600 hover:scale-110 cursor-pointer z-10">
                <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
              <button type="button" onClick={handleNext} aria-label="Seguinte" className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:bg-pink-600 hover:scale-110 cursor-pointer z-10">
                <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
            </>
          )}
        </div>

        <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-zinc-500">
          {selectedIndex + 1} / {items.length}
        </div>
      </div>
    </div>
  );
}