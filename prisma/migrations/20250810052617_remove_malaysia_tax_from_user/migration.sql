/*
  Warnings:

  - You are about to drop the column `idType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idValue` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "idType",
DROP COLUMN "idValue",
DROP COLUMN "tin";
