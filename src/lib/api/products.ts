export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  isFeatured: boolean;
  isNew: boolean;
  images: ProductImage[];
}

export async function getFeaturedProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products?featured=true`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json() as Promise<Product[]>;
}