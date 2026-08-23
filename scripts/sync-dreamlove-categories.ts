import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

// ID do idioma português na API Dreamlove
const PORTUGUESE_LANGUAGE_ID = 55;

type DreamloveCategory = {
  id: number;
  name: string;
  code?: string | null;

  htmlHeadTitle?: string | null;
  htmlMetaDescription?: string | null;
  htmlMetaKeywords?: string | null;

  image?: {
    files?: {
      url: string;
    }[];
  } | null;

  parent?: DreamloveCategory | null;
};

// LOGIN DREAMLOVE

async function loginDreamlove(): Promise<string> {
  const response = await fetch(
    `${API_URL}/login_check`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    }
  );

  const data = await response.json();

  if (!data.token) {
    throw new Error("Token Dreamlove não recebido");
  }

  return data.token;
}

// BUSCAR CATEGORIAS (em português)

async function getCategories(
  token: string
): Promise<DreamloveCategory[]> {
  const categories: DreamloveCategory[] = [];

  let page = 1;

  while (true) {
    console.log(`📂 Buscar categorias - página ${page}...`);

    const response = await fetch(
      `${API_URL}/product_categories?page=${page}&language=${PORTUGUESE_LANGUAGE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro categorias: ${response.status}`);
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

    categories.push(...items);

    console.log(`Página ${page}: ${items.length} categorias`);

    page++;
  }

  return categories;
}

// OBTER IMAGEM

function getImage(category: DreamloveCategory) {
  return (
    category.image
      ?.files?.[0]
      ?.url ??
    null
  );
}

// SLUG

function createSlug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// FLATTEN TREE

function flattenCategories(
  categories: DreamloveCategory[]
) {
  const map = new Map<number, DreamloveCategory>();

  function add(category: DreamloveCategory) {
    if (!map.has(category.id)) {
      map.set(category.id, category);
    }

    if (category.parent) {
      add(category.parent);
    }
  }

  for (const category of categories) {
    add(category);
  }

  return Array.from(map.values());
}

// IMPORTAR UMA CATEGORIA

async function importCategory(category: DreamloveCategory) {
  let parentId: string | null = null;

  if (category.parent) {
    const parent = await prisma.category.findUnique({
      where: {
        dreamloveId: category.parent.id,
      },
    });

    if (parent) {
      parentId = parent.id;
    }
  }

  console.log(
    "🖼️ Categoria:",
    category.name,
    "Imagem:",
    getImage(category)
  );

  const saved = await prisma.category.upsert({
    where: {
      dreamloveId: category.id,
    },

    update: {
      name: category.name,
      parentId,
      image: getImage(category),

      metaTitle: category.htmlHeadTitle ?? null,

      metaDescription: category.htmlMetaDescription ?? null,
    },

    create: {
      dreamloveId: category.id,
      name: category.name,

      slug: `${createSlug(category.name)}-${category.id}`,

      parentId,
      image: getImage(category),

      metaTitle: category.htmlHeadTitle ?? null,

      metaDescription: category.htmlMetaDescription ?? null,
    },
  });

  return saved;
}

async function sync() {
  console.log("🔐 Login Dreamlove...");

  const token = await loginDreamlove();

  console.log("✅ Login efetuado");

  console.log("📂 Buscar categorias em português...");

  const categories = await getCategories(token);

  console.log(`Categorias recebidas: ${categories.length}`);

  const flatCategories = flattenCategories(categories);

  console.log(`Categorias únicas: ${flatCategories.length}`);

  flatCategories.sort((a, b) => getDepth(a) - getDepth(b));

  let count = 0;

  for (const category of flatCategories) {
    try {
      await importCategory(category);

      count++;

      console.log(`✅ ${count}/${flatCategories.length} ${category.name}`);
    } catch (error) {
      console.error(`❌ Erro ${category.name}`, error);
    }
  }

  console.log("🎉 Categorias importadas!");
}

function getDepth(category: DreamloveCategory): number {
  let depth = 0;
  let current = category.parent;

  while (current) {
    depth++;
    current = current.parent;
  }

  return depth;
}

sync()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });