// components/layout/Navbar.tsx
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";


export async function Navbar() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    user = null;
  }

  const [categories, newCount, saleCount] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.product.count({
      where: { status: "ACTIVE", isNew: true },
    }),
    prisma.product.count({
      where: { status: "ACTIVE", isOnSale: true },
    }),
  ]);

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  return (
    <NavbarClient
      categories={categories}
      isAuthenticated={!!user}
      isAdmin={isAdmin}
      hasNewProducts={newCount > 0}
      hasSaleProducts={saleCount > 0}
    />
  );
}