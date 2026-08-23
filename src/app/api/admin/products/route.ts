import { NextRequest, NextResponse } from "next/server";

import { productService } from "@/server/services/product.service";
import { requireAdmin } from "@/server/middleware/admin";

import { createProductSchema } from "@/validations/product";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "20"
    );

    const search =
      searchParams.get("search") ?? "";

    const products =
      await productService.listProducts(
        page,
        limit,
        search
      );

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { message: error.message },
          { status: 401 }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          { message: error.message },
          { status: 403 }
        );
      }
    }

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

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = createProductSchema.parse(
      await request.json()
    );

    const product =
      await productService.createProduct(body);

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { message: error.message },
          { status: 401 }
        );
      }

      if (error.message === "Forbidden") {
        return NextResponse.json(
          { message: error.message },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to create product",
      },
      {
        status: 500,
      }
    );
  }
}