import { NextResponse } from "next/server";
import { getDreamloveProducts } from "@/lib/dreamlove";


export async function GET() {
  try {
    const products = await getDreamloveProducts();

    return NextResponse.json(products);

  } catch (error) {

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}