"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Star, ImagePlus, X, Camera } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductReviewsProps {
  slug: string;
}

interface ReviewUser {
  firstName: string | null;
  lastName: string | null;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  verified: boolean;
  createdAt: string;
  images: string[];
  user: ReviewUser;
}

type FilterType = "all" | "5" | "4" | "3" | "2" | "1" | "photos";

export function ProductReviews({ slug }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/products/${slug}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
          setAverage(data.average);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Erro ao carregar reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [slug]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") {
      return reviews;
    }
    if (activeFilter === "photos") {
      return reviews.filter((review) => review.images && review.images.length > 0);
    }
    const ratingValue = parseInt(activeFilter);
    return reviews.filter((review) => review.rating === ratingValue);
  }, [activeFilter, reviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    reviews.forEach((review) => {
      counts[String(review.rating)]++;
    });
    return counts;
  }, [reviews]);

  const photoCount = useMemo(() => {
    return reviews.filter((review) => review.images && review.images.length > 0).length;
  }, [reviews]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer upload");
      }

      setImages((prev) => [...prev, ...data.urls]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment, title, images }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
          return;
        }
        throw new Error(data.message || "Erro ao criar review");
      }

      setSuccess("Avaliação enviada com sucesso!");
      setComment("");
      setTitle("");
      setRating(5);
      setImages([]);

      const refreshResponse = await fetch(`/api/products/${slug}/reviews`);
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setReviews(refreshData.reviews);
        setAverage(refreshData.average);
        setTotal(refreshData.total);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Rating médio + Filtros */}
      <div className="rounded-2xl bg-pink-50/50 p-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold text-zinc-900">
            {average.toFixed(1)}
          </span>
          <div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-zinc-600">
              {total} {total === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-pink-100 pt-5">
          <button
            onClick={() => setActiveFilter("all")}
            className={`
              flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer min-w-[100px] justify-center
              ${activeFilter === "all" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25" : "bg-white text-zinc-700 border border-pink-200 hover:border-pink-400 hover:bg-pink-50"}
            `}
          >
            Todas
            <span className="text-xs font-medium opacity-70">({total})</span>
          </button>

          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setActiveFilter(String(star) as FilterType)}
              className={`
                flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer min-w-[80px] justify-center
                ${activeFilter === String(star) ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25" : "bg-white text-zinc-700 border border-pink-200 hover:border-pink-400 hover:bg-pink-50"}
              `}
            >
              <Star size={16} className={activeFilter === String(star) ? "fill-white" : "fill-yellow-400 text-yellow-400"} />
              {star}
              <span className="text-xs font-medium opacity-70">({ratingCounts[String(star)]})</span>
            </button>
          ))}

          {/* ✅ Filtro Com Fotos */}
          <button
            onClick={() => setActiveFilter("photos")}
            className={`
              flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer min-w-[100px] justify-center
              ${activeFilter === "photos" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25" : "bg-white text-zinc-700 border border-pink-200 hover:border-pink-400 hover:bg-pink-50"}
            `}
          >
            <Camera size={16} className={activeFilter === "photos" ? "fill-white" : "text-zinc-500"} />
            Fotos
            <span className="text-xs font-medium opacity-70">({photoCount})</span>
          </button>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-pink-100 bg-white p-6">
        <h4 className="font-semibold text-zinc-900">Escrever avaliação</h4>

        <div>
          <label className="mb-2 block text-sm text-zinc-700">Classificação</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="cursor-pointer"
              >
                <Star
                  size={24}
                  className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 hover:text-yellow-400"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-700">Título (opcional)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resumo da tua experiência"
            className="h-12 w-full rounded-xl border border-pink-200 px-4 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-700">Comentário</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Conta-nos a tua experiência..."
            className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* ✅ Upload de imagens */}
        <div>
          <label className="mb-2 block text-sm text-zinc-700">Fotos (opcional)</label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="
              inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-pink-300 px-4 py-3 text-sm font-medium text-pink-500 transition-all hover:border-pink-500 hover:bg-pink-50 cursor-pointer disabled:opacity-50
            "
          >
            <ImagePlus size={18} />
            {uploading ? "A fazer upload..." : "Adicionar fotos"}
          </button>

          {/* Pré-visualização das imagens */}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={image} className="relative h-20 w-20 overflow-hidden rounded-xl border border-pink-200">
                  <Image
                    src={image}
                    alt={`Foto ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 items-center justify-center rounded-full bg-pink-500 px-8 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50"
        >
          {submitting ? "A enviar..." : "Enviar Avaliação"}
        </button>
      </form>

      {/* Lista */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-zinc-500">A carregar avaliações...</p>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pink-200 p-8 text-center">
            <p className="text-zinc-500">
              {activeFilter === "all"
                ? "Ainda não há avaliações. Sê o primeiro!"
                : activeFilter === "photos"
                ? "Nenhuma avaliação com fotos."
                : `Nenhuma avaliação com ${activeFilter} estrela${activeFilter === "1" ? "" : "s"}.`}
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-pink-100 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-300"}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString("pt-PT")}
                </span>
              </div>

              {review.title && (
                <h5 className="mt-3 font-semibold text-zinc-900">{review.title}</h5>
              )}

              <p className="mt-2 text-sm leading-7 text-zinc-600">{review.comment}</p>

              {/* ✅ Fotos da review */}
              {review.images && review.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.images.map((image, index) => (
                    <div key={image} className="relative h-24 w-24 overflow-hidden rounded-xl border border-pink-200">
                      <Image
                        src={image}
                        alt={`Foto ${index + 1} da review`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-3 text-xs font-medium text-zinc-500">
                {review.user?.firstName} {review.user?.lastName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}