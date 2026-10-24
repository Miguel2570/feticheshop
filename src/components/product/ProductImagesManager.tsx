// components/admin/products/ProductImagesManager.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  GripVertical,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Video,
} from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
  isPrimary: boolean;
  isHidden: boolean;
  videoUrl?: string | null; // ✅ NOVO
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
  const [loading, setLoading] = useState(false);

  const updateImage = async (
    imageId: string,
    data: Partial<ProductImage>
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar imagem");

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, ...data } : img
        )
      );
      toast.success("Imagem atualizada");
    } catch {
      toast.error("Erro ao atualizar imagem");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm("Tens a certeza que queres remover esta imagem?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/products/${productId}/images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Erro ao remover imagem");

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Imagem removida");
    } catch {
      toast.error("Erro ao remover imagem");
    } finally {
      setLoading(false);
    }
  };

  if (images.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-zinc-200 p-8 text-center">
        <ImageIcon size={40} className="mx-auto text-zinc-300" />
        <p className="mt-3 text-sm text-zinc-500">
          Nenhuma imagem adicionada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {images.map((image) => (
        <div
          key={image.id}
          className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center text-zinc-300">
            <GripVertical size={20} />
          </div>

          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200">
            <Image
              src={image.url}
              alt={image.alt ?? "Imagem"}
              fill
              sizes="80px"
              className="object-contain p-1"
              unoptimized
            />
            {/* ✅ Ícone de vídeo */}
            {image.videoUrl && (
              <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white">
                <Video size={10} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-zinc-500">{image.url}</p>
            {image.videoUrl && (
              <p className="mt-1 truncate text-xs text-pink-500 flex items-center gap-1">
                <Video size={10} />
                {image.videoUrl}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() =>
                updateImage(image.id, { isPrimary: !image.isPrimary })
              }
              disabled={loading}
              title={image.isPrimary ? "Remover principal" : "Definir como principal"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                image.isPrimary
                  ? "bg-pink-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              } disabled:opacity-50`}
            >
              <Star size={16} fill={image.isPrimary ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={() =>
                updateImage(image.id, { isHidden: !image.isHidden })
              }
              disabled={loading}
              title={image.isHidden ? "Mostrar" : "Esconder"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                image.isHidden
                  ? "bg-yellow-500 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              } disabled:opacity-50`}
            >
              {image.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            <button
              type="button"
              onClick={() => deleteImage(image.id)}
              disabled={loading}
              title="Remover imagem"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}