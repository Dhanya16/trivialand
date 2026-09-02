-- CreateEnum
CREATE TYPE "QuizAttemptStatus" AS ENUM ('in_progress', 'completed');

-- AlterTable
ALTER TABLE "quiz_attempts" ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "QuizAttemptStatus" NOT NULL DEFAULT 'in_progress',
ALTER COLUMN "score" SET DEFAULT 0,
ALTER COLUMN "completed_at" DROP NOT NULL,
ALTER COLUMN "completed_at" DROP DEFAULT;
