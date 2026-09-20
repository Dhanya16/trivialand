export type LevelStatus = 'locked' | 'unlocked' | 'completed';

export type CategoryResponse = {
  slug: string;
  name: string;
  description: string;
};

export type SubcategoryResponse = {
  slug: string;
  name: string;
  categorySlug: string;
};

export type LevelResponse = {
  id: string;
  name: string;
  categorySlug: string;
  subcategorySlug: string;
  status: LevelStatus;
};

export type LevelQuizListItem = {
  id: string;
  title: string;
  levelId: string;
  categorySlug: string;
  subcategorySlug: string;
};