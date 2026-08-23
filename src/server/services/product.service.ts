import { Prisma } from "@prisma/client";

import { ProductRepository } from "@/server/repositories/product.repository";

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
    data: Prisma.ProductUpdateInput
  ) {
    await this.getProductById(id);

    return this.repository.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);

    return this.repository.delete(id);
  }
}

export const productService = new ProductService();