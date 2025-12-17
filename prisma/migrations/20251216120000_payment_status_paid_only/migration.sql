/*
  PaymentStatus enum change:
  - Old: PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED, CANCELLED
  - New: PENDING, PAID, CANCELLED

  IMPORTANT:
  Postgres disallows using a freshly-added enum value inside the same transaction.
  Prisma runs migrations in a transaction, so we must do the "new enum type" swap
  and map values via text/CASE during the type change.
*/

-- 1) Rename old enum and create the new enum
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- 2) Drop default (it references the old enum type and blocks the type change)
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" DROP DEFAULT;

-- 3) Convert the column with mapping
ALTER TABLE "orders"
  ALTER COLUMN "paymentStatus" TYPE "PaymentStatus"
  USING (
    CASE
      WHEN "paymentStatus"::text = 'CAPTURED' THEN 'PAID'
      WHEN "paymentStatus"::text IN ('FAILED', 'REFUNDED', 'CANCELLED') THEN 'CANCELLED'
      ELSE 'PENDING'
    END
  )::"PaymentStatus";

-- 4) Restore default on the new enum type
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING'::"PaymentStatus";

-- 5) Drop the old enum
DROP TYPE "PaymentStatus_old";


