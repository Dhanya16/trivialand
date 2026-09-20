export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedLevelsVisual } from "@/components/AnimatedVisuals";
import { fetchCategory, fetchSubcategories } from "@/lib/api/categories";
import { isNotFoundError } from "@/lib/api/fetch";

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  try {
    const [category, subs] = await Promise.all([
      fetchCategory(categorySlug),
      fetchSubcategories(categorySlug),
    ]);

    return (
      <PageLayout
        title={category.name}
        subtitle={category.description}
        visual={<AnimatedLevelsVisual />}
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {subs.map((sub) => (
            <GradientCard
              key={sub.slug}
              href={`/categories/${categorySlug}/${sub.slug}`}
              title={sub.name}
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
