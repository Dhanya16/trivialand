export type AchievementDefinition = {
  slug: string;
  name: string;
  description: string;
  criteria: string;
};

export type AchievementDefinitionsResponse = {
  achievements: AchievementDefinition[];
};
