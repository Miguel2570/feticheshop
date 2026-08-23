import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { categoryService } from "@/server/services/category.service";

import { updateCategorySchema } from "@/validations/category";

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

    const category =
      await categoryService.getCategoryById(id);

    return NextResponse.json(category);
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

      if (error.message === "Category not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to fetch category",
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

    const body = updateCategorySchema.parse(
      await request.json()
    );

    const { id } = await params;

    const category =
      await categoryService.updateCategory(
        id,
        body
      );

    return NextResponse.json(category);
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

      if (error.message === "Category not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }

      if (
        error.message === "Slug already exists" ||
        error.message ===
          "Category cannot be its own parent"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to update category",
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

    await categoryService.deleteCategory(id);

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

      if (error.message === "Category not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }

      if (
        error.message ===
          "Cannot delete category with children" ||
        error.message ===
          "Cannot delete category with products"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to delete category",
      },
      {
        status: 500,
      }
    );
  }
}