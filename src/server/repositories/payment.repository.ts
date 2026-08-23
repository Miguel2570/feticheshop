import {
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  orderId?: string;
}

export class PaymentRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const where: Prisma.PaymentWhereInput = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.method) {
      where.method = options.method;
    }

    if (options?.orderId) {
      // Usar a relação "order" em vez de "orderId"
      where.order = {
        id: options.orderId,
      };
    }

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,

        skip: (page - 1) * limit,
        take: limit,

        include: {
          order: {
            include: {
              user: true,
              orderAddress: true,

              items: {
                include: {
                  product: {
                    include: {
                      brand: true,
                      images: true,
                    },
                  },

                  variant: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.payment.count({
        where,
      }),
    ]);

    return {
      data,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: {
        id,
      },

      include: {
        order: {
          include: {
            user: true,
            orderAddress: true,

            items: {
              include: {
                product: {
                  include: {
                    brand: true,
                    images: true,
                  },
                },

                variant: true,
              },
            },
          },
        },
      },
    });
  }

  async findByOrderId(orderId: string) {
    return prisma.payment.findFirst({
      where: {
        order: {
          id: orderId,
        },
      },

      include: {
        order: true,
      },
    });
  }

  async create(
    data: Prisma.PaymentCreateInput
  ) {
    return prisma.payment.create({
      data,

      include: {
        order: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.PaymentUpdateInput
  ) {
    return prisma.payment.update({
      where: {
        id,
      },

      data,

      include: {
        order: true,
      },
    });
  }
}

export const paymentRepository =
  new PaymentRepository();