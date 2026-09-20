import {
  ACHIEVEMENT_SLUGS,
  resolveEligibleAchievementSlugs,
} from '../../src/achievements/achievement-slugs.constants';

describe('resolveEligibleAchievementSlugs', () => {
  const emptyStats = {
    quizAttempts: 0,
    aiQuizAttempts: 0,
    levelsCleared: 0,
    contestParticipations: 0,
    submittedContests: 0,
    rating: 1200,
  };

  it('returns no slugs when user has no qualifying activity', () => {
    expect(resolveEligibleAchievementSlugs(emptyStats)).toEqual([]);
  });

  it('triggers first quiz completed', () => {
    const slugs = resolveEligibleAchievementSlugs({
      ...emptyStats,
      quizAttempts: 1,
    });

    expect(slugs).toContain(ACHIEVEMENT_SLUGS.FIRST_QUIZ);
  });

  it('triggers first level cleared', () => {
    const slugs = resolveEligibleAchievementSlugs({
      ...emptyStats,
      levelsCleared: 1,
    });

    expect(slugs).toContain(ACHIEVEMENT_SLUGS.FIRST_LEVEL);
  });

  it('triggers first contest participated', () => {
    const slugs = resolveEligibleAchievementSlugs({
      ...emptyStats,
      contestParticipations: 1,
    });

    expect(slugs).toContain(ACHIEVEMENT_SLUGS.FIRST_CONTEST);
  });

  it('triggers level milestones at 5, 10, and 25', () => {
    const slugs = resolveEligibleAchievementSlugs({
      ...emptyStats,
      levelsCleared: 25,
    });

    expect(slugs).toEqual(
      expect.arrayContaining([
        ACHIEVEMENT_SLUGS.FIRST_LEVEL,
        ACHIEVEMENT_SLUGS.LEVELS_5,
        ACHIEVEMENT_SLUGS.LEVELS_10,
        ACHIEVEMENT_SLUGS.LEVELS_25,
      ]),
    );
  });

  it('triggers contest rating milestones only after a submitted contest', () => {
    const withoutSubmit = resolveEligibleAchievementSlugs({
      ...emptyStats,
      contestParticipations: 1,
      rating: 1500,
    });
    const withSubmit = resolveEligibleAchievementSlugs({
      ...emptyStats,
      contestParticipations: 1,
      submittedContests: 1,
      rating: 1500,
    });

    expect(withoutSubmit).not.toContain(ACHIEVEMENT_SLUGS.RATING_1200);
    expect(withSubmit).toEqual(
      expect.arrayContaining([
        ACHIEVEMENT_SLUGS.RATING_1200,
        ACHIEVEMENT_SLUGS.RATING_1500,
      ]),
    );
  });
});
