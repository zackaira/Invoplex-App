-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "currencyDisplayFormat" TEXT NOT NULL DEFAULT 'symbol_before',
ADD COLUMN     "taxName" TEXT NOT NULL DEFAULT 'Tax';
