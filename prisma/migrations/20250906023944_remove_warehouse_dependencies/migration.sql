/*
  Warnings:

  - You are about to drop the column `warehouseId` on the `fulfillments` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `inventory_items` table. All the data in the column will be lost.
  - You are about to drop the column `fromWarehouseId` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `destinationWarehouseId` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWarehouseId` on the `stock_movements` table. All the data in the column will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,productVariantId,batchNumber]` on the table `inventory_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "fulfillments" DROP CONSTRAINT "fulfillments_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_items" DROP CONSTRAINT "inventory_items_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_fromWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_destinationWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_sourceWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_merchantId_fkey";

-- DropForeignKey
ALTER TABLE "warehouses" DROP CONSTRAINT "warehouses_parentId_fkey";

-- DropIndex
DROP INDEX "fulfillments_warehouseId_idx";

-- DropIndex
DROP INDEX "inventory_items_productId_productVariantId_warehouseId_batc_key";

-- DropIndex
DROP INDEX "inventory_items_warehouseId_idx";

-- AlterTable
ALTER TABLE "fulfillments" DROP COLUMN "warehouseId";

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "warehouseId";

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "fromWarehouseId";

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "destinationWarehouseId",
DROP COLUMN "sourceWarehouseId";

-- DropTable
DROP TABLE "warehouses";

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_productId_productVariantId_batchNumber_key" ON "inventory_items"("productId", "productVariantId", "batchNumber");
