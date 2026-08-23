import { prisma } from "@/lib/prisma";

export class ProductRepository {
  async findMany() {
    return prisma.product.findMany({
      include: {
        brand: true,

        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },

        categories: {
          include: {
            category: true,
          },
        },

        variants: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: {
        id,
      },

      include: {
        brand: true,

        images: true,

        variants: {
          include: {
            attributeValues: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },

        attributes: {
          include: {
            attributeValue: {
              include: {
                attribute: true,
              },
            },
          },
        },

        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

export const productRepository =
  new ProductRepository();