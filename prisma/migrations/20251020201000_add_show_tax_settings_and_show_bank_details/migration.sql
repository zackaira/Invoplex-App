-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "showBankDetails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showTaxSettings" BOOLEAN NOT NULL DEFAULT false;
