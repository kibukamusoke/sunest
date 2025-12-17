-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "profilePictureUrl" TEXT;

-- AlterTable
ALTER TABLE "user_merchants" ADD COLUMN     "canManageFulfillment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageInventory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageRfq" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "invitedAt" TIMESTAMP(3),
ADD COLUMN     "invitedBy" TEXT,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "permissions" JSONB,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE';
