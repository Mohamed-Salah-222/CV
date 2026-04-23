-- Truncate existing test data (required: clerkId is NOT NULL with no default)
TRUNCATE TABLE "users" CASCADE;

-- AlterTable: drop old columns, add new Clerk-compatible ones
ALTER TABLE "users" DROP COLUMN "name",
DROP COLUMN "passwordHash",
ADD COLUMN "clerkId" TEXT NOT NULL,
ADD COLUMN "firstName" TEXT,
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "lastName" TEXT;

-- CreateIndex: unique constraint on clerkId
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");
