import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

// ID do idioma português
const PORTUGUESE_LANGUAGE_ID = 55;

type DreamloveBrand = {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  image?: {
    files?: {
      url: string;
    }[];
  } | null;
};

// Helper para delay
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginDreamlove(): Promise<string> {
  const response = await fetch(`${API_URL}/login_check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro no login.");
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("Token não recebido.");
  }

  return data.token;
}

function createSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function getBrands(token: string): Promise<DreamloveBrand[]> {
  const brands: DreamloveBrand[] = [];
  let page = 1;

  while (true) {
    console.log(`🏷️ Buscar marcas - página ${page}...`);

    const response = await fetch(
      `${API_URL}/brands?page=${page}&language=${PORTUGUESE_LANGUAGE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // Tratar rate limit (429)
    if (response.status === 429) {
      console.log("⏳ Rate limit atingido. Aguardar 15 segundos...");
      await sleep(15000);
      continue; // Tentar novamente
    }

    if (!response.ok) {
      throw new Error(`Erro marcas: ${response.status}`);
    }

    const data = await response.json();

    if (page === 1) {
      console.log("🔎 RESPOSTA DREAMLOVE - PÁGINA 1:");
      console.dir(data, { depth: 10 });
    }

    const items =
      data.member ??
      data["hydra:member"] ??
      data.items ??
      data.data ??
      data;

    if (!Array.isArray(items) || items.length === 0) {
      break;
    }

    brands.push(...items);
    console.log(`Página ${page}: ${items.length} marcas`);
    page++;

    // Delay entre páginas (2 segundos)
    await sleep(2000);
  }

  return brands;
}

async function syncBrands() {
  console.log("🔐 Login Dreamlove...");
  const token = await loginDreamlove();
  console.log("✅ Login efetuado");

  console.log("🏷️ Buscar marcas em português...");
  const brands = await getBrands(token);
  console.log(`Marcas recebidas: ${brands.length}`);

  let imported = 0;
  const updated = 0;
  let failed = 0;

  for (const brand of brands) {
    try {
      const name = brand.name?.trim() || `Marca ${brand.id}`;

      await prisma.brand.upsert({
        where: { dreamloveId: brand.id },
        update: {
          name,
          slug: createSlug(name),
          description: brand.description ?? null,
          logo: brand.image?.files?.[0]?.url ?? null,
        },
        create: {
          dreamloveId: brand.id,
          name,
          slug: createSlug(`${name}-${brand.id}`),
          description: brand.description ?? null,
          logo: brand.image?.files?.[0]?.url ?? null,
        },
      });

      console.log(`✅ ${name}`);
      imported++;

      // Pequeno delay entre imports
      await sleep(500);
    } catch (error) {
      console.error(`❌ Erro marca ${brand.name}:`, error);
      failed++;
    }
  }

  console.log("");
  console.log("==================================");
  console.log(`Marcas importadas : ${imported}`);
  console.log(`Erros             : ${failed}`);
  console.log("==================================");
}

syncBrands()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });