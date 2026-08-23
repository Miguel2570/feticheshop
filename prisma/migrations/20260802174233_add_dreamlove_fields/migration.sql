/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `apiSecret` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dreamloveId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SupplierSync" DROP CONSTRAINT "SupplierSync_supplierId_fkey";

-- DropIndex
DROP INDEX "SupplierSync_startedAt_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "dreamloveId" INTEGER;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "apiKey",
DROP COLUMN "apiSecret",
DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Product_dreamloveId_key" ON "Product"("dreamloveId");

-- AddForeignKey
ALTER TABLE "SupplierSync" ADD CONSTRAINT "SupplierSync_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
