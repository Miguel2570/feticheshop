"use server";

import { ProductStatus } from "@prisma/client";

import { productService } from "@/services/product.service";

interface GetProductsParams {
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

export async function getProducts(
  params: GetProductsParams = {},
) {
  try {
    const products =
      await productService.getProducts(params);

    return {
      success: true,
      ...products,
    };
  } catch (error) {
    console.error(
      "[Products]",
      error,
    );

    return {
      success: false,

      data: [],

      pagination: {
        page: 1,
        perPage: 20,
        pages: 0,
        total: 0,
      },
    };
  }
}