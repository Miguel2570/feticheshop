import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { PaymentRepository } from "@/server/repositories/payment.repository";

export class PaymentService {
  private repository = new PaymentRepository();

  async getPayments(options?: {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
    orderId?: string;
  }) {
    return this.repository.findAll(options);
  }

  async getPaymentById(id: string) {
    const payment =
      await this.repository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment =
      await this.repository.findByOrderId(orderId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async createPayment(
    data: Prisma.PaymentCreateInput
  ) {
    return this.repository.create(data);
  }

  async updatePayment(
    id: string,
    data: Prisma.PaymentUpdateInput
  ) {
    await this.getPaymentById(id);

    return this.repository.update(id, data);
  }

  async updateStatus(
    id: string,
    status: PaymentStatus
  ) {
    await this.getPaymentById(id);

    return this.repository.update(id, {
      status,

      ...(status === PaymentStatus.PAID && {
        paidAt: new Date(),
      }),
    });
  }

  async updateMethod(
    id: string,
    method: PaymentMethod
  ) {
    await this.getPaymentById(id);

    return this.repository.update(id, {
      method,
    });
  }

  async setTransaction(
    id: string,
    transactionId: string,
    gateway?: string,
    gatewayResponse?: Prisma.InputJsonValue
  ) {
    await this.getPaymentById(id);

    return this.repository.update(id, {
      transactionId,
      gateway,
      gatewayResponse,
    });
  }
}

export const paymentService =
  new PaymentService();