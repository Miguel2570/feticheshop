import { redirect } from "next/navigation";

import { requireAuth } from "@/server/middleware/auth";
import { wishlistService } from "@/server/services/wishlist.service";
import { ProductGrid } from "@/components/product/ProductGrid";

export default async function WishlistPage() {
  let user;

  try {
    user = await requireAuth();
  } catch {
    redirect("/login?redirect=/wishlist");
  }

  const wishlist = await wishlistService.getWishlist(
    user.userId
  );

  const products = wishlist.items.map((item) => ({
    id: item.product.id,
    slug: item.product.slug,
    name: item.product.name,
    description: item.product.description ?? "",
    price: Number(item.product.price),

    compareAtPrice: item.product.comparePrice
      ? Number(item.product.comparePrice)
      : null,

    rating: 5,
    reviews: 0,

    brand: {
      name: item.product.brand?.name ?? "Sem marca",
    },

    images: item.product.images.map((image) => ({
      url: image.url,
    })),
  }));

  return (
    <main className="arabesque-bg relative overflow-hidden min-h-screen">
      <section className="container-custom py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow">
            Favoritos
          </p>

          <h1 className="section-title mt-4">
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #d1105a 0%, #ff2e88 50%, #d1105a 100%)",
              }}
            >
              A Minha Wishlist
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Guarda os produtos que mais gostas para
            os encontrares rapidamente.
          </p>
        </div>

        <div className="mt-20">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-pink-100 bg-white p-16 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">
                A tua wishlist está vazia
              </h2>
              <p className="mt-2 text-zinc-500">
                Adiciona produtos aos favoritos para os encontrares aqui.
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </main>
  );
}