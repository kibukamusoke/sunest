-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "localizedModel" TEXT,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "osVersion" TEXT,
ADD COLUMN     "product" TEXT,
ADD COLUMN     "sdkVersion" TEXT;
