import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedLevelsVisual } from "@/components/AnimatedVisuals";
import { getCategory, getLevels, getSubcategory } from "@/lib/data";
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
  const category = getCategory(categorySlug);
  const subcategory = getSubcategory(categorySlug, subcategorySlug);

  if (!category || !subcategory) {
    notFound();
  }

  const levelList = getLevels(categorySlug, subcategorySlug);

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
}
