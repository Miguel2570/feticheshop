import { Prisma } from "@prisma/client";

import { AttributeRepository } from "@/server/repositories/attribute.repository";

export interface AttributeInput {
  name: string;
  slug: string;
  description?: string | null;

  isFilter?: boolean;
  isRequired?: boolean;
  isActive?: boolean;

  position?: number;
}

export class AttributeService {
  private repository = new AttributeRepository();

  async getAttributes(options?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    return this.repository.findAll(options);
  }

  async getAttributeById(id: string) {
    const attribute =
      await this.repository.findById(id);

    if (!attribute || attribute.deletedAt) {
      throw new Error("Attribute not found");
    }

    return attribute;
  }

  async getAttributeBySlug(slug: string) {
    const attribute =
      await this.repository.findBySlug(slug);

    if (!attribute || attribute.deletedAt) {
      throw new Error("Attribute not found");
    }

    return attribute;
  }

  async createAttribute(data: AttributeInput) {
    const exists =
      await this.repository.findBySlug(data.slug);

    if (exists) {
      throw new Error("Slug already exists");
    }

    const prismaData: Prisma.AttributeCreateInput = {
      name: data.name,
      slug: data.slug,

      description: data.description ?? null,

      isFilter: data.isFilter ?? true,
      isRequired: data.isRequired ?? false,
      isActive: data.isActive ?? true,

      position: data.position ?? 0,
    };

    return this.repository.create(prismaData);
  }

  async updateAttribute(
    id: string,
    data: Partial<AttributeInput>
  ) {
    const attribute =
      await this.getAttributeById(id);

    if (
      data.slug &&
      data.slug !== attribute.slug
    ) {
      const exists =
        await this.repository.findBySlug(
          data.slug
        );

      if (exists && exists.id !== id) {
        throw new Error("Slug already exists");
      }
    }

    const prismaData: Prisma.AttributeUpdateInput =
      {};

    if (data.name !== undefined)
      prismaData.name = data.name;

    if (data.slug !== undefined)
      prismaData.slug = data.slug;

    if (data.description !== undefined)
      prismaData.description = data.description;

    if (data.isFilter !== undefined)
      prismaData.isFilter = data.isFilter;

    if (data.isRequired !== undefined)
      prismaData.isRequired = data.isRequired;

    if (data.isActive !== undefined)
      prismaData.isActive = data.isActive;

    if (data.position !== undefined)
      prismaData.position = data.position;

    return this.repository.update(
      id,
      prismaData
    );
  }

  async deleteAttribute(id: string) {
    const attribute =
      await this.getAttributeById(id);

    if (attribute.values.length > 0) {
      throw new Error(
        "Cannot delete attribute with values"
      );
    }

    return this.repository.delete(id);
  }
}

export const attributeService =
  new AttributeService();