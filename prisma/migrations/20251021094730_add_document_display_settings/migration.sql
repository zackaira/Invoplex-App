/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_userId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "businessFieldsToShow" TEXT,
ADD COLUMN     "clientFieldsToShow" TEXT,
ADD COLUMN     "showDiscount" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showNotes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showTax" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showTerms" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "public"."Product";

-- DropEnum
DROP TYPE "public"."ProductType";
