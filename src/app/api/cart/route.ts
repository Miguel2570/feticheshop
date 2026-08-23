import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/server/middleware/auth";
import { cartService } from "@/server/services/cart.service";

/* =========================================================
   GET /api/cart
   Obter carrinho do utilizador autenticado
========================================================= */

export async function GET() {
  try {
    const user = await requireAuth();

    const cart = await cartService.getCart(user.userId);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("GET /api/cart:", error);

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch cart",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST /api/cart
   Adicionar produto ao carrinho
========================================================= */

export async function POST(
  request: NextRequest
) {
  try {
    const user = await requireAuth();

    const body = await request.json();

    const productId =
      typeof body.productId === "string"
        ? body.productId
        : "";

    const quantity =
      typeof body.quantity === "number"
        ? body.quantity
        : Number(body.quantity ?? 1);

    const variantId =
      typeof body.variantId === "string"
        ? body.variantId
        : undefined;

    /* -------------------------------------------------------
       VALIDAR PRODUCT ID
    ------------------------------------------------------- */

    if (!productId) {
      return NextResponse.json(
        {
          message: "Product ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       VALIDAR QUANTITY
    ------------------------------------------------------- */

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Quantity must be a positive integer",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       ADICIONAR AO CARRINHO
    ------------------------------------------------------- */

    const cart =
      await cartService.addItem(
        user.userId,
        productId,
        quantity,
        variantId
      );

    return NextResponse.json(cart);
  } catch (error) {
    console.error("POST /api/cart:", error);

    /* -------------------------------------------------------
       NÃO AUTENTICADO
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Unauthorized"
    ) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /* -------------------------------------------------------
       PRODUTO NÃO ENCONTRADO
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Product not found"
    ) {
      return NextResponse.json(
        {
          message: "Produto não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------------
       PRODUTO INDISPONÍVEL
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Product unavailable"
    ) {
      return NextResponse.json(
        {
          message:
            "Este produto não está disponível",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       VARIANTE NÃO ENCONTRADA
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Variant not found"
    ) {
      return NextResponse.json(
        {
          message:
            "Variante não encontrada",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------------
       VARIANTE INDISPONÍVEL
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Variant unavailable"
    ) {
      return NextResponse.json(
        {
          message:
            "Esta variante não está disponível",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       STOCK INSUFICIENTE
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message === "Insufficient stock"
    ) {
      return NextResponse.json(
        {
          message:
            "Stock insuficiente para este produto",
        },
        {
          status: 409,
        }
      );
    }

    /* -------------------------------------------------------
       QUANTIDADE INVÁLIDA
    ------------------------------------------------------- */

    if (
      error instanceof Error &&
      error.message ===
        "Quantity must be greater than zero"
    ) {
      return NextResponse.json(
        {
          message:
            "A quantidade deve ser superior a zero",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       ERRO GENÉRICO
    ------------------------------------------------------- */

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to add item to cart",
      },
      {
        status: 500,
      }
    );
  }
}