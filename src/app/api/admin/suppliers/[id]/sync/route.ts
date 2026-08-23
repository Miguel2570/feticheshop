import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const supplier = await prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        {
          success: false,
          message: "Fornecedor não encontrado.",
        },
        {
          status: 404,
        }
      );
    }

    if (!supplier.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "O fornecedor está inativo.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      supplierId: supplier.id,
      message: "Fornecedor validado.",
    });
  } catch (error) {
    console.error(
      "Erro ao validar fornecedor:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro interno ao validar fornecedor.",
      },
      {
        status: 500,
      }
    );
  }
}