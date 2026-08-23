import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { categoryService } from "@/server/services/category.service";

import {
  categoryFiltersSchema,
  createCategorySchema,
} from "@/validations/category";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const filters = categoryFiltersSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      parentId:
        searchParams.get("parentId") ?? undefined,
      isActive:
        searchParams.get("isActive") ?? undefined,
    });

    const categories =
      await categoryService.getCategories(filters);

    return NextResponse.json(categories);
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
        message: "Failed to fetch categories",
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

    const body = createCategorySchema.parse(
      await request.json()
    );

    const category =
      await categoryService.createCategory(body);

    return NextResponse.json(category, {
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

      if (error.message === "Slug already exists") {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to create category",
      },
      {
        status: 500,
      }
    );
  }
}