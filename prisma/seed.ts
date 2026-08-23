// prisma/seed.ts

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed iniciado...\n");

  // =====================================================
  // PASSWORD
  // =====================================================

  const password = await bcrypt.hash("Password123!", 10);

  // =====================================================
  // SUPER ADMIN
  // =====================================================

  await prisma.user.upsert({
    where: {
      email: "superadmin@pleasureshop.pt",
    },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@pleasureshop.pt",
      password,
      role: Role.SUPER_ADMIN,
      phone: "912345678",
      emailVerifiedAt: new Date(),
      isActive: true,
    },
  });

  // =====================================================
  // ADMIN
  // =====================================================

  await prisma.user.upsert({
    where: {
      email: "admin@pleasureshop.pt",
    },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@pleasureshop.pt",
      password,
      role: Role.ADMIN,
      phone: "923456789",
      emailVerifiedAt: new Date(),
      isActive: true,
    },
  });

  console.log("✅ Utilizadores criados.");

  // =====================================================
  // SETTINGS
  // =====================================================

  const settings = [
    {
      key: "store_name",
      value: "Pleasure Shop",
      description: "Nome da loja",
      category: "general",
    },
    {
      key: "store_email",
      value: "info@pleasureshop.pt",
      description: "Email da loja",
      category: "general",
    },
    {
      key: "store_phone",
      value: "+351210000000",
      description: "Telefone",
      category: "general",
    },
    {
      key: "shipping_free_threshold",
      value: 50,
      description: "Portes grátis",
      category: "shipping",
    },
    {
      key: "shipping_base_cost",
      value: 4.99,
      description: "Portes base",
      category: "shipping",
    },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: {
        key: setting.key,
      },
      update: {
        value: setting.value,
        description: setting.description,
        category: setting.category,
      },
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
      },
    });
  }

  console.log("✅ Settings criadas.");

  // =====================================================
  // CUPÕES
  // =====================================================

  await prisma.coupon.upsert({
    where: {
      code: "BEMVINDO10",
    },
    update: {},
    create: {
      code: "BEMVINDO10",
      name: "Boas-vindas",
      description: "10% de desconto",

      discountValue: 10,

      isPercentage: true,

      maximumDiscount: 20,

      minimumAmount: 30,

      usageLimit: 100,

      usagePerUser: 1,

      isActive: true,

      startsAt: new Date(),

      endsAt: new Date("2027-12-31"),
    },
  });

  console.log("✅ Cupão criado.");

  console.log("\n🎉 Seed concluído!\n");

  console.log("LOGIN ADMIN");

  console.log("-----------------------------");

  console.log("Super Admin:");
  console.log("superadmin@pleasureshop.pt");
  console.log("Password123!");

  console.log("");

  console.log("Admin:");
  console.log("admin@pleasureshop.pt");
  console.log("Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });