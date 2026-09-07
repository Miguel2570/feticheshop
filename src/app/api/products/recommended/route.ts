// src/app/api/products/recommended/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: { position: "asc" },
          take: 1,
        },
      },
      orderBy: [
        { soldCount: "desc" },
        { ratingAverage: "desc" },
      ],
      take: 50,
    });

    console.log(`✅ ${products.length} produtos encontrados`);

    let recommendedProducts = products;

    if (recommendedProducts.length < 4) {
      const moreProducts = await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          id: { notIn: recommendedProducts.map((p) => p.id) },
        },
        include: {
          images: {
            orderBy: { position: "asc" },
            take: 1,
          },
        },
        take: 4 - recommendedProducts.length,
      });

      recommendedProducts = [...recommendedProducts, ...moreProducts];
    }

    const mappedProducts = recommendedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.images[0]?.url || "/images/product-placeholder.png",
      rating: product.ratingAverage || 0,
      reviews: product.ratingCount || 0,
    }));

    return NextResponse.json({
      success: true,
      products: mappedProducts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, products: [] },
      { status: 500 }
    );
  }
}