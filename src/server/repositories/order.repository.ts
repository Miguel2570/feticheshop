import { Prisma, OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface FindAllOptions {
  page?: number;
  limit?: number;
  userId?: string;
  status?: OrderStatus;
}

export class OrderRepository {
  async findAll(options?: FindAllOptions) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const where: Prisma.OrderWhereInput = {};

    if (options?.userId) {
      where.userId = options.userId;
    }

    if (options?.status) {
      where.status = options.status;
    }

    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where,

        skip: (page - 1) * limit,
        take: limit,

        include: {
          user: true,
          orderAddress: true,
          coupon: true,
          payment: true,

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

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.order.count({
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
    return prisma.order.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        orderAddress: true,
        coupon: true,
        payment: true,

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
    });
  }

  async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,

      include: {
        orderAddress: true,
        payment: true,
        coupon: true,

        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.OrderUpdateInput
  ) {
    return prisma.order.update({
      where: {
        id,
      },

      data,

      include: {
        orderAddress: true,
        payment: true,

        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }
}

export const orderRepository =
  new OrderRepository();