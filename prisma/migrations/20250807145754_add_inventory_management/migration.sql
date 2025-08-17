-- CreateEnum
CREATE TYPE "WarehouseType" AS ENUM ('PHYSICAL', 'VIRTUAL', 'DROPSHIP', 'CONSIGNMENT');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('RECEIPT', 'SHIPMENT', 'ADJUSTMENT', 'TRANSFER', 'RESERVATION', 'RELEASE', 'CYCLE_COUNT', 'DAMAGE', 'RETURN', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "PriceAdjustmentType" AS ENUM ('FIXED', 'PERCENTAGE', 'MARKUP', 'DISCOUNT');

-- CreateTable
CREATE TABLE "warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" "WarehouseType" NOT NULL DEFAULT 'PHYSICAL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "capacity" INTEGER,
    "parentId" TEXT,
    "merchantId" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "warehouseId" TEXT NOT NULL,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "quantityAvailable" INTEGER NOT NULL DEFAULT 0,
    "quantityCommitted" INTEGER NOT NULL DEFAULT 0,
    "minimumStock" INTEGER DEFAULT 0,
    "maximumStock" INTEGER,
    "reorderQuantity" INTEGER,
    "leadTimeDays" INTEGER,
    "averageCost" DECIMAL(65,30) DEFAULT 0,
    "lastPurchaseCost" DECIMAL(65,30),
    "lastPurchaseDate" TIMESTAMP(3),
    "batchNumber" TEXT,
    "expirationDate" TIMESTAMP(3),
    "manufacturingDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCountDate" TIMESTAMP(3),
    "lastCountBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "reason" TEXT,
    "reasonCode" TEXT,
    "reference" TEXT,
    "quantityBefore" INTEGER NOT NULL,
    "quantityChange" INTEGER NOT NULL,
    "quantityAfter" INTEGER NOT NULL,
    "unitCost" DECIMAL(65,30),
    "totalCost" DECIMAL(65,30),
    "sourceWarehouseId" TEXT,
    "destinationWarehouseId" TEXT,
    "orderId" TEXT,
    "transferId" TEXT,
    "performedBy" TEXT NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_pricing_rules" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "minimumQuantity" INTEGER NOT NULL DEFAULT 1,
    "maximumQuantity" INTEGER,
    "priceAdjustment" DECIMAL(65,30) NOT NULL,
    "adjustmentType" "PriceAdjustmentType" NOT NULL,
    "minimumStockLevel" INTEGER,
    "maximumStockLevel" INTEGER,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE INDEX "warehouses_merchantId_idx" ON "warehouses"("merchantId");

-- CreateIndex
CREATE INDEX "warehouses_type_idx" ON "warehouses"("type");

-- CreateIndex
CREATE INDEX "warehouses_isActive_idx" ON "warehouses"("isActive");

-- CreateIndex
CREATE INDEX "inventory_items_warehouseId_idx" ON "inventory_items"("warehouseId");

-- CreateIndex
CREATE INDEX "inventory_items_productId_idx" ON "inventory_items"("productId");

-- CreateIndex
CREATE INDEX "inventory_items_quantityAvailable_idx" ON "inventory_items"("quantityAvailable");

-- CreateIndex
CREATE INDEX "inventory_items_minimumStock_idx" ON "inventory_items"("minimumStock");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_productId_productVariantId_warehouseId_batc_key" ON "inventory_items"("productId", "productVariantId", "warehouseId", "batchNumber");

-- CreateIndex
CREATE INDEX "stock_movements_inventoryItemId_idx" ON "stock_movements"("inventoryItemId");

-- CreateIndex
CREATE INDEX "stock_movements_type_idx" ON "stock_movements"("type");

-- CreateIndex
CREATE INDEX "stock_movements_performedAt_idx" ON "stock_movements"("performedAt");

-- CreateIndex
CREATE INDEX "stock_movements_orderId_idx" ON "stock_movements"("orderId");

-- CreateIndex
CREATE INDEX "inventory_pricing_rules_inventoryItemId_idx" ON "inventory_pricing_rules"("inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_pricing_rules_minimumQuantity_idx" ON "inventory_pricing_rules"("minimumQuantity");

-- CreateIndex
CREATE INDEX "inventory_pricing_rules_priority_idx" ON "inventory_pricing_rules"("priority");

-- CreateIndex
CREATE INDEX "inventory_pricing_rules_isActive_idx" ON "inventory_pricing_rules"("isActive");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_sourceWarehouseId_fkey" FOREIGN KEY ("sourceWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_pricing_rules" ADD CONSTRAINT "inventory_pricing_rules_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
