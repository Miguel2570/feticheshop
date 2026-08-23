import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const supplier = await prisma.supplier.upsert({
    where: {
      slug: "dreamlove",
    },

    update: {
      name: "Dreamlove",
      website: "https://www.dreamlove.com",
      apiUrl: process.env.DREAMLOVE_API_URL ?? null,
      apiUsername: process.env.DREAMLOVE_USERNAME ?? null,
      apiPassword: process.env.DREAMLOVE_PASSWORD ?? null,
      currency: "EUR",
      language: "pt",
      isActive: true,
    },

    create: {
      name: "Dreamlove",
      slug: "dreamlove",
      website: "https://www.dreamlove.com",
      apiUrl: process.env.DREAMLOVE_API_URL ?? null,
      apiUsername: process.env.DREAMLOVE_USERNAME ?? null,
      apiPassword: process.env.DREAMLOVE_PASSWORD ?? null,
      currency: "EUR",
      language: "pt",
      isActive: true,
    },
  });

  console.log("Fornecedor criado/atualizado:");
  console.log(supplier);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });