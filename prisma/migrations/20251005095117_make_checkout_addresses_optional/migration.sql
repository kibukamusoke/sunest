-- DropForeignKey
ALTER TABLE "checkouts" DROP CONSTRAINT "checkouts_billingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "checkouts" DROP CONSTRAINT "checkouts_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "checkouts" ALTER COLUMN "shippingAddressId" DROP NOT NULL,
ALTER COLUMN "billingAddressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_billingAddressId_fkey" FOREIGN KEY ("billingAddressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
