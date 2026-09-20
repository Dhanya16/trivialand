import { Test, TestingModule } from '@nestjs/testing';
import { LevelProgressStatus } from '@prisma/client';
import { LevelProgressService } from '../../src/progress/level-progress.service';
import { AchievementsService } from '../../src/progress/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('LevelProgressService', () => {
  let service: LevelProgressService;

  const achievementsService = {
    awardEligibleAchievements: jest.fn(),
  };

  const prisma = {
    level: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    levelProgress: {
      createMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    quizAttempt: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LevelProgressService,
        { provide: PrismaService, useValue: prisma },
        { provide: AchievementsService, useValue: achievementsService },
      ],
    }).compile();

    service = module.get<LevelProgressService>(LevelProgressService);
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });

  describe('unlockLevelOneForUser', () => {
    it('creates unlocked rows for every level 1', async () => {
      prisma.level.findMany.mockResolvedValue([
        { id: 'l1a' },
        { id: 'l1b' },
      ]);
      prisma.levelProgress.createMany.mockResolvedValue({ count: 2 });

      await service.unlockLevelOneForUser('user-1');

      expect(prisma.levelProgress.createMany).toHaveBeenCalledWith({
        data: [
          { userId: 'user-1', levelId: 'l1a', status: LevelProgressStatus.unlocked },
          { userId: 'user-1', levelId: 'l1b', status: LevelProgressStatus.unlocked },
        ],
        skipDuplicates: true,
      });
    });
  });

  describe('handleQuizSubmit', () => {
    const levelId = 'level-1';
    const userId = 'user-1';

    beforeEach(() => {
      prisma.level.findUnique.mockResolvedValue({
        id: levelId,
        order: 1,
        subcategoryId: 'sub-1',
        quizzes: [{ id: 'quiz-1' }],
      });
    });

    it('does not complete level when quiz score is below passing threshold', async () => {
      const result = await service.handleQuizSubmit(userId, levelId, 1, 3);

      expect(result).toEqual({ levelCompleted: false, nextLevelUnlocked: false });
      expect(prisma.levelProgress.upsert).not.toHaveBeenCalled();
      expect(achievementsService.awardEligibleAchievements).toHaveBeenCalledWith(
        userId,
        prisma,
      );
    });

    it('completes level and unlocks next when all quizzes are passed', async () => {
      prisma.levelProgress.findUnique
        .mockResolvedValueOnce({ status: LevelProgressStatus.unlocked })
        .mockResolvedValueOnce(null);
      prisma.quizAttempt.findMany.mockResolvedValue([
        { quizId: 'quiz-1', score: 3, total: 3 },
      ]);
      prisma.level.findFirst.mockResolvedValue({ id: 'level-2' });

      const result = await service.handleQuizSubmit(userId, levelId, 3, 3);

      expect(result).toEqual({ levelCompleted: true, nextLevelUnlocked: true });
      expect(prisma.levelProgress.upsert).toHaveBeenCalledWith({
        where: { userId_levelId: { userId, levelId } },
        create: {
          userId,
          levelId,
          status: LevelProgressStatus.completed,
        },
        update: { status: LevelProgressStatus.completed },
      });
      expect(prisma.levelProgress.upsert).toHaveBeenCalledWith({
        where: { userId_levelId: { userId, levelId: 'level-2' } },
        create: {
          userId,
          levelId: 'level-2',
          status: LevelProgressStatus.unlocked,
        },
        update: { status: LevelProgressStatus.unlocked },
      });
    });

    it('unlocks L2 then L3 in sequence when each level is cleared', async () => {
      prisma.level.findUnique.mockResolvedValue({
        id: 'level-2',
        order: 2,
        subcategoryId: 'sub-1',
        quizzes: [{ id: 'quiz-2' }],
      });
      prisma.levelProgress.findUnique
        .mockResolvedValueOnce({ status: LevelProgressStatus.unlocked })
        .mockResolvedValueOnce(null);
      prisma.quizAttempt.findMany.mockResolvedValue([
        { quizId: 'quiz-2', score: 2, total: 2 },
      ]);
      prisma.level.findFirst.mockResolvedValue({ id: 'level-3' });

      const result = await service.handleQuizSubmit(userId, 'level-2', 2, 2);

      expect(result).toEqual({ levelCompleted: true, nextLevelUnlocked: true });
      expect(prisma.levelProgress.upsert).toHaveBeenCalledWith({
        where: { userId_levelId: { userId, levelId: 'level-3' } },
        create: {
          userId,
          levelId: 'level-3',
          status: LevelProgressStatus.unlocked,
        },
        update: { status: LevelProgressStatus.unlocked },
      });
    });

    it('is idempotent when re-attempting an already completed level', async () => {
      prisma.levelProgress.findUnique.mockResolvedValue({
        status: LevelProgressStatus.completed,
      });

      const result = await service.handleQuizSubmit(userId, levelId, 3, 3);

      expect(result).toEqual({ levelCompleted: true, nextLevelUnlocked: false });
      expect(prisma.levelProgress.upsert).not.toHaveBeenCalled();
      expect(prisma.level.findFirst).not.toHaveBeenCalled();
    });

    it('does not unlock next level when not all quizzes in the level are passed', async () => {
      prisma.level.findUnique.mockResolvedValue({
        id: levelId,
        order: 1,
        subcategoryId: 'sub-1',
        quizzes: [{ id: 'quiz-1' }, { id: 'quiz-2' }],
      });
      prisma.levelProgress.findUnique.mockResolvedValue({
        status: LevelProgressStatus.unlocked,
      });
      prisma.quizAttempt.findMany.mockResolvedValue([
        { quizId: 'quiz-1', score: 3, total: 3 },
        { quizId: 'quiz-2', score: 1, total: 3 },
      ]);

      const result = await service.handleQuizSubmit(userId, levelId, 3, 3);

      expect(result).toEqual({ levelCompleted: false, nextLevelUnlocked: false });
      expect(prisma.levelProgress.upsert).not.toHaveBeenCalled();
      expect(prisma.level.findFirst).not.toHaveBeenCalled();
    });
  });
});
