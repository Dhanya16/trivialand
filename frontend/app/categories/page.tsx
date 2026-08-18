import GradientCard from "@/components/GradientCard";
import PageLayout from "@/components/PageLayout";
import { categories } from "@/lib/data";

export default function CategoriesPage() {
  return (
    <PageLayout fullWidth>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4 lg:gap-8">
        {categories.map((category) => (
          <GradientCard
            key={category.slug}
            href={`/categories/${category.slug}`}
            title={category.name}
            className="min-h-[128px] px-5 py-7 sm:min-h-[140px] sm:px-6 sm:py-8"
          />
        ))}
      </div>
    </PageLayout>
  );
}
