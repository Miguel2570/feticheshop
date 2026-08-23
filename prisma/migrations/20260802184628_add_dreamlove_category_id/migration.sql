/*
  Warnings:

  - A unique constraint covering the columns `[dreamloveId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ProductCategory_categoryId_idx";

-- DropIndex
DROP INDEX "ProductCategory_productId_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "dreamloveId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Category_dreamloveId_key" ON "Category"("dreamloveId");
