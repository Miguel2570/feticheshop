import { Prisma } from "@prisma/client";

import { CategoryRepository } from "@/server/repositories/category.repository";

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  parentId?: string | null;
}

export class CategoryService {
  private repository = new CategoryRepository();

  async getCategories(options?: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    return this.repository.findAll(options);
  }

  async getCategoryTree() {
    return this.repository.findTree();
  }

  async getCategoryById(id: string) {
    const category = await this.repository.findById(id);

    if (!category || category.deletedAt) {
      throw new Error("Category not found");
    }

    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.repository.findBySlug(slug);

    if (!category || category.deletedAt) {
      throw new Error("Category not found");
    }

    return category;
  }

  async createCategory(data: CategoryInput) {
    const exists = await this.repository.findBySlug(
      data.slug
    );

    if (exists) {
      throw new Error("Slug already exists");
    }

    const prismaData: Prisma.CategoryCreateInput = {
      name: data.name,
      slug: data.slug,

      description: data.description ?? null,
      image: data.image ?? null,

      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,

      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,

      ...(data.parentId && {
        parent: {
          connect: {
            id: data.parentId,
          },
        },
      }),
    };

    return this.repository.create(prismaData);
  }

  async updateCategory(
    id: string,
    data: Partial<CategoryInput>
  ) {
    const category = await this.getCategoryById(id);

    if (
      data.slug &&
      data.slug !== category.slug
    ) {
      const exists = await this.repository.findBySlug(
        data.slug
      );

      if (exists && exists.id !== id) {
        throw new Error("Slug already exists");
      }
    }

    if (data.parentId === id) {
      throw new Error(
        "Category cannot be its own parent"
      );
    }

    const prismaData: Prisma.CategoryUpdateInput = {};

    if (data.name !== undefined)
      prismaData.name = data.name;

    if (data.slug !== undefined)
      prismaData.slug = data.slug;

    if (data.description !== undefined)
      prismaData.description = data.description;

    if (data.image !== undefined)
      prismaData.image = data.image;

    if (data.metaTitle !== undefined)
      prismaData.metaTitle = data.metaTitle;

    if (data.metaDescription !== undefined)
      prismaData.metaDescription =
        data.metaDescription;

    if (data.isActive !== undefined)
      prismaData.isActive = data.isActive;

    if (data.sortOrder !== undefined)
      prismaData.sortOrder = data.sortOrder;

    if (data.parentId !== undefined) {
      if (data.parentId === null) {
        prismaData.parent = {
          disconnect: true,
        };
      } else {
        prismaData.parent = {
          connect: {
            id: data.parentId,
          },
        };
      }
    }

    return this.repository.update(id, prismaData);
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    if (category.children.length > 0) {
      throw new Error(
        "Cannot delete category with children"
      );
    }

    if (category.products.length > 0) {
      throw new Error(
        "Cannot delete category with products"
      );
    }

    return this.repository.delete(id);
  }
}

export const categoryService =
  new CategoryService();