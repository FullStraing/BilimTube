-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN "childId" TEXT;

-- AlterTable
ALTER TABLE "WatchHistory" ADD COLUMN "childId" TEXT;

-- AlterTable
ALTER TABLE "QuizAttempt" ADD COLUMN "childId" TEXT;

-- DropIndex
DROP INDEX "Favorite_userId_videoId_key";

-- DropIndex
DROP INDEX "WatchHistory_userId_videoId_key";

-- CreateIndex
CREATE INDEX "Favorite_userId_childId_idx" ON "Favorite"("userId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_childId_videoId_key" ON "Favorite"("userId", "childId", "videoId");

-- CreateIndex
CREATE INDEX "WatchHistory_userId_childId_watchedAt_idx" ON "WatchHistory"("userId", "childId", "watchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WatchHistory_userId_childId_videoId_key" ON "WatchHistory"("userId", "childId", "videoId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_childId_createdAt_idx" ON "QuizAttempt"("userId", "childId", "createdAt");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchHistory" ADD CONSTRAINT "WatchHistory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
