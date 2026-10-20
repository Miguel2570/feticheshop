import { prisma } from "@/lib/prisma";

const API = process.env.DREAMLOVE_API_URL!;
const USER = process.env.DREAMLOVE_USERNAME!;
const PASS = process.env.DREAMLOVE_PASSWORD!;

const MAX_NEW_PER_RUN = 50; 
const MAX_PAGES_TO_WALK_BACK = 10; 

export async function syncNewProducts() {
  const inicio = Date.now();

  // 1. Login
  const loginRes = await fetch(`${API}/login_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USER, password: PASS }),
  });
  const { token } = await loginRes.json();
  const headers = { Authorization: `Bearer ${token}` };

  // 2. Carrega IDs existentes (rápido)
  console.log("🔍 A carregar IDs existentes da BD...");
  const produtosExistentes = await prisma.product.findMany({
    select: { dreamloveId: true },
    where: { dreamloveId: { not: null } },
  });
  const idsExistentes = new Set(produtosExistentes.map(p => p.dreamloveId));

  // 3. Descobre a última página
  console.log("📡 A perguntar à Dreamlove qual é a última página...");
  const primeiraPagina = await fetch(`${API}/products?page=1`, { headers });
  const dataPrimeira = await primeiraPagina.json();
  
  let ultimaPagina = 1;
  if (dataPrimeira["hydra:view"]?.["hydra:last"]) {
    const match = dataPrimeira["hydra:view"]["hydra:last"].match(/page=(\d+)/);
    if (match) ultimaPagina = Number(match[1]);
  } else if (dataPrimeira["hydra:totalItems"]) {
    ultimaPagina = Math.ceil(dataPrimeira["hydra:totalItems"] / 100); 
  }

  console.log(`   Última página detetada: ${ultimaPagina}`);

  let novosCriados = 0;
  let ignorados = 0;
  let paginaAtual = ultimaPagina;

  // 4. Ele começa na última página e vai recuando (até 10 páginas para trás)
  const paginasParaVisitar = [];
  for (let i = 0; i < MAX_PAGES_TO_WALK_BACK; i++) {
    if (paginaAtual > 0) {
      paginasParaVisitar.push(paginaAtual);
      paginaAtual--;
    }
  }

  for (const page of paginasParaVisitar) {
    if (novosCriados >= MAX_NEW_PER_RUN) break; // Atingiu o limite diário

    console.log(`📦 A verificar página ${page}...`);
    const res = await fetch(`${API}/products?page=${page}`, { headers });
    if (!res.ok) continue;
    
    const data = await res.json();
    const products = Array.isArray(data) ? data : data["hydra:member"] ?? [];
    if (products.length === 0) continue;

    let encontrouAntigosNestaPagina = false;

    for (const p of products) {
      if (novosCriados >= MAX_NEW_PER_RUN) break;

      const dlId = Number(p.id);
      if (!dlId) continue;

      if (idsExistentes.has(dlId)) {
        ignorados++;
        encontrouAntigosNestaPagina = true; 
        continue; 
      }

      // É NOVO!
      try {
        const nome = p.name || p.title || `Produto ${dlId}`;
        const slugBase = nome.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const slug = `${slugBase}-${dlId}`;

        await prisma.product.create({
          data: {
            dreamloveId: dlId,
            name: nome,
            slug: slug,
            description: p.description || null,
            price: p.price || p.salePrice || 0,
            comparePrice: p.oldPrice || null,
            stock: 0,
            status: "DRAFT",
            stockMode: "SUPPLIER",
            sku: p.sku || null,
            ean: p.ean || null,
            
            // ⚠️ IMPORTANTE: Se o teu script antigo criava imagens, variantes
            // e categorias, tens de colocar essa lógica aqui dentro!
          },
        });

        idsExistentes.add(dlId); 
        novosCriados++;
        console.log(`✨ Produto novo importado: ${nome} (ID: ${dlId})`);
      } catch (err) {
        console.error(`❌ Erro ao criar produto ${dlId}:`, err);
      }
    }

    // O TRUQUE DE OURO: Se nesta página já encontrámos produtos antigos, 
    // significa que já passámos a fronteira do "novo". Podemos parar!
    if (encontrouAntigosNestaPagina && novosCriados > 0) {
      console.log(`   ⏹️ Chegámos a produtos antigos na página ${page}. A parar a verificação.`);
      break;
    }
  }

  return {
    novosCriados,
    ignorados,
    duracaoSegundos: Math.round((Date.now() - inicio) / 1000),
  };
}