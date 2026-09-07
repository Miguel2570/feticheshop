import { Prisma, OrderStatus, VIPLevel } from "@prisma/client";

import { OrderRepository } from "@/server/repositories/order.repository";
import { prisma } from "@/lib/prisma";
import { getVIPLevel } from "@/lib/vip";

export class OrderService {
  private repository = new OrderRepository();

  async getOrders(options?: {
    page?: number;
    limit?: number;
    userId?: string;
    status?: OrderStatus;
  }) {
    return this.repository.findAll(options);
  }

  async getOrderById(id: string) {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async createOrder(data: Prisma.OrderCreateInput) {
    const order = await this.repository.create(data);

    // ✅ Atualizar VIP do utilizador
    if (order.userId && order.total) {
      await this.updateVIPStatus(order.userId, Number(order.total));
    }

    // Criar notificação de nova encomenda
    try {
      await prisma.adminNotification.create({
        data: {
          title: `Nova encomenda #${order.orderNumber}`,
          message: `Total: €${Number(order.total).toFixed(2)}`,
          type: "new_order",
        },
      });

      console.log(`🔔 Notificação criada: Nova encomenda #${order.orderNumber}`);
    } catch (error) {
      console.error("Erro ao criar notificação de encomenda:", error);
    }

    return order;
  }

  async updateOrder(id: string, data: Prisma.OrderUpdateInput) {
    await this.getOrderById(id);

    return this.repository.update(id, data);
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.getOrderById(id);

    return this.repository.update(id, {
      status,
    });
  }

  /**
   * ✅ Atualizar total gasto e nível VIP do utilizador
   */
  private async updateVIPStatus(userId: string, orderTotal: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { totalSpent: true },
      });

      if (!user) return;

      const newTotal = user.totalSpent + orderTotal;
      const vipLevel = getVIPLevel(newTotal) as VIPLevel;

      await prisma.user.update({
        where: { id: userId },
        data: {
          totalSpent: newTotal,
          vipLevel,
        },
      });

      console.log(`✅ VIP atualizado para ${userId}: ${vipLevel} (Total: €${newTotal.toFixed(2)})`);
    } catch (error) {
      console.error("Erro ao atualizar VIP:", error);
    }
  }
}

export const orderService = new OrderService();