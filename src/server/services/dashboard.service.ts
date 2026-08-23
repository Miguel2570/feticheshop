import { prisma } from "@/lib/prisma";

export class DashboardService {
  async getStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalBrands,
      totalSuppliers,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          deletedAt: null,
        },
      }),

      prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),

      prisma.order.count(),

      prisma.category.count(),

      prisma.brand.count(),

      prisma.supplier.count(),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      totalBrands,
      totalSuppliers,
    };
  }
}

export const dashboardService =
  new DashboardService();