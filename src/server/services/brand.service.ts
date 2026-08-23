import { Prisma } from "@prisma/client";

import { BrandRepository } from "@/server/repositories/brand.repository";

export interface BrandInput {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
}

export class BrandService {
  private repository = new BrandRepository();

  async getBrands(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    return this.repository.findAll(options);
  }

  async getBrandById(id: string) {
    const brand = await this.repository.findById(id);

    if (!brand || brand.deletedAt) {
      throw new Error("Brand not found");
    }

    return brand;
  }

  async getBrandBySlug(slug: string) {
    const brand = await this.repository.findBySlug(slug);

    if (!brand || brand.deletedAt) {
      throw new Error("Brand not found");
    }

    return brand;
  }

  async createBrand(data: BrandInput) {
    const exists = await this.repository.findBySlug(
      data.slug
    );

    if (exists) {
      throw new Error("Slug already exists");
    }

    const prismaData: Prisma.BrandCreateInput = {
      name: data.name,
      slug: data.slug,

      description: data.description ?? null,
      logo: data.logo ?? null,

      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,

      isActive: data.isActive ?? true,
    };

    return this.repository.create(prismaData);
  }

  async updateBrand(
    id: string,
    data: Partial<BrandInput>
  ) {
    const brand = await this.getBrandById(id);

    if (
      data.slug &&
      data.slug !== brand.slug
    ) {
      const exists = await this.repository.findBySlug(
        data.slug
      );

      if (exists && exists.id !== id) {
        throw new Error("Slug already exists");
      }
    }

    const prismaData: Prisma.BrandUpdateInput = {};

    if (data.name !== undefined)
      prismaData.name = data.name;

    if (data.slug !== undefined)
      prismaData.slug = data.slug;

    if (data.description !== undefined)
      prismaData.description = data.description;

    if (data.logo !== undefined)
      prismaData.logo = data.logo;

    if (data.metaTitle !== undefined)
      prismaData.metaTitle = data.metaTitle;

    if (data.metaDescription !== undefined)
      prismaData.metaDescription =
        data.metaDescription;

    if (data.isActive !== undefined)
      prismaData.isActive = data.isActive;

    return this.repository.update(id, prismaData);
  }

  async deleteBrand(id: string) {
    const brand = await this.getBrandById(id);

    if (brand.products.length > 0) {
      throw new Error(
        "Cannot delete brand with products"
      );
    }

    return this.repository.delete(id);
  }
}

export const brandService = new BrandService();