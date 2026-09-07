import { Prisma, ProductStatus } from "@prisma/client";

import { ProductRepository } from "@/server/repositories/product.repository";
import { prisma } from "@/lib/prisma";

interface GetProductsParams {
  search?: string;
  status?: ProductStatus;
  page?: number;
  perPage?: number;
  brandId?: string;
  categoryId?: string;
  featured?: boolean;
  onSale?: boolean;
  sort?:
    | "newest"
    | "oldest"
    | "priceAsc"
    | "priceDesc"
    | "stockAsc"
    | "stockDesc"
    | "name";
}

export class ProductService {
  private repository = new ProductRepository();

  async listProducts(
    page = 1,
    limit = 20,
    search = ""
  ) {
    return this.repository.findAll({
      page,
      limit,
      search,
    });
  }

  async getProducts(params: GetProductsParams = {}) {
    const {
      search,
      status = "ACTIVE",
      page = 1,
      perPage = 20,
      brandId,
      categoryId,
      featured,
      onSale,
      sort = "newest",
    } = params;

    // Construir where
    const where: Prisma.ProductWhereInput = {
      status: status as ProductStatus,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (categoryId) {
      where.categories = {
        some: {
          categoryId,
        },
      };
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (onSale) {
      where.isOnSale = true;
    }

    // Construir orderBy
    const orderByMap: Record<string, Prisma.ProductOrderByWithRelationInput> = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      priceAsc: { price: "asc" },
      priceDesc: { price: "desc" },
      stockAsc: { stock: "asc" },
      stockDesc: { stock: "desc" },
      name: { name: "asc" },
    };

    const orderBy = orderByMap[sort] || { createdAt: "desc" };

    // Calcular paginação
    const skip = (page - 1) * perPage;

    // Buscar total e produtos
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          images: { orderBy: { position: "asc" } },
          categories: { include: { category: true } },
        },
        orderBy,
        skip,
        take: perPage,
      }),
    ]);

    const pages = Math.ceil(total / perPage);

    return {
      data: products,
      pagination: {
        page,
        perPage,
        pages,
        total,
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.repository.create(data);
  }

  async updateProduct(
    id: string,
    data: Prisma.ProductUpdateInput & { categoryId?: string | null }
  ) {
    await this.getProductById(id);

    const { categoryId, ...productData } = data;

    const product = await this.repository.update(id, productData);

    if (categoryId !== undefined) {
      await prisma.productCategory.deleteMany({
        where: { productId: id },
      });

      if (categoryId) {
        await prisma.productCategory.create({
          data: {
            productId: id,
            categoryId,
          },
        });

        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (category?.parentId) {
          await prisma.productCategory.create({
            data: {
              productId: id,
              categoryId: category.parentId,
            },
          });
        }
      }
    }

    return this.getProductById(id);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);

    return this.repository.delete(id);
  }
}

export const productService = new ProductService();