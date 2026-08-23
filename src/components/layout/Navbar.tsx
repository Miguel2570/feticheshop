// Navbar.tsx (Server Component)
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./NavbarClient";

export const dynamic = "force-dynamic";

export async function Navbar() {
  const user = await getCurrentUser();

  console.log("🔍 User:", user?.email, "| Role:", user?.role);

  const [categories, newCount, saleCount] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
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