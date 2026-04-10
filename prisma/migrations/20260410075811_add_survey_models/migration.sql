-- CreateEnum
CREATE TYPE "SurveyQuestionType" AS ENUM ('SCALE', 'TEXT', 'SINGLE_CHOICE');

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "childId" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyAnswer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionType" "SurveyQuestionType" NOT NULL,
    "ratingValue" INTEGER,
    "textValue" TEXT,
    "choiceValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SurveyResponse_userId_childId_submittedAt_idx" ON "SurveyResponse"("userId", "childId", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_userId_version_key" ON "SurveyResponse"("userId", "version");

-- CreateIndex
CREATE INDEX "SurveyAnswer_questionKey_idx" ON "SurveyAnswer"("questionKey");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyAnswer_responseId_questionKey_key" ON "SurveyAnswer"("responseId", "questionKey");

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_childId_fkey" FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;
