import { Test, TestingModule } from '@nestjs/testing';
import { LevelProgressStatus } from '@prisma/client';
import { ContestRatingService } from '../../src/contests/contest-rating.service';
import { LevelProgressService } from '../../src/progress/level-progress.service';
import { AchievementsService } from '../../src/achievements/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Contest rating separation from quiz progress', () => {
  it('level progress unlock does not create contest rating rows', async () => {
    const prisma = {
      level: { findMany: jest.fn().mockResolvedValue([{ id: 'l1' }]) },
      levelProgress: { createMany: jest.fn().mockResolvedValue({ count: 1 }) },
      contestRating: { createMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelProgressService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: AchievementsService,
          useValue: { awardEligibleAchievements: jest.fn() },
        },
      ],
    }).compile();

    const service = module.get<LevelProgressService>(LevelProgressService);
    await service.unlockLevelOneForUser('user-1');

    expect(prisma.contestRating.createMany).not.toHaveBeenCalled();
    expect(prisma.levelProgress.createMany).toHaveBeenCalledWith({
      data: [
        {
          userId: 'user-1',
          levelId: 'l1',
          status: LevelProgressStatus.unlocked,
        },
      ],
      skipDuplicates: true,
    });
  });

  it('contest rating initialization does not create level progress rows', async () => {
    const prisma = {
      contestRating: {
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      levelProgress: { createMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestRatingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    const service = module.get<ContestRatingService>(ContestRatingService);
    await service.initializeForUser('user-1');

    expect(prisma.levelProgress.createMany).not.toHaveBeenCalled();
    expect(prisma.contestRating.createMany).toHaveBeenCalled();
  });
});
