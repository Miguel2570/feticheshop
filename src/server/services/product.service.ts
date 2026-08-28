import { Prisma } from "@prisma/client";

import { ProductRepository } from "@/server/repositories/product.repository";
import { prisma } from "@/lib/prisma";

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

  async getProducts() {
    return this.repository.findAll();
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

    // Extrair categoryId
    const { categoryId, ...productData } = data;

    // Atualizar produto
    const product = await this.repository.update(id, productData);

    // Atualizar categoria se fornecida
    if (categoryId !== undefined) {
      // Apagar categorias antigas
      await prisma.productCategory.deleteMany({
        where: { productId: id },
      });

      if (categoryId) {
        // Adicionar nova categoria
        await prisma.productCategory.create({
          data: {
            productId: id,
            categoryId,
          },
        });

        // Buscar categoria para ver se tem pai
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        // Se tiver pai, associar também à categoria principal
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