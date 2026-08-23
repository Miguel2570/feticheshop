"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({
  images,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const currentImage =
    images[selectedImage] ??
    "/images/product-placeholder.png";

  return (
    <div className="flex flex-col gap-6">

      {/* Imagem principal */}

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
          alt="Produto"
          fill
          priority
          sizes="(max-width:768px)100vw,700px"
          className="
            object-contain
            p-10
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />
      </div>

      {/* Miniaturas */}

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">

          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`
                relative
                aspect-square
                overflow-hidden
                rounded-2xl
                border-2
                bg-pink-50/50
                transition
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
                alt={`Imagem ${index + 1}`}
                fill
                sizes="120px"
                className="object-contain p-3"
              />
            </button>
          ))}

        </div>
      )}

    </div>
  );
}