export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedLevelsVisual } from "@/components/AnimatedVisuals";
import { fetchCategory, fetchLevels, fetchSubcategories } from "@/lib/api/categories";
import { isNotFoundError } from "@/lib/api/fetch";
import type { LevelStatus } from "@/lib/types";

type Props = {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
};

function statusLabel(status: LevelStatus) {
  if (status === "completed") return "✓ Completed";
  if (status === "unlocked") return "Unlocked";
  return "🔒 Locked";
}

export default async function SubcategoryPage({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params;

  try {
    const [category, subs, levelList] = await Promise.all([
      fetchCategory(categorySlug),
      fetchSubcategories(categorySlug),
      fetchLevels(categorySlug, subcategorySlug),
    ]);

    const subcategory = subs.find((sub) => sub.slug === subcategorySlug);
    if (!subcategory) notFound();

    return (
      <PageLayout
        title={subcategory.name}
        subtitle={category.name}
        visual={<AnimatedLevelsVisual />}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {levelList.map((level) => (
            <GradientCard
              key={level.id}
              href={
                level.status === "locked"
                  ? undefined
                  : `/categories/${categorySlug}/${subcategorySlug}/${level.id}`
              }
              title={level.name}
              subtitle={statusLabel(level.status)}
              disabled={level.status === "locked"}
            />
          ))}
        </div>
      </PageLayout>
    );
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }
}
