export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import QuizPlayer from "@/components/QuizPlayer";
import { AnimatedQuizVisual } from "@/components/AnimatedVisuals";
import { fetchQuiz, fetchQuizQuestions } from "@/lib/api/quizzes";
import { isNotFoundError } from "@/lib/api/fetch";

type Props = {
  params: Promise<{
    categorySlug: string;
    subcategorySlug: string;
    levelId: string;
    quizId: string;
  }>;
};

export default async function QuizPage({ params }: Props) {
  const { quizId } = await params;

  try {
    const [quiz, quizQuestions] = await Promise.all([
      fetchQuiz(quizId),
      fetchQuizQuestions(quizId),
    ]);

    if (quizQuestions.length === 0) {
      notFound();
    }

    return (
      <PageLayout title="Quiz" subtitle={quiz.title} visual={<AnimatedQuizVisual />}>
        <GlassCard>
          <QuizPlayer quizId={quizId} title={quiz.title} questions={quizQuestions} />
        </GlassCard>
      </PageLayout>
    );
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
}
