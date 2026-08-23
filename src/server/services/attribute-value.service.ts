import { Prisma } from "@prisma/client";

import { AttributeValueRepository } from "@/server/repositories/attribute-value.repository";

export interface AttributeValueInput {
  attributeId: string;

  value: string;
  slug: string;

  description?: string | null;

  colorHex?: string | null;
  image?: string | null;

  position?: number;

  isActive?: boolean;
}

export class AttributeValueService {
  private repository =
    new AttributeValueRepository();

  async getValues(options?: {
    page?: number;
    limit?: number;
    search?: string;
    attributeId?: string;
    isActive?: boolean;
  }) {
    return this.repository.findAll(options);
  }

  async getValueById(id: string) {
    const value =
      await this.repository.findById(id);

    if (!value || value.deletedAt) {
      throw new Error(
        "Attribute value not found"
      );
    }

    return value;
  }

  async createValue(
    data: AttributeValueInput
  ) {
    const exists =
      await this.repository.findBySlug(
        data.attributeId,
        data.slug
      );

    if (exists) {
      throw new Error("Slug already exists");
    }

    const prismaData: Prisma.AttributeValueCreateInput =
      {
        value: data.value,
        slug: data.slug,

        description:
          data.description ?? null,

        colorHex: data.colorHex ?? null,
        image: data.image ?? null,

        position: data.position ?? 0,

        isActive: data.isActive ?? true,

        attribute: {
          connect: {
            id: data.attributeId,
          },
        },
      };

    return this.repository.create(prismaData);
  }

  async updateValue(
    id: string,
    data: Partial<AttributeValueInput>
  ) {
    const current =
      await this.getValueById(id);

    if (
      data.slug &&
      data.slug !== current.slug
    ) {
      const exists =
        await this.repository.findBySlug(
          current.attributeId,
          data.slug
        );

      if (
        exists &&
        exists.id !== current.id
      ) {
        throw new Error(
          "Slug already exists"
        );
      }
    }

    const prismaData: Prisma.AttributeValueUpdateInput =
      {};

    if (data.value !== undefined)
      prismaData.value = data.value;

    if (data.slug !== undefined)
      prismaData.slug = data.slug;

    if (data.description !== undefined)
      prismaData.description =
        data.description;

    if (data.colorHex !== undefined)
      prismaData.colorHex =
        data.colorHex;

    if (data.image !== undefined)
      prismaData.image = data.image;

    if (data.position !== undefined)
      prismaData.position =
        data.position;

    if (data.isActive !== undefined)
      prismaData.isActive =
        data.isActive;

    return this.repository.update(
      id,
      prismaData
    );
  }

  async deleteValue(id: string) {
    const value =
      await this.getValueById(id);

    if (value.products.length > 0) {
      throw new Error(
        "Cannot delete value with products"
      );
    }

    return this.repository.delete(id);
  }
}

export const attributeValueService =
  new AttributeValueService();