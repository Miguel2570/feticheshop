import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const API_URL = process.env.DREAMLOVE_API_URL!;
const USERNAME = process.env.DREAMLOVE_USERNAME!;
const PASSWORD = process.env.DREAMLOVE_PASSWORD!;

// ID do idioma português
const PORTUGUESE_LANGUAGE_ID = 55;

type DreamloveProduct = {
  id: number;
  stock: string;
  price: string;
  customerPrice?: string | null;
};

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

async function getProducts(
  token: string
): Promise<DreamloveProduct[]> {
  let page = 1;

  const products: DreamloveProduct[] = [];

  while (true) {
    console.log(`📦 Página ${page}`);

    const response = await fetch(
      `${API_URL}/products?page=${page}&language=${PORTUGUESE_LANGUAGE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro página ${page}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      break;
    }

    products.push(...data);

    page++;
  }

  return products;
}

async function syncStock() {
  console.log("🔐 Login Dreamlove...");

  const token = await loginDreamlove();

  console.log("✅ Login efetuado");

  console.log("📦 A obter produtos...");

  const products = await getProducts(token);

  console.log(`Total Dreamlove: ${products.length}`);

  console.log("📚 A carregar produtos da BD...");

  const dbProducts = await prisma.product.findMany({
    where: {
      dreamloveId: {
        not: null,
      },
    },
    select: {
      id: true,
      dreamloveId: true,
      name: true,
      stock: true,
      price: true,
    },
  });

  const map = new Map<number, typeof dbProducts[number]>();

  for (const p of dbProducts) {
    if (p.dreamloveId != null) {
      map.set(p.dreamloveId, p);
    }
  }

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const item of products) {
    const product = map.get(item.id);

    if (!product) {
      notFound++;
      continue;
    }

    const newStock = Number(item.stock);

    const newPrice = Number(
      item.customerPrice ?? item.price
    );

    const stockChanged =
      product.stock !== newStock;

    const priceChanged =
      Number(product.price) !== newPrice;

    if (!stockChanged && !priceChanged) {
      skipped++;
      continue;
    }

    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        stock: newStock,
        price: newPrice,
      },
    });

    updated++;

    console.log(
      `✔ ${product.name}
Stock: ${product.stock} → ${newStock}
Preço: ${product.price} → ${newPrice}
`
    );
  }

  console.log("");
  console.log("==================================");
  console.log(`Produtos Dreamlove : ${products.length}`);
  console.log(`Atualizados        : ${updated}`);
  console.log(`Sem alterações     : ${skipped}`);
  console.log(`Não encontrados    : ${notFound}`);
  console.log("==================================");
}

syncStock()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });