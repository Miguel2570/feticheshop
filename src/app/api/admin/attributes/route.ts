import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { attributeService } from "@/server/services/attribute.service";

import {
  attributeFiltersSchema,
  createAttributeSchema,
} from "@/validations/attribute";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = request.nextUrl.searchParams;

    const filters = attributeFiltersSchema.parse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      isActive:
        searchParams.get("isActive") ?? undefined,
    });

    const attributes =
      await attributeService.getAttributes(filters);

    return NextResponse.json(attributes);
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
        message: "Failed to fetch attributes",
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

    const body = createAttributeSchema.parse(
      await request.json()
    );

    const attribute =
      await attributeService.createAttribute(body);

    return NextResponse.json(attribute, {
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
        message: "Failed to create attribute",
      },
      {
        status: 500,
      }
    );
  }
}