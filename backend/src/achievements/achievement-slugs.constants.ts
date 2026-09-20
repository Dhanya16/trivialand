export const ACHIEVEMENT_SLUGS = {
  FIRST_QUIZ: 'first-quiz',
  FIRST_AI_QUIZ: 'first-ai-quiz',
  FIRST_LEVEL: 'first-level',
  FIRST_CONTEST: 'first-contest',
  LEVELS_5: 'levels-5',
  LEVELS_10: 'levels-10',
  LEVELS_25: 'levels-25',
  RATING_1200: 'rating-1200',
  RATING_1500: 'rating-1500',
} as const;

export type UserAchievementStats = {
  quizAttempts: number;
  aiQuizAttempts: number;
  levelsCleared: number;
  contestParticipations: number;
  submittedContests: number;
  rating: number;
};

export function resolveEligibleAchievementSlugs(
  stats: UserAchievementStats,
): string[] {
  const slugs: string[] = [];

  if (stats.quizAttempts >= 1) {
    slugs.push(ACHIEVEMENT_SLUGS.FIRST_QUIZ);
  }
  if (stats.aiQuizAttempts >= 1) {
    slugs.push(ACHIEVEMENT_SLUGS.FIRST_AI_QUIZ);
  }
  if (stats.levelsCleared >= 1) {
    slugs.push(ACHIEVEMENT_SLUGS.FIRST_LEVEL);
  }
  if (stats.contestParticipations >= 1) {
    slugs.push(ACHIEVEMENT_SLUGS.FIRST_CONTEST);
  }
  if (stats.levelsCleared >= 5) {
    slugs.push(ACHIEVEMENT_SLUGS.LEVELS_5);
  }
  if (stats.levelsCleared >= 10) {
    slugs.push(ACHIEVEMENT_SLUGS.LEVELS_10);
  }
  if (stats.levelsCleared >= 25) {
    slugs.push(ACHIEVEMENT_SLUGS.LEVELS_25);
  }
  if (stats.submittedContests > 0 && stats.rating >= 1200) {
    slugs.push(ACHIEVEMENT_SLUGS.RATING_1200);
  }
  if (stats.submittedContests > 0 && stats.rating >= 1500) {
    slugs.push(ACHIEVEMENT_SLUGS.RATING_1500);
  }

  return slugs;
}
