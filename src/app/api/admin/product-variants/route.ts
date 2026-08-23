import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { productVariantService } from "@/server/services/product-variant.service";

import {
  createProductVariantSchema,
  productVariantFiltersSchema,
} from "@/validations/product-variant";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const filters = productVariantFiltersSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      productId:
        searchParams.get("productId") ?? undefined,
      isActive:
        searchParams.get("isActive") ?? undefined,
    });

    const variants =
      await productVariantService.getVariants(filters);

    return NextResponse.json(variants);
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
        message: "Failed to fetch variants",
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

    const body = createProductVariantSchema.parse(
      await request.json()
    );

    const variant =
      await productVariantService.createVariant(
        body
      );

    return NextResponse.json(variant, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

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

      if (error.message === "SKU already exists") {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to create variant",
      },
      {
        status: 500,
      }
    );
  }
}