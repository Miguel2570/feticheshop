import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { productVariantValueService } from "@/server/services/product-variant-value.service";

interface RouteParams {
  params: Promise<{
    variantId: string;
    attributeValueId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const {
      variantId,
      attributeValueId,
    } = await params;

    const values =
      await productVariantValueService.getValues(
        variantId
      );

    const relation = values.find(
      (value) =>
        value.attributeValueId ===
        attributeValueId
    );

    if (!relation) {
      return NextResponse.json(
        {
          message: "Relation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(relation);
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
        message: "Failed to fetch relation",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const {
      variantId,
      attributeValueId,
    } = await params;

    await productVariantValueService.deleteValue(
      variantId,
      attributeValueId
    );

    return NextResponse.json({
      success: true,
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

      if (
        error.message ===
        "Relation not found"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to delete relation",
      },
      {
        status: 500,
      }
    );
  }
}