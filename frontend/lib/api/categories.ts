import type { Category, Level, Quiz, Subcategory } from "../types";
import { apiGet } from "./fetch";
import { serverGet } from "./server";

export async function fetchCategories() {
  return apiGet<Category[]>("/categories");
}

export async function fetchCategory(slug: string) {
  return apiGet<Category>(`/categories/${slug}`);
}

export async function fetchSubcategories(categorySlug: string) {
  return apiGet<Subcategory[]>(`/categories/${categorySlug}/subcategories`);
}

export async function fetchLevels(categorySlug: string, subcategorySlug: string) {
  return serverGet<Level[]>(
    `/categories/${categorySlug}/${subcategorySlug}/levels`,
  );
}

export async function fetchLevelQuizzes(
  categorySlug: string,
  subcategorySlug: string,
  levelId: string,
) {
  return apiGet<Quiz[]>(
    `/categories/${categorySlug}/${subcategorySlug}/levels/${levelId}/quizzes`,
  );
}
