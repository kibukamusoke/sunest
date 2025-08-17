-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('NRIC', 'BRN', 'PASSPORT', 'ARMY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "idType" "IdType",
ADD COLUMN     "idValue" TEXT,
ADD COLUMN     "tin" TEXT;

-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "eInvoiceOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idType" "IdType",
ADD COLUMN     "idValue" TEXT,
ADD COLUMN     "tin" TEXT;
