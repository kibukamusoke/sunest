-- CreateEnum
CREATE TYPE "TicketMessageAuthorType" AS ENUM ('CUSTOMER', 'SUPPORT');

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "publicToken" TEXT;

-- Backfill existing rows (if any) with generated tokens
UPDATE "tickets"
SET "publicToken" = md5(random()::text || clock_timestamp()::text)
WHERE "publicToken" IS NULL;

-- Make column required
ALTER TABLE "tickets" ALTER COLUMN "publicToken" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tickets_publicToken_key" ON "tickets"("publicToken");

-- CreateTable
CREATE TABLE "ticket_messages" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorType" "TicketMessageAuthorType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_messages_ticketId_idx" ON "ticket_messages"("ticketId");

-- CreateIndex
CREATE INDEX "ticket_messages_createdAt_idx" ON "ticket_messages"("createdAt");

-- AddForeignKey
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;


