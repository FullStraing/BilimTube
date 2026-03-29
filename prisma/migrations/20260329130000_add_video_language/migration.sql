ALTER TABLE "Video"
ADD COLUMN "language" "UiLanguage" NOT NULL DEFAULT 'ru';

CREATE INDEX "Video_language_contentType_isPublished_createdAt_idx"
ON "Video"("language", "contentType", "isPublished", "createdAt");
