import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/server/middleware/admin";
import { inventoryService } from "@/server/services/inventory.service";

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

    const movement =
      await inventoryService.getMovement(id);

    return NextResponse.json(movement);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      switch (error.message) {
        case "Unauthorized":
          return NextResponse.json(
            {
              message: error.message,
            },
            {
              status: 401,
            }
          );

        case "Forbidden":
          return NextResponse.json(
            {
              message: error.message,
            },
            {
              status: 403,
            }
          );

        case "Inventory movement not found":
          return NextResponse.json(
            {
              message: error.message,
            },
            {
              status: 404,
            }
          );
      }
    }

    return NextResponse.json(
      {
        message:
          "Failed to fetch inventory movement",
      },
      {
        status: 500,
      }
    );
  }
}