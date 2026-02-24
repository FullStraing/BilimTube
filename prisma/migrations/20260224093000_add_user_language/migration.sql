-- CreateEnum
CREATE TYPE "UiLanguage" AS ENUM ('ru', 'en', 'ky');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "language" "UiLanguage" NOT NULL DEFAULT 'ru';