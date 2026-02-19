DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'AuthMethod'
      AND e.enumlabel = 'google'
  ) THEN
    ALTER TYPE "AuthMethod" ADD VALUE 'google';
  END IF;
END $$;

ALTER TABLE "User"
ADD COLUMN "googleId" TEXT;

ALTER TABLE "User"
ALTER COLUMN "passwordHash" DROP NOT NULL;

CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");