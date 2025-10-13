-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "fiscalYearStartDay" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 1;
