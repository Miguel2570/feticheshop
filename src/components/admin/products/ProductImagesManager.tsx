// src/components/admin/products/ProductImagesManager.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Star,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
}

interface ProductImagesManagerProps {
  productId: string;
  images: ProductImage[];
}

export function ProductImagesManager({
  productId,
  images: initialImages,
}: ProductImagesManagerProps) {
  const [images, setImages] = useState(initialImages);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [hiddenImages, setHiddenImages] = useState<Set<string>>(new Set());

  // ✅ Definir como principal
  async function handleSetPrimary(imageId: string) {
    setLoadingId(imageId);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId, isPrimary: true }),
        }
      );

      if (!response.ok) throw new Error("Erro");

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao definir imagem principal");
    } finally {
      setLoadingId(null);
    }
  }

  // ✅ Remover imagem
  async function handleDelete(imageId: string) {
    if (!confirm("Tens a certeza que queres remover esta imagem?")) return;

    setLoadingId(imageId);

    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId }),
        }
      );

      if (!response.ok) throw new Error("Erro");

      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error(error);
      alert("Erro ao remover imagem");
    } finally {
      setLoadingId(null);
    }
  }

  // ✅ Esconder/mostrar (apenas visual no admin, não afeta o frontend por agora)
  function handleToggleHidden(imageId: string) {
    setHiddenImages((prev) => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  }

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <p className="text-sm text-zinc-500">
          Este produto não tem imagens.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {images.map((image) => {
        const isLoading = loadingId === image.id;
        const isHidden = hiddenImages.has(image.id);

        return (
          <div
            key={image.id}
            className={`
              group relative overflow-hidden rounded-xl border-2 bg-white shadow-sm
              transition-all
              ${
                image.isPrimary
                  ? "border-pink-500 ring-2 ring-pink-500/20"
                  : "border-zinc-200"
              }
              ${isHidden ? "opacity-40" : ""}
            `}
          >
            {/* IMAGEM */}
            <div className="relative aspect-square w-full bg-zinc-50">
              <Image
                src={image.url}
                alt={image.alt ?? "Imagem"}
                fill
                sizes="200px"
                className="object-contain p-2"
                unoptimized
              />

              {/* BADGE PRINCIPAL */}
              {image.isPrimary && (
                <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg">
                  <Star size={12} fill="currentColor" />
                </div>
              )}

              {/* LOADING OVERLAY */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <Loader2 size={24} className="animate-spin text-pink-500" />
                </div>
              )}
            </div>

            {/* AÇÕES */}
            <div className="flex items-center justify-between gap-1 border-t border-zinc-100 bg-white p-2">
              {/* DEFINIR PRINCIPAL */}
              <button
                type="button"
                onClick={() => handleSetPrimary(image.id)}
                disabled={image.isPrimary || isLoading}
                title={
                  image.isPrimary
                    ? "Já é a principal"
                    : "Definir como principal"
                }
                className={`
                  flex h-8 w-8 items-center justify-center rounded-lg transition-all
                  ${
                    image.isPrimary
                      ? "cursor-default bg-pink-50 text-pink-500"
                      : "cursor-pointer text-zinc-500 hover:bg-pink-50 hover:text-pink-500"
                  }
                  disabled:opacity-50
                `}
              >
                {image.isPrimary ? (
                  <Check size={16} />
                ) : (
                  <Star size={16} />
                )}
              </button>

              {/* ESCONDER/MOSTRAR */}
              <button
                type="button"
                onClick={() => handleToggleHidden(image.id)}
                disabled={isLoading}
                title={isHidden ? "Mostrar" : "Esconder"}
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg
                  text-zinc-500 transition-all
                  hover:bg-zinc-100 hover:text-zinc-700
                  cursor-pointer disabled:opacity-50
                "
              >
                {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              {/* REMOVER */}
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={isLoading}
                title="Remover imagem"
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg
                  text-zinc-500 transition-all
                  hover:bg-red-50 hover:text-red-500
                  cursor-pointer disabled:opacity-50
                "
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}