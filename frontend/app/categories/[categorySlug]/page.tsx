import { notFound } from "next/navigation";
import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { AnimatedLevelsVisual } from "@/components/AnimatedVisuals";
import { getCategory, getSubcategories } from "@/lib/data";

type Props = {
  params: Promise<{ categorySlug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const category = getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const subs = getSubcategories(categorySlug);

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
}
