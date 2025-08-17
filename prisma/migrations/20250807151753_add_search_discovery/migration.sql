-- CreateEnum
CREATE TYPE "SearchType" AS ENUM ('FULL_TEXT', 'SKU', 'CATEGORY', 'SPECIFICATION', 'FILTERED', 'COMPARISON');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "lastSearched" TIMESTAMP(3),
ADD COLUMN     "searchCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "searchScore" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "searchVector" TEXT;

-- CreateTable
CREATE TABLE "search_analytics" (
    "id" TEXT NOT NULL,
    "searchTerm" TEXT NOT NULL,
    "searchType" "SearchType" NOT NULL DEFAULT 'FULL_TEXT',
    "filters" TEXT,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "clickedResult" TEXT,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "merchantId" TEXT,
    "executionTime" INTEGER,
    "searchAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_searches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "searchTerm" TEXT,
    "filters" TEXT NOT NULL,
    "alertOnNewResults" BOOLEAN NOT NULL DEFAULT false,
    "alertOnPriceChange" BOOLEAN NOT NULL DEFAULT false,
    "lastExecuted" TIMESTAMP(3),
    "resultCount" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_searches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_analytics_searchTerm_idx" ON "search_analytics"("searchTerm");

-- CreateIndex
CREATE INDEX "search_analytics_searchAt_idx" ON "search_analytics"("searchAt");

-- CreateIndex
CREATE INDEX "search_analytics_merchantId_idx" ON "search_analytics"("merchantId");

-- CreateIndex
CREATE INDEX "search_analytics_userId_idx" ON "search_analytics"("userId");

-- CreateIndex
CREATE INDEX "saved_searches_userId_idx" ON "saved_searches"("userId");

-- CreateIndex
CREATE INDEX "saved_searches_isActive_idx" ON "saved_searches"("isActive");

-- CreateIndex
CREATE INDEX "products_searchScore_idx" ON "products"("searchScore");

-- CreateIndex
CREATE INDEX "products_lastSearched_idx" ON "products"("lastSearched");

-- CreateIndex
CREATE INDEX "products_searchCount_idx" ON "products"("searchCount");
