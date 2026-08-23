import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { attributeService } from "@/server/services/attribute.service";

import { updateAttributeSchema } from "@/validations/attribute";

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

    const attribute =
      await attributeService.getAttributeById(id);

    return NextResponse.json(attribute);
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

      if (error.message === "Attribute not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to fetch attribute",
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

    const body = updateAttributeSchema.parse(
      await request.json()
    );

    const { id } = await params;

    const attribute =
      await attributeService.updateAttribute(
        id,
        body
      );

    return NextResponse.json(attribute);
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

      if (error.message === "Attribute not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
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
        message: "Failed to update attribute",
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

    await attributeService.deleteAttribute(id);

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

      if (error.message === "Attribute not found") {
        return NextResponse.json(
          { message: error.message },
          { status: 404 }
        );
      }

      if (
        error.message ===
        "Cannot delete attribute with values"
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to delete attribute",
      },
      {
        status: 500,
      }
    );
  }
}