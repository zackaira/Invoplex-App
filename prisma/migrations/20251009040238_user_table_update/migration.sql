-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ACCOUNTANT', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
