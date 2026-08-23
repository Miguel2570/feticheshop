import { dashboardRepository } from "@/repositories/dashboard.repository";

export class DashboardService {
  async getDashboard() {
    const [
      cards,
      recentOrders,
      recentCustomers,
      lowStockProducts,
      recentActivities,
      sales,
    ] = await Promise.all([
      dashboardRepository.getCards(),
      dashboardRepository.getRecentOrders(),
      dashboardRepository.getRecentCustomers(),
      dashboardRepository.getLowStockProducts(),
      dashboardRepository.getRecentActivities(),
      dashboardRepository.getSalesLast12Months(),
    ]);

    return {
      cards,

      sales,

      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: `${order.user.firstName} ${order.user.lastName}`,
        total: Number(order.total),
        status: order.status,
        createdAt: order.createdAt,
      })),

      recentCustomers: recentCustomers.map((customer) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        avatar: customer.avatarUrl,
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