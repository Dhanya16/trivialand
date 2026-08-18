import { notFound } from "next/navigation";
import GlassCard from "@/components/GlassCard";
import PageLayout from "@/components/PageLayout";
import Quiz from "@/components/Quiz";
import { AnimatedQuizVisual } from "@/components/AnimatedVisuals";
import { getQuestions, getQuiz } from "@/lib/data";

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
  const quiz = getQuiz(quizId);
  const quizQuestions = getQuestions(quizId);

  if (!quiz || quizQuestions.length === 0) {
    notFound();
  }

  return (
    <PageLayout title="Quiz" subtitle={quiz.title} visual={<AnimatedQuizVisual />}>
      <GlassCard>
        <Quiz title={quiz.title} questions={quizQuestions} />
      </GlassCard>
    </PageLayout>
  );
}
