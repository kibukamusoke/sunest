-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('SSM', 'BUSINESS_LICENSE', 'TAX_CERTIFICATE', 'BANK_STATEMENT', 'INSURANCE_CERTIFICATE', 'MEMORANDUM_ARTICLES', 'FORM_24', 'FORM_44', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED', 'RESUBMISSION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileStatus" ADD VALUE 'VERIFIED';
ALTER TYPE "FileStatus" ADD VALUE 'REJECTED';
ALTER TYPE "FileStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "url" TEXT,
ALTER COLUMN "bucket" DROP NOT NULL;

-- CreateTable
CREATE TABLE "merchant_documents" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "description" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "merchant_documents_merchantId_fileId_key" ON "merchant_documents"("merchantId", "fileId");

-- AddForeignKey
ALTER TABLE "merchant_documents" ADD CONSTRAINT "merchant_documents_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "merchants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_documents" ADD CONSTRAINT "merchant_documents_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
