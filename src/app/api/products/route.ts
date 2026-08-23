import { NextResponse } from "next/server";

import { productService } from "@/server/services/product.service";

export async function GET() {
  try {
    const products = await productService.getProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}