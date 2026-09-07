// scripts/download-images.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function downloadImage(url: string, filePath: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Referer": "https://dreamlove.gesio.be/",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("📥 A descarregar imagens...\n");

  const imagesDir = path.join(process.cwd(), "public/images/produtos");
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Contar total de imagens que AINDA SÃO externas
  const totalImages = await prisma.productImage.count({
    where: {
      url: { startsWith: "https://dreamlove.gesio.be" },
    },
  });

  console.log(`Imagens externas restantes: ${totalImages}\n`);

  if (totalImages === 0) {
    console.log("✅ Todas as imagens já estão locais!");
    return;
  }

  let processed = 0;
  let success = 0;
  let failed = 0;
  let alreadyLocal = 0;

  // Processar em lotes de 100
  while (processed < totalImages) {
    // ✅ Buscar APENAS imagens que ainda são externas
    const images = await prisma.productImage.findMany({
      where: {
        url: { startsWith: "https://dreamlove.gesio.be" },
      },
      select: { id: true, url: true },
      skip: processed,
      take: 100,
    });

    if (images.length === 0) break;

    for (const image of images) {
      processed++;

      try {
        const fileName = image.url.split("/").pop() || `image_${image.id}.jpg`;
        const filePath = path.join(imagesDir, fileName);
        const localUrl = `/images/produtos/${fileName}`;

        // ✅ Se o ficheiro já existe localmente, só atualiza a BD
        if (fs.existsSync(filePath)) {
          await prisma.productImage.update({
            where: { id: image.id },
            data: { url: localUrl },
          });
          alreadyLocal++;
          success++;
          continue;
        }

        // Descarregar
        await downloadImage(image.url, filePath);

        // Atualizar BD
        await prisma.productImage.update({
          where: { id: image.id },
          data: { url: localUrl },
        });

        success++;

        if (success % 50 === 0) {
          console.log(`✅ ${success}/${totalImages} processadas`);
        }
      } catch (error: unknown) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : "Erro";
        
        if (failed <= 5) {
          console.error(`❌ Falha (${errorMessage}): ${image.url.substring(0, 60)}...`);
        }
      }

      await sleep(200);
    }
  }

  console.log(`\n📊 Resumo final:`);
  console.log(`✅ Total processadas: ${success}`);
  console.log(`📁 Já existiam localmente: ${alreadyLocal}`);
  console.log(`❌ Falhadas: ${failed}`);
  console.log(`📁 Local: ${imagesDir}`);
  console.log(`\n💡 Executa o script novamente para tentar as falhadas.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });