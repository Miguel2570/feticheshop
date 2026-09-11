// src/app/api/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim() ?? "";

    if (query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        stock: { gt: 0 },
        name: { contains: query, mode: "insensitive" }, // ✅ Só por nome
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        brand: {
          select: { name: true },
        },
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
      },
      orderBy: {
        soldCount: "desc",
      },
      take: 8,
    });

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        brand: p.brand,
        images: p.images,
      })),
    });
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}