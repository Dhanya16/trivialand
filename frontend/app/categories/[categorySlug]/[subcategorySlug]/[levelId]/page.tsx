import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedQuizVisual } from "@/components/AnimatedVisuals";
import { getLevel, getQuizzesForLevel, getSubcategory } from "@/lib/data";

type Props = {
  params: Promise<{ categorySlug: string; subcategorySlug: string; levelId: string }>;
};

export default async function LevelPage({ params }: Props) {
  const { categorySlug, subcategorySlug, levelId } = await params;
  const subcategory = getSubcategory(categorySlug, subcategorySlug);
  const level = getLevel(categorySlug, subcategorySlug, levelId);

  if (!subcategory || !level || level.status === "locked") {
    notFound();
  }

  const levelQuizzes = getQuizzesForLevel(levelId);

  return (
    <PageLayout
      title={level.name}
      subtitle={subcategory.name}
      visual={<AnimatedQuizVisual />}
    >
      {levelQuizzes.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No quizzes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {levelQuizzes.map((quiz) => (
            <GradientCard
              key={quiz.id}
              href={`/categories/${categorySlug}/${subcategorySlug}/${levelId}/quiz/${quiz.id}`}
              title={quiz.title}
              subtitle="Start quiz"
            />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
