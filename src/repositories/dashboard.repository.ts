import { subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  async getCards() {
    const [
      revenue,
      orders,
      customers,
      products,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          status: {
            in: [
              "PAID",
              "PROCESSING",
              "SHIPPED",
              "DELIVERED",
            ],
          },
        },
      }),

      prisma.order.count(),

      prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      }),

      prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      revenue: Number(revenue._sum.total ?? 0),
      orders,
      customers,
      products,
    };
  }

  async getRecentOrders(limit = 8) {
    return prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
  }

  async getRecentCustomers(limit = 8) {
    return prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getLowStockProducts(limit = 8) {
    return prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
        deletedAt: null,
      },
      include: {
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: limit,
    });
  }

  async getRecentActivities(limit = 10) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSalesLast12Months() {
    const today = new Date();
    const start = subMonths(today, 11);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
        },
        status: {
          in: [
            "PAID",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
          ],
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
        month: date.toLocaleString("pt-PT", {
          month: "short",
        }),
        revenue: 0,
      };
    });

    for (const order of orders) {
      const key = `${order.createdAt.getFullYear()}-${order.createdAt.getMonth()}`;

      const month = months.find(
        (m) => m.key === key,
      );

      if (month) {
        month.revenue += Number(order.total);
      }
    }

    return months.map(({ month, revenue }) => ({
      month,
      revenue,
    }));
  }
}

export const dashboardRepository =
  new DashboardRepository();