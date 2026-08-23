import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { productVariantService } from "@/server/services/product-variant.service";

import { updateProductVariantSchema } from "@/validations/product-variant";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const variant =
      await productVariantService.getVariantById(id);

    return NextResponse.json(variant);
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

      if (error.message === "Variant not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to fetch variant",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await requireAdmin();

    const body = updateProductVariantSchema.parse(
      await request.json()
    );

    const { id } = await params;

    const variant =
      await productVariantService.updateVariant(
        id,
        body
      );

    return NextResponse.json(variant);
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

      if (error.message === "Variant not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
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
        message: "Failed to update variant",
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

    const { id } = await params;

    await productVariantService.deleteVariant(id);

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

      if (error.message === "Variant not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to delete variant",
      },
      {
        status: 500,
      }
    );
  }
}