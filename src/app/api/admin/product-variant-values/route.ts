import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { productVariantValueService } from "@/server/services/product-variant-value.service";

import {
  createProductVariantValueSchema,
  productVariantValueFiltersSchema,
} from "@/validations/product-variant-value";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const filters =
      productVariantValueFiltersSchema.parse({
        variantId:
          searchParams.get("variantId") ??
          undefined,
      });

    const values =
      await productVariantValueService.getValues(
        filters.variantId
      );

    return NextResponse.json(values);
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
        message:
          "Failed to fetch variant values",
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

    const body =
      createProductVariantValueSchema.parse(
        await request.json()
      );

    const value =
      await productVariantValueService.createValue(
        body
      );

    return NextResponse.json(value, {
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

      if (
        error.message ===
          "Variant not found" ||
        error.message ===
          "Attribute value not found"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }

      if (
        error.message ===
          "Attribute value already assigned" ||
        error.message ===
          "Variant already has a value for this attribute"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to create relation",
      },
      {
        status: 500,
      }
    );
  }
}