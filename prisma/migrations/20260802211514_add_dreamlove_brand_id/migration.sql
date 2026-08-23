/*
  Warnings:

  - A unique constraint covering the columns `[dreamloveId]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "dreamloveId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Brand_dreamloveId_key" ON "Brand"("dreamloveId");
