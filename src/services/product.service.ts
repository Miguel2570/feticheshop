import { ProductStatus } from "@prisma/client";

import { productRepository } from "@/repositories/product.repository";

interface GetProductsOptions {
  search?: string;

  status?: ProductStatus;

  page?: number;

  perPage?: number;

  brandId?: string;

  categoryId?: string;

  featured?: boolean;

  onSale?: boolean;

  sort?:
    | "newest"
    | "oldest"
    | "priceAsc"
    | "priceDesc"
    | "stockAsc"
    | "stockDesc"
    | "name";
}

export class ProductService {
  async getProducts(options: GetProductsOptions = {}) {
    const {
      search,
      status,
      page = 1,
      perPage = 20,
      brandId,
      categoryId,
      featured,
      onSale,
      sort = "newest",
    } = options;

    const products =
      await productRepository.findMany();

    let filtered = [...products];

    if (search) {
      const value = search.toLowerCase();

      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(value) ||
          product.slug
            .toLowerCase()
            .includes(value) ||
          product.sku
            ?.toLowerCase()
            .includes(value),
      );
    }

    if (status) {
      filtered = filtered.filter(
        (p) => p.status === status,
      );
    }

    if (brandId) {
      filtered = filtered.filter(
        (p) => p.brandId === brandId,
      );
    }

    if (categoryId) {
      filtered = filtered.filter((p) =>
        p.categories.some(
          (c) => c.categoryId === categoryId,
        ),
      );
    }

    if (featured !== undefined) {
      filtered = filtered.filter(
        (p) => p.isFeatured === featured,
      );
    }

    if (onSale !== undefined) {
      filtered = filtered.filter(
        (p) => p.isOnSale === onSale,
      );
    }

    switch (sort) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            a.createdAt.getTime() -
            b.createdAt.getTime(),
        );
        break;

      case "priceAsc":
        filtered.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price),
        );
        break;

      case "priceDesc":
        filtered.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price),
        );
        break;

      case "stockAsc":
        filtered.sort(
          (a, b) =>
            a.stock - b.stock,
        );
        break;

      case "stockDesc":
        filtered.sort(
          (a, b) =>
            b.stock - a.stock,
        );
        break;

      case "name":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        break;

      default:
        filtered.sort(
          (a, b) =>
            b.createdAt.getTime() -
            a.createdAt.getTime(),
        );
    }

    const total = filtered.length;

    const pages = Math.ceil(
      total / perPage,
    );

    const data = filtered.slice(
      (page - 1) * perPage,
      page * perPage,
    );

    return {
      data,

      pagination: {
        page,
        perPage,
        pages,
        total,
      },
    };
  }

  async getProduct(id: string) {
    return productRepository.findById(id);
  }
}

export const productService =
  new ProductService();