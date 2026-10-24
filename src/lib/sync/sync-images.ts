import { prisma } from "@/lib/prisma";

const API = process.env.DREAMLOVE_API_URL!;
const USER = process.env.DREAMLOVE_USERNAME!;
const PASS = process.env.DREAMLOVE_PASSWORD!;

const MAX_PRODUCTS_PER_RUN = 10;

type DreamloveImageFile = {
  url: string;
  dimensions?: string;
};

type DreamloveImage = {
  order: number;
  main: boolean;
  relatedVideo?: string | null;
  image?: {
    relatedVideo?: string | null;
    files?: DreamloveImageFile[];
  };
};

export async function syncMissingImages() {
  const inicio = Date.now();

  // 1. Login
  const loginRes = await fetch(`${API}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const { token } = await loginRes.json();
  const headers = { Authorization: `Bearer ${token}` };

  console.log("🔍 A procurar produtos sem imagens...");
  const produtosSemImagem = await prisma.product.findMany({
    where: {
      dreamloveId: { not: null },
      images: { none: {} },
      OR: [
        { lastImageCheck: null },
        { lastImageCheck: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
      ]
    },
    select: { id: true, dreamloveId: true, name: true },
    take: MAX_PRODUCTS_PER_RUN,
    orderBy: { lastImageCheck: { sort: "asc", nulls: "first" } }
  });

  console.log(`   Encontrados ${produtosSemImagem.length} produtos sem imagens.`);

  let imagensAdicionadas = 0;
  let produtosProcessados = 0;

  for (const p of produtosSemImagem) {
    try {
      const res = await fetch(`${API}/products/${p.dreamloveId}`, { headers });
      
      if (!res.ok) {
        await prisma.product.update({
          where: { id: p.id },
          data: { lastImageCheck: new Date() }
        });
        continue;
      }

      const data = await res.json();
      const apiImages: DreamloveImage[] = data.images || [];

      if (apiImages.length === 0) {
        console.log(`⏭️  Sem imagens na Dreamlove: ${p.name}`);
        await prisma.product.update({
          where: { id: p.id },
          data: { lastImageCheck: new Date() }
        });
        continue;
      }

      const imagesToCreate = [];

      for (const item of apiImages) {
        const file = item.image?.files?.[0]; 
        if (!file || !file.url || file.url.trim() === "") continue;

        let videoUrl: string | null = null;
        const rawVideo = item.image?.relatedVideo || item.relatedVideo;

        if (rawVideo && typeof rawVideo === "string") {
          const match = rawVideo.match(/src="([^"]+)"/);
          if (match && match[1]) {
            // Corrige os &amp; para &
            videoUrl = match[1].replace(/&amp;/g, "&");
          }
        }

        let width = null;
        let height = null;
        if (file.dimensions) {
          const parts = file.dimensions.split("x");
          if (parts.length === 2) {
            width = parseInt(parts[0], 10);
            height = parseInt(parts[1], 10);
          }
        }

        imagesToCreate.push({
          productId: p.id,
          url: file.url,
          videoUrl: videoUrl,
          alt: p.name,
          position: item.order,
          isPrimary: item.main,
          width: width,
          height: height,
        });
      }

      if (imagesToCreate.length > 0 && !imagesToCreate.some(img => img.isPrimary)) {
        imagesToCreate[0].isPrimary = true;
      }

      if (imagesToCreate.length > 0) {
        await prisma.productImage.createMany({
          data: imagesToCreate,
        });
        imagensAdicionadas += imagesToCreate.length;
        produtosProcessados++;
        console.log(`🖼️  Imagens adicionadas para: ${p.name}`);
      } else {
        console.log(`⏭️  Imagens inválidas (sem URL): ${p.name}`);
      }

      await prisma.product.update({
        where: { id: p.id },
        data: { lastImageCheck: new Date() }
      });

    } catch (err) {
      console.error(`❌ Erro ao processar imagens do produto ${p.dreamloveId}:`, err);
    }
  }

  return {
    produtosProcessados,
    imagensAdicionadas,
    duracaoSegundos: Math.round((Date.now() - inicio) / 1000),
  };
}