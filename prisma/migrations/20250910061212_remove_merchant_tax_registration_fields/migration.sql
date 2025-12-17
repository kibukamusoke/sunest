/*
  Warnings:

  - You are about to drop the column `registrationNumber` on the `merchants` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `merchants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "registrationNumber",
DROP COLUMN "taxId";
