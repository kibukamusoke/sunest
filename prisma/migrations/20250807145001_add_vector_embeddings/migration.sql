-- CreateExtension
CREATE EXTENSION
IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "descriptionEmbedding" vector
(1536),
ADD COLUMN     "embeddingCreatedAt" TIMESTAMP
(3),
ADD COLUMN     "embeddingHash" TEXT,
ADD COLUMN     "embeddingVersion" TEXT,
ADD COLUMN     "nameEmbedding" vector
(1536);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "combinedEmbedding" vector
(1536),
ADD COLUMN     "descriptionEmbedding" vector
(1536),
ADD COLUMN     "embeddingCreatedAt" TIMESTAMP
(3),
ADD COLUMN     "embeddingHash" TEXT,
ADD COLUMN     "embeddingVersion" TEXT,
ADD COLUMN     "specificationsEmbedding" vector
(1536),
ADD COLUMN     "titleEmbedding" vector
(1536);

-- CreateIndex
CREATE INDEX "categories_embeddingVersion_idx" ON "categories"("embeddingVersion");

-- CreateIndex
CREATE INDEX "categories_embeddingCreatedAt_idx" ON "categories"("embeddingCreatedAt");

-- CreateIndex
CREATE INDEX "products_embeddingVersion_idx" ON "products"("embeddingVersion");

-- CreateIndex
CREATE INDEX "products_embeddingCreatedAt_idx" ON "products"("embeddingCreatedAt");
