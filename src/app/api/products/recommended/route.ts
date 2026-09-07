// src/app/api/products/recommended/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    console.log("📦 Buscar produtos recomendados...");

    // Buscar produtos ativos, ordenados por mais vendidos ou melhor avaliação
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        // Removido isActive - não existe no modelo
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

    // Se não houver produtos suficientes, buscar outros
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

    console.log(`✅ Total recomendados: ${recommendedProducts.length}`);

    // Mapear para o formato esperado
    const mappedProducts = recommendedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: product.images[0]?.url || "/images/product-placeholder.png",
      rating: product.ratingAverage || 0,
      reviews: product.ratingCount || 0,
    }));

    console.log("📦 Produtos mapeados:", mappedProducts);

    return NextResponse.json({
      success: true,
      products: mappedProducts,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar produtos recomendados:", error);
    return NextResponse.json(
      { success: false, products: [] },
      { status: 500 }
    );
  }
}