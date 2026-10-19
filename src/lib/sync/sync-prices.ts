import { prisma } from "@/lib/prisma";

const API = process.env.DREAMLOVE_API_URL!;
const USER = process.env.DREAMLOVE_USERNAME!;
const PASS = process.env.DREAMLOVE_PASSWORD!;

export async function syncPricesAndNewProducts() {
  // 1. Login
  const loginRes = await fetch(`${API}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const { token } = await loginRes.json();
  const headers = { Authorization: `Bearer ${token}` };

  // 2. Vai buscar a primeira página de produtos (para atualizar preços)
  // A Dreamlove tem um endpoint /products, que devolve os detalhes completos.
  const res = await fetch(`${API}/products?page=1`, { headers });
  const data = await res.json();
  const products = Array.isArray(data) ? data : data["hydra:member"] ?? [];

  let atualizados = 0;
  let novos = 0;

  for (const p of products) {
    // O ID da Dreamlove (ajusta o campo conforme a API devolve, ex: p.id ou p.dreamloveId)
    const dlId = Number(p.id); 
    if (!dlId) continue;

    const preco = p.price || p.salePrice; 
    if (!preco) continue;

    const produtoExistente = await prisma.product.findUnique({
      where: { dreamloveId: dlId },
    });

    if (produtoExistente) {
      // Atualizar preços
      if (Number(produtoExistente.price) !== preco) {
        await prisma.product.update({
          where: { id: produtoExistente.id },
          data: { price: preco, comparePrice: p.oldPrice || null },
        });
        atualizados++;
      }
    } else {
      // Criar produto novo
      // ⚠️ NOTA: Aqui deves chamar a tua função de importação que já usaste para criar os 14k produtos,
      // pois ela trata das imagens, categorias, variantes, etc.
      // Exemplo: await importarProdutoDreamlove(p);
      novos++;
    }
  }

  return { totalLidos: products.length, atualizados, novos };
}