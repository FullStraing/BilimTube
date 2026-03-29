CREATE TYPE "VideoProvider" AS ENUM ('DIRECT', 'YOUTUBE');

ALTER TABLE "Video"
ADD COLUMN "provider" "VideoProvider" NOT NULL DEFAULT 'DIRECT',
ADD COLUMN "providerId" TEXT;
