import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsService } from '../../src/achievements/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AchievementsService', () => {
  let service: AchievementsService;

  const prisma = {
    achievement: { findMany: jest.fn() },
    quizAttempt: { count: jest.fn() },
    aiQuizAttempt: { count: jest.fn() },
    levelProgress: { count: jest.fn() },
    contestParticipation: { count: jest.fn() },
    contestRating: { findUnique: jest.fn() },
    userAchievement: { createMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AchievementsService>(AchievementsService);
    jest.clearAllMocks();
    prisma.achievement.findMany.mockImplementation((args) => {
      if (args?.where?.slug?.in) {
        return Promise.resolve(
          args.where.slug.in.map((slug: string) => ({ id: `ach-${slug}` })),
        );
      }

      return Promise.resolve([
        {
          slug: 'first-quiz',
          name: 'First quiz completed',
          description: 'Complete your first quiz.',
          criteria: 'quiz_attempts >= 1',
        },
      ]);
    });
    prisma.userAchievement.createMany.mockResolvedValue({ count: 1 });
  });

  describe('findAllDefinitions', () => {
    it('returns all achievement definitions', async () => {
      const result = await service.findAllDefinitions();

      expect(result.achievements).toHaveLength(1);
      expect(result.achievements[0].slug).toBe('first-quiz');
    });
  });

  describe('awardEligibleAchievements', () => {
    it('awards first-contest on join without requiring a submit', async () => {
      prisma.quizAttempt.count.mockResolvedValue(0);
      prisma.aiQuizAttempt.count.mockResolvedValue(0);
      prisma.levelProgress.count.mockResolvedValue(0);
      prisma.contestParticipation.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);
      prisma.contestRating.findUnique.mockResolvedValue({ rating: 1200 });

      await service.awardEligibleAchievements('user-1');

      expect(prisma.userAchievement.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user-1', achievementId: 'ach-first-contest' }],
        skipDuplicates: true,
      });
    });

    it('awards first-quiz after a completed quiz attempt', async () => {
      prisma.quizAttempt.count.mockResolvedValue(1);
      prisma.aiQuizAttempt.count.mockResolvedValue(0);
      prisma.levelProgress.count.mockResolvedValue(0);
      prisma.contestParticipation.count.mockResolvedValue(0);
      prisma.contestRating.findUnique.mockResolvedValue(null);

      await service.awardEligibleAchievements('user-1');

      const createCall = prisma.userAchievement.createMany.mock.calls[0][0];
      const awardedIds = createCall.data.map(
        (item: { achievementId: string }) => item.achievementId,
      );

      expect(awardedIds).toContain('ach-first-quiz');
    });

    it('awards first-level and milestone badges when enough levels are cleared', async () => {
      prisma.quizAttempt.count.mockResolvedValue(0);
      prisma.aiQuizAttempt.count.mockResolvedValue(0);
      prisma.levelProgress.count.mockResolvedValue(25);
      prisma.contestParticipation.count.mockResolvedValue(0);
      prisma.contestRating.findUnique.mockResolvedValue(null);

      await service.awardEligibleAchievements('user-1');

      const createCall = prisma.userAchievement.createMany.mock.calls[0][0];
      const awardedIds = createCall.data.map(
        (item: { achievementId: string }) => item.achievementId,
      );

      expect(awardedIds).toEqual(
        expect.arrayContaining([
          'ach-first-level',
          'ach-levels-5',
          'ach-levels-10',
          'ach-levels-25',
        ]),
      );
    });

    it('does not award rating milestones when user skips contest submit', async () => {
      prisma.quizAttempt.count.mockResolvedValue(0);
      prisma.aiQuizAttempt.count.mockResolvedValue(0);
      prisma.levelProgress.count.mockResolvedValue(0);
      prisma.contestParticipation.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);
      prisma.contestRating.findUnique.mockResolvedValue({ rating: 1200 });

      await service.awardEligibleAchievements('user-1');

      const createCall = prisma.userAchievement.createMany.mock.calls[0][0];
      const awardedIds = createCall.data.map(
        (item: { achievementId: string }) => item.achievementId,
      );

      expect(awardedIds).not.toContain('ach-rating-1200');
      expect(awardedIds).not.toContain('ach-rating-1500');
    });

    it('is idempotent via skipDuplicates when awarding badges', async () => {
      prisma.quizAttempt.count.mockResolvedValue(1);
      prisma.aiQuizAttempt.count.mockResolvedValue(0);
      prisma.levelProgress.count.mockResolvedValue(0);
      prisma.contestParticipation.count.mockResolvedValue(0);
      prisma.contestRating.findUnique.mockResolvedValue(null);

      await service.awardEligibleAchievements('user-1');

      expect(prisma.userAchievement.createMany).toHaveBeenCalledWith(
        expect.objectContaining({ skipDuplicates: true }),
      );
    });
  });
});
