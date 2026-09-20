export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedQuizVisual } from "@/components/AnimatedVisuals";
import { fetchLevelQuizzes, fetchLevels, fetchSubcategories } from "@/lib/api/categories";
import { isNotFoundError } from "@/lib/api/fetch";

type Props = {
  params: Promise<{ categorySlug: string; subcategorySlug: string; levelId: string }>;
};

export default async function LevelPage({ params }: Props) {
  const { categorySlug, subcategorySlug, levelId } = await params;

  try {
    const [subs, levels, levelQuizzes] = await Promise.all([
      fetchSubcategories(categorySlug),
      fetchLevels(categorySlug, subcategorySlug),
      fetchLevelQuizzes(categorySlug, subcategorySlug, levelId),
    ]);

    const subcategory = subs.find((sub) => sub.slug === subcategorySlug);
    const level = levels.find((item) => item.id === levelId);

    if (!subcategory || !level || level.status === "locked") {
      notFound();
    }

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
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
}
