import { Prisma, ProductStatus } from "@prisma/client";
import { z } from "zod";

import { ProductRepository } from "@/server/repositories/product.repository";
import { prisma } from "@/lib/prisma";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validations/product";

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

type CreateProductBody = z.infer<typeof createProductSchema>;
type UpdateProductBody = z.infer<typeof updateProductSchema>;

export class ProductService {
  private repository = new ProductRepository();

  async listProducts(page = 1, limit = 20, search = "") {
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

    const skip = (page - 1) * perPage;

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

  async createProduct(body: CreateProductBody) {
    const { variants, categoryIds, categoryId, ...productData } = body;

    const data: Prisma.ProductCreateInput = {
      ...productData,
      ...(categoryIds && categoryIds.length > 0
        ? {
            categories: {
              create: categoryIds.map((id) => ({ categoryId: id })),
            },
          }
        : categoryId
          ? {
              categories: {
                create: [{ categoryId }],
              },
            }
          : {}),
      ...(variants && variants.length > 0
        ? {
            variants: {
              create: variants.map((v) => ({
                name: v.name,
                sku: v.sku ?? null,
                ean: v.ean ?? null,
                price:
                  v.price !== undefined && v.price !== null
                    ? new Prisma.Decimal(v.price)
                    : null,
                comparePrice:
                  v.comparePrice !== undefined && v.comparePrice !== null
                    ? new Prisma.Decimal(v.comparePrice)
                    : null,
                costPrice:
                  v.costPrice !== undefined && v.costPrice !== null
                    ? new Prisma.Decimal(v.costPrice)
                    : null,
                stock: v.stock ?? 0,
                isActive: v.isActive ?? true,
              })),
            },
          }
        : {}),
    };

    return this.repository.create(data);
  }

  async updateProduct(id: string, data: UpdateProductBody) {
    await this.getProductById(id);

    const { categoryId, categoryIds, variants, ...productData } = data;

    const product = await this.repository.update(
      id,
      productData as Prisma.ProductUpdateInput
    );

    if (variants !== undefined && variants.length > 0) {
      const variantIds = variants.map((v) => v.id);
      const existingVariants = await prisma.productVariant.findMany({
        where: {
          id: { in: variantIds },
          productId: id,
        },
        select: { id: true },
      });

      const validIds = new Set(existingVariants.map((v) => v.id));

      for (const variantUpdate of variants) {
        if (!validIds.has(variantUpdate.id)) continue;

        const updateData: Prisma.ProductVariantUpdateInput = {};

        if (variantUpdate.price !== undefined) {
          updateData.price =
            variantUpdate.price !== null
              ? new Prisma.Decimal(variantUpdate.price)
              : null;
        }
        if (variantUpdate.comparePrice !== undefined) {
          updateData.comparePrice =
            variantUpdate.comparePrice !== null
              ? new Prisma.Decimal(variantUpdate.comparePrice)
              : null;
        }
        if (variantUpdate.costPrice !== undefined) {
          updateData.costPrice =
            variantUpdate.costPrice !== null
              ? new Prisma.Decimal(variantUpdate.costPrice)
              : null;
        }
        if (variantUpdate.stock !== undefined) {
          updateData.stock = variantUpdate.stock;
        }
        if (variantUpdate.isActive !== undefined) {
          updateData.isActive = variantUpdate.isActive;
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.productVariant.update({
            where: { id: variantUpdate.id },
            data: updateData,
          });
        }
      }
    }

    if (categoryIds !== undefined) {
      await prisma.productCategory.deleteMany({
        where: { productId: id },
      });

      if (categoryIds.length > 0) {
        const allCategoryIds = new Set<string>(categoryIds);

        const categories = await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, parentId: true },
        });

        for (const cat of categories) {
          if (cat.parentId) {
            allCategoryIds.add(cat.parentId);
          }
        }

        await prisma.productCategory.createMany({
          data: Array.from(allCategoryIds).map((categoryId) => ({
            productId: id,
            categoryId,
          })),
          skipDuplicates: true,
        });
      }
    } else if (categoryId !== undefined) {
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