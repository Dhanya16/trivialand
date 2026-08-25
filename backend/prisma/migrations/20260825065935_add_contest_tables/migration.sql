-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('upcoming', 'live', 'past');

-- CreateTable
CREATE TABLE "contests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "ContestStatus" NOT NULL DEFAULT 'upcoming',

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_questions" (
    "id" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,

    CONSTRAINT "contest_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_participations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "score" INTEGER,

    CONSTRAINT "contest_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_answers" (
    "id" TEXT NOT NULL,
    "participation_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option_id" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,

    CONSTRAINT "contest_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_ratings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contest_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contests_status_start_time_idx" ON "contests"("status", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "contest_questions_contest_id_question_id_key" ON "contest_questions"("contest_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "contest_questions_contest_id_order_key" ON "contest_questions"("contest_id", "order");

-- CreateIndex
CREATE INDEX "contest_participations_contest_id_score_idx" ON "contest_participations"("contest_id", "score");

-- CreateIndex
CREATE UNIQUE INDEX "contest_participations_user_id_contest_id_key" ON "contest_participations"("user_id", "contest_id");

-- CreateIndex
CREATE UNIQUE INDEX "contest_answers_participation_id_question_id_key" ON "contest_answers"("participation_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "contest_ratings_user_id_key" ON "contest_ratings"("user_id");

-- CreateIndex
CREATE INDEX "contest_ratings_rating_idx" ON "contest_ratings"("rating");

-- AddForeignKey
ALTER TABLE "contest_questions" ADD CONSTRAINT "contest_questions_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_questions" ADD CONSTRAINT "contest_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_participations" ADD CONSTRAINT "contest_participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_participations" ADD CONSTRAINT "contest_participations_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_answers" ADD CONSTRAINT "contest_answers_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "contest_participations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_answers" ADD CONSTRAINT "contest_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_answers" ADD CONSTRAINT "contest_answers_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_ratings" ADD CONSTRAINT "contest_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
