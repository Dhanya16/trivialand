import { Test, TestingModule } from '@nestjs/testing';
import { AchievementsService } from '../../src/progress/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AchievementsService', () => {
  let service: AchievementsService;

  const prisma = {
    quizAttempt: { count: jest.fn() },
    aiQuizAttempt: { count: jest.fn() },
    levelProgress: { count: jest.fn() },
    contestParticipation: { count: jest.fn() },
    contestRating: { findUnique: jest.fn() },
    achievement: { findMany: jest.fn() },
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
    prisma.achievement.findMany.mockImplementation(({ where }) =>
      Promise.resolve(
        where.slug.in.map((slug: string) => ({ id: `ach-${slug}`, slug })),
      ),
    );
    prisma.userAchievement.createMany.mockResolvedValue({ count: 1 });
  });

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

  it('awards rating milestones after a submitted contest', async () => {
    prisma.quizAttempt.count.mockResolvedValue(0);
    prisma.aiQuizAttempt.count.mockResolvedValue(0);
    prisma.levelProgress.count.mockResolvedValue(0);
    prisma.contestParticipation.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1);
    prisma.contestRating.findUnique.mockResolvedValue({ rating: 1520 });

    await service.awardEligibleAchievements('user-1');

    const createCall = prisma.userAchievement.createMany.mock.calls[0][0];
    const awardedIds = createCall.data.map(
      (item: { achievementId: string }) => item.achievementId,
    );

    expect(awardedIds).toContain('ach-rating-1200');
    expect(awardedIds).toContain('ach-rating-1500');
  });
});
