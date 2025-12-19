-- AlterTable
ALTER TABLE "product_reviews"
ADD COLUMN "merchantReply" TEXT,
ADD COLUMN "merchantReplyById" TEXT,
ADD COLUMN "merchantRepliedAt" TIMESTAMP(3),
ADD COLUMN "merchantReplyUpdatedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "product_reviews_merchantReplyById_idx" ON "product_reviews"("merchantReplyById");

-- AddForeignKey
ALTER TABLE "product_reviews"
ADD CONSTRAINT "product_reviews_merchantReplyById_fkey"
FOREIGN KEY ("merchantReplyById") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;


