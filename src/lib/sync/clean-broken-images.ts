import { prisma } from "@/lib/prisma";

export async function cleanBrokenImages() {
  const inicio = Date.now();
  console.log("🔍 A iniciar limpeza de imagens quebradas...");

  // Vai buscar as 2.000 imagens mais antigas (para não estourar o tempo da Vercel)
  const imagens = await prisma.productImage.findMany({
    select: { id: true, url: true },
    take: 2000,
    orderBy: { createdAt: "asc" } 
  });

  if (imagens.length === 0) {
    return { totalAnalisado: 0, imagensQuebradasApagadas: 0, duracaoSegundos: 0 };
  }

  let quebradas = 0;
  const imagensParaApagar: string[] = [];

  // Testa os links em lotes de 50 para ser rápido
  for (let i = 0; i < imagens.length; i += 50) {
    const lote = imagens.slice(i, i + 50);
    
    const resultados = await Promise.all(
      lote.map(async (img) => {
        try {
          // HEAD request: verifica se o link existe sem descarregar a imagem toda
          const res = await fetch(img.url, { method: "HEAD" });
          return { id: img.id, quebrada: !res.ok };
        } catch {
          return { id: img.id, quebrada: true };
        }
      })
    );

    for (const res of resultados) {
      if (res.quebrada) {
        imagensParaApagar.push(res.id);
        quebradas++;
      }
    }
  }

  // Apaga as imagens quebradas da BD
  if (quebradas > 0) {
    console.log(`🧹 A apagar ${quebradas} imagens quebradas...`);
    for (let i = 0; i < imagensParaApagar.length; i += 500) {
      const batch = imagensParaApagar.slice(i, i + 500);
      await prisma.productImage.deleteMany({ where: { id: { in: batch } } });
    }
  }

  const duracao = Math.round((Date.now() - inicio) / 1000);
  console.log(`✅ Limpeza concluída em ${duracao}s.`);

  return {
    totalAnalisado: imagens.length,
    imagensQuebradasApagadas: quebradas,
    duracaoSegundos: duracao
  };
}