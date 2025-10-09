-- First, update any existing documents with VIEWED status to SENT
UPDATE "Document" SET status = 'SENT' WHERE status = 'VIEWED';

-- PostgreSQL doesn't support DROP VALUE from ENUM directly in older versions
-- So we need to recreate the enum type

-- Create a new enum without VIEWED
CREATE TYPE "DocumentStatus_new" AS ENUM ('DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'CONVERTED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');

-- Update the table to use the new enum
ALTER TABLE "Document" ALTER COLUMN status TYPE "DocumentStatus_new" USING status::text::"DocumentStatus_new";

-- Drop the old enum
DROP TYPE "DocumentStatus";

-- Rename the new enum to the original name
ALTER TYPE "DocumentStatus_new" RENAME TO "DocumentStatus";

