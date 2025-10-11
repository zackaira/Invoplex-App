-- AlterTable
ALTER TABLE "BusinessProfile" ADD COLUMN     "brandColor" TEXT DEFAULT '#000000',
ADD COLUMN     "personalName" TEXT;

-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "accountName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "invoiceTitle" TEXT NOT NULL DEFAULT 'INVOICE',
ADD COLUMN     "quoteTitle" TEXT NOT NULL DEFAULT 'QUOTE',
ADD COLUMN     "routingNumber" TEXT,
ADD COLUMN     "selectedTemplateId" TEXT NOT NULL DEFAULT 'classic',
ADD COLUMN     "swiftCode" TEXT;
