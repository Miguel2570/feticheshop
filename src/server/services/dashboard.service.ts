import { subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";

export class DashboardService {
  async getCards() {
    const [revenue, orders, customers, products, reviews, lowStock] =
      await Promise.all([
        prisma.order.aggregate({
          _sum: { total: true },
          where: {
            status: {
              in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
            },
          },
        }),

        prisma.order.count(),

        prisma.user.count({
          where: { role: "CUSTOMER" },
        }),

        prisma.product.count({
          where: { deletedAt: null },
        }),

        prisma.review.count(),

        prisma.product.count({
          where: {
            stock: { lte: 5 },
            deletedAt: null,
          },
        }),
      ]);

    return {
      revenue: Number(revenue._sum.total ?? 0),
      orders,
      customers,
      products,
      reviews,
      lowStock,
    };
  }

  async getRecentOrders(limit = 8) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getRecentCustomers(limit = 8) {
    return prisma.user.findMany({
      where: { role: "CUSTOMER" },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        vipLevel: true,
        totalSpent: true,
        createdAt: true,
      },
    });
  }

  async getLowStockProducts(limit = 8) {
    return prisma.product.findMany({
      where: {
        stock: { lte: 5 },
        deletedAt: null,
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { stock: "asc" },
      take: limit,
    });
  }

  async getRecentActivities(limit = 10) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }

  async getSalesLast12Months() {
    const today = new Date();
    const start = subMonths(today, 11);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: start },
        status: {
          in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"],
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    const months = Array.from({ length: 12 }).map((_, index) => {
      const date = subMonths(today, 11 - index);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleString("pt-PT", { month: "short" }),
        revenue: 0,
      };
    });

    for (const order of orders) {
      const key = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth()}`;
      const month = months.find((m) => m.key === key);

      if (month) {
        month.revenue += Number(order.total);
      }
    }

    return months.map(({ month, revenue }) => ({
      month,
      revenue,
    }));
  }

  async getVIPCustomers(limit = 5) {
    return prisma.user.findMany({
      where: {
        role: "CUSTOMER",
        vipLevel: {
          in: ["GOLD", "SILVER"],
        },
      },
      orderBy: { totalSpent: "desc" },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        vipLevel: true,
        totalSpent: true,
      },
    });
  }

  async getDashboard() {
    const [
      cards,
      recentOrders,
      recentCustomers,
      lowStockProducts,
      recentActivities,
      sales,
      vipCustomers,
    ] = await Promise.all([
      this.getCards(),
      this.getRecentOrders(),
      this.getRecentCustomers(),
      this.getLowStockProducts(),
      this.getRecentActivities(),
      this.getSalesLast12Months(),
      this.getVIPCustomers(),
    ]);

    return {
      cards,
      sales,
      vipCustomers,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "Cliente",
        email: order.user?.email || "",
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),
      recentCustomers: recentCustomers.map((customer) => ({
        id: customer.id,
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Cliente",
        email: customer.email,
        avatar: customer.avatarUrl,
        vipLevel: customer.vipLevel,
        totalSpent: Number(customer.totalSpent || 0),
        createdAt: customer.createdAt,
      })),
      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        image: product.images[0]?.url ?? null,
      })),
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        title: activity.action,
        description:
          activity.entity +
          (activity.entityId ? ` (${activity.entityId})` : ""),
        createdAt: activity.createdAt,
      })),
    };
  }
}

export const dashboardService = new DashboardService();