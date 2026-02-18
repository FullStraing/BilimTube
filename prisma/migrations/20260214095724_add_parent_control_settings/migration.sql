-- AlterTable
ALTER TABLE "ChildProfile" ADD COLUMN     "allowedAgeGroups" TEXT[] DEFAULT ARRAY['4-6', '7-9', '10-13']::TEXT[],
ADD COLUMN     "dailyLimitMinutes" INTEGER NOT NULL DEFAULT 120,
ADD COLUMN     "educationalOnly" BOOLEAN NOT NULL DEFAULT false;
