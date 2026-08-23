import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireAdmin } from "@/server/middleware/admin";
import { inventoryService } from "@/server/services/inventory.service";

import {
  createInventoryMovementSchema,
  inventoryFiltersSchema,
} from "@/validations/inventory";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const searchParams =
      request.nextUrl.searchParams;

    const filters =
      inventoryFiltersSchema.parse({
        page:
          searchParams.get("page") ??
          undefined,

        limit:
          searchParams.get("limit") ??
          undefined,

        variantId:
          searchParams.get(
            "variantId"
          ) ?? undefined,

        type:
          searchParams.get("type") ??
          undefined,
      });

    const data =
      await inventoryService.getMovements(
        filters
      );

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      (error.message ===
        "Unauthorized" ||
        error.message ===
          "Forbidden")
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status:
            error.message ===
            "Unauthorized"
              ? 401
              : 403,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Failed to fetch inventory",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await requireAdmin();

    const body =
      createInventoryMovementSchema.parse(
        await request.json()
      );

    const movement =
      await inventoryService.createMovement(
        body
      );

    return NextResponse.json(
      movement,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message:
            "Validation failed",
          errors:
            error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    if (error instanceof Error) {
      switch (error.message) {
        case "Unauthorized":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 401,
            }
          );

        case "Forbidden":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 403,
            }
          );

        case "Variant not found":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 404,
            }
          );

        case "Insufficient stock":
          return NextResponse.json(
            {
              message:
                error.message,
            },
            {
              status: 409,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to create inventory movement",
      },
      {
        status: 500,
      }
    );
  }
}