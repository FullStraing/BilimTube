-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('LONG', 'SHORT');

-- AlterTable
ALTER TABLE "Video"
ADD COLUMN "contentType" "ContentType" NOT NULL DEFAULT 'LONG';

-- CreateTable
CREATE TABLE "ShortView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childId" TEXT,
    "videoId" TEXT NOT NULL,
    "watchedMs" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortView_userId_childId_videoId_key" ON "ShortView"("userId", "childId", "videoId");

-- CreateIndex
CREATE INDEX "ShortView_userId_childId_viewedAt_idx" ON "ShortView"("userId", "childId", "viewedAt");

-- CreateIndex
CREATE INDEX "ShortView_videoId_viewedAt_idx" ON "ShortView"("videoId", "viewedAt");

-- CreateIndex
CREATE INDEX "Video_contentType_isPublished_createdAt_idx" ON "Video"("contentType", "isPublished", "createdAt");

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortView" ADD CONSTRAINT "ShortView_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;