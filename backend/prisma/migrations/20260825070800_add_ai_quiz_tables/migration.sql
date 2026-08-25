-- CreateEnum
CREATE TYPE "AiQuizStatus" AS ENUM ('processing', 'ready', 'failed');

-- CreateTable
CREATE TABLE "uploaded_materials" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploaded_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_quizzes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "AiQuizStatus" NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_questions" (
    "id" TEXT NOT NULL,
    "ai_quiz_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ai_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_options" (
    "id" TEXT NOT NULL,
    "ai_question_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_quiz_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ai_quiz_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "uploaded_materials_user_id_created_at_idx" ON "uploaded_materials"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_quizzes_user_id_created_at_idx" ON "ai_quizzes"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_questions_ai_quiz_id_order_key" ON "ai_questions"("ai_quiz_id", "order");

-- CreateIndex
CREATE INDEX "ai_quiz_attempts_user_id_completed_at_idx" ON "ai_quiz_attempts"("user_id", "completed_at");

-- AddForeignKey
ALTER TABLE "uploaded_materials" ADD CONSTRAINT "uploaded_materials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_quizzes" ADD CONSTRAINT "ai_quizzes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_quizzes" ADD CONSTRAINT "ai_quizzes_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "uploaded_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_questions" ADD CONSTRAINT "ai_questions_ai_quiz_id_fkey" FOREIGN KEY ("ai_quiz_id") REFERENCES "ai_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_options" ADD CONSTRAINT "ai_options_ai_question_id_fkey" FOREIGN KEY ("ai_question_id") REFERENCES "ai_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_quiz_attempts" ADD CONSTRAINT "ai_quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_quiz_attempts" ADD CONSTRAINT "ai_quiz_attempts_ai_quiz_id_fkey" FOREIGN KEY ("ai_quiz_id") REFERENCES "ai_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
