export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: boolean;
  sku: string;
  category: string;
  images: string[];
  features: string[];
  specifications: {
    material: string;
    color: string;
    size: string;
    waterproof: boolean;
    dimensions?: string;
    weight?: string;
    battery?: string;
  };
}