// prisma/seed-dreamlove.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDreamlove() {
  console.log("🌱 A adicionar fornecedor Dreamlove...\n");

  const dreamlove = await prisma.supplier.upsert({
    where: { slug: "dreamlove" },
    update: {
      name: "Dreamlove",
      description: "Distribuidor grossista de produtos eróticos e bem-estar sexual",
      website: "https://www.dreamlove.es",
      contactEmail: "spcsimoes83@gmail.com",
      contactName: "Dreamlove API",
      apiUrl: "https://api-dreamlove.gesio.be",
      apiUsername: "PT226751392",
      apiPassword: "4h5Sg3ty9mAc",
      currency: "EUR",
      language: "pt",
      isActive: true,
    },
    create: {
      name: "Dreamlove",
      slug: "dreamlove",
      description: "Distribuidor grossista de produtos eróticos e bem-estar sexual",
      website: "https://www.dreamlove.es",
      contactEmail: "spcsimoes83@gmail.com",
      contactName: "Dreamlove API",
      apiUrl: "https://api-dreamlove.gesio.be",
      apiUsername: "PT226751392",
      apiPassword: "4h5Sg3ty9mAc",
      currency: "EUR",
      language: "pt",
      isActive: true,
    },
  });

  console.log("✅ Fornecedor Dreamlove configurado!");
  console.log(`   ID: ${dreamlove.id}`);
  console.log(`   Slug: ${dreamlove.slug}\n`);
}

seedDreamlove()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro:", e);
    await prisma.$disconnect();
    process.exit(1);
  });