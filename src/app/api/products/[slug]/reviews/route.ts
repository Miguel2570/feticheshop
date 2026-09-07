// src/app/api/products/[slug]/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/server/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      reviews,
      average: Math.round(average * 10) / 10,
      total: reviews.length,
    });
  } catch (error) {
    console.error("Erro ao buscar reviews:", error);
    return NextResponse.json(
      { message: "Erro ao buscar reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await requireAuth();
    const { slug } = await params;
    const body = await request.json();

    const { rating, comment, title, images } = body; // ✅ Adicionado images

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating inválido" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length < 3) {
      return NextResponse.json(
        { message: "Comentário muito curto" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: user.userId,
        rating,
        comment: comment.trim(),
        title: title?.trim() || null,
        verified: true,
        images: Array.isArray(images) ? images : [],
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar review:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Precisas de iniciar sessão" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao criar review" },
      { status: 500 }
    );
  }
}