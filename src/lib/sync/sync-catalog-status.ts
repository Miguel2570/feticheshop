import { prisma } from "@/lib/prisma";

const API = process.env.DREAMLOVE_API_URL!;
const USER = process.env.DREAMLOVE_USERNAME!;
const PASS = process.env.DREAMLOVE_PASSWORD!;

const CONCURRENCY = 8; // 8 pedidos em paralelo
const TIMEOUT_MS = 20000; // 20s por pedido

interface SyncResult {
  totalVariantes: number;
  validos: number;
  fantasmas: number;
  reativados: number;
  desativados: number;
  produtosArquivados: number;
  timeouts: number;
  erros: number;
  duracaoSegundos: number;
}

async function login(): Promise<string> {
  const r = await fetch(`${API}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  if (!r.ok) throw new Error(`Login falhou: ${r.status}`);
  const { token } = await r.json();
  return token;
}

async function fetchComTimeout(
  url: string,
  headers: Record<string, string>
): Promise<{ status: number; ok: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const r = await fetch(url, { headers, signal: controller.signal });
    return { status: r.status, ok: r.ok };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function syncCatalogStatus(): Promise<SyncResult> {
  const inicio = Date.now();
  const token = await login();
  const headers = { Authorization: `Bearer ${token}` };

  const variantes = await prisma.productVariant.findMany({
    where: { dreamloveId: { not: null } },
    select: { id: true, dreamloveId: true, isActive: true, productId: true },
  });

  let validos = 0;
  let fantasmas = 0;
  let reativados = 0;
  let desativados = 0;
  let timeouts = 0;
  let erros = 0;

  const produtosAfetados = new Set<string>();

  // Processa em lotes paralelos
  const chunks: typeof variantes[] = [];
  for (let i = 0; i < variantes.length; i += CONCURRENCY) {
    chunks.push(variantes.slice(i, i + CONCURRENCY));
  }

  for (let c = 0; c < chunks.length; c++) {
    const chunk = chunks[c];

    await Promise.all(
      chunk.map(async (v) => {
        try {
          const r = await fetchComTimeout(
            `${API}/products/${v.dreamloveId}`,
            headers
          );

          if (r.ok) {
            validos++;
            if (!v.isActive) {
              await prisma.productVariant.update({
                where: { id: v.id },
                data: { isActive: true },
              });
              reativados++;
              produtosAfetados.add(v.productId);
            }
          } else if (r.status === 404) {
            fantasmas++;
            if (v.isActive) {
              await prisma.productVariant.update({
                where: { id: v.id },
                data: { isActive: false },
              });
              desativados++;
              produtosAfetados.add(v.productId);
            }
          } else {
            erros++;
          }
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") {
            timeouts++;
          } else {
            erros++;
          }
        }
      })
    );

    // Progresso a cada 100 lotes
    if ((c + 1) % 100 === 0) {
      const processadas = (c + 1) * CONCURRENCY;
      const duracao = Math.round((Date.now() - inicio) / 1000);
      console.log(
        `  [${processadas}/${variantes.length}] ` +
          `validos: ${validos}, fantasmas: ${fantasmas}, ` +
          `timeouts: ${timeouts}, erros: ${erros} | ${duracao}s`
      );
    }
  }

  // Arquivar produtos órfãos
  let produtosArquivados = 0;
  if (produtosAfetados.size > 0) {
    const produtosParaVerificar = await prisma.product.findMany({
      where: {
        id: { in: Array.from(produtosAfetados) },
        status: { not: "ARCHIVED" },
      },
      select: {
        id: true,
        variants: { select: { isActive: true } },
      },
    });

    for (const p of produtosParaVerificar) {
      if (p.variants.length > 0 && p.variants.every((v) => !v.isActive)) {
        await prisma.product.update({
          where: { id: p.id },
          data: { status: "ARCHIVED" },
        });
        produtosArquivados++;
      }
    }
  }

  return {
    totalVariantes: variantes.length,
    validos,
    fantasmas,
    reativados,
    desativados,
    produtosArquivados,
    timeouts,
    erros,
    duracaoSegundos: Math.round((Date.now() - inicio) / 1000),
  };
}