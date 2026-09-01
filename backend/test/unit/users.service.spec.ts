import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LevelProgressStatus } from '@prisma/client';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const prisma = {
    user: { findUnique: jest.fn() },
    levelProgress: { findMany: jest.fn() },
    quizAttempt: { findMany: jest.fn(), count: jest.fn() },
    contestParticipation: { findMany: jest.fn(), count: jest.fn() },
    contestRating: { findUnique: jest.fn() },
    userAchievement: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('returns basic profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        username: 'test',
        email: 'test@example.com',
        createdAt: new Date('2026-01-01'),
      });

      await expect(service.getMe('user-1')).resolves.toEqual({
        username: 'test',
        email: 'test@example.com',
        createdAt: new Date('2026-01-01'),
      });
    });

    it('throws when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getMe('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMeProgress', () => {
    it('returns levels cleared count and list', async () => {
      prisma.levelProgress.findMany.mockResolvedValue([
        {
          updatedAt: new Date('2026-08-01'),
          level: {
            id: 'level-1',
            name: 'Level 1',
            order: 1,
            subcategory: {
              slug: 'physics',
              name: 'Physics',
              category: { slug: 'science', name: 'Science' },
            },
          },
        },
      ]);

      const result = await service.getMeProgress('user-1');

      expect(result.levelsCleared).toBe(1);
      expect(result.levels[0].levelName).toBe('Level 1');
    });
  });

  describe('getMeQuizHistory', () => {
    it('returns paginated quiz attempts', async () => {
      prisma.quizAttempt.findMany.mockResolvedValue([
        {
          id: 'a1',
          quizId: 'q1',
          score: 2,
          total: 3,
          type: 'normal',
          completedAt: new Date('2026-08-14'),
          quiz: { title: 'Mechanics Basics' },
        },
      ]);
      prisma.quizAttempt.count.mockResolvedValue(1);

      const result = await service.getMeQuizHistory('user-1', {
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('getMeContestRating', () => {
    it('defaults to 1200 when no rating row', async () => {
      prisma.contestRating.findUnique.mockResolvedValue(null);

      await expect(service.getMeContestRating('user-1')).resolves.toEqual({
        rating: 1200,
        updatedAt: null,
      });
    });
  });

  describe('getMeAchievements', () => {
    it('maps earned achievements', async () => {
      prisma.userAchievement.findMany.mockResolvedValue([
        {
          earnedAt: new Date('2026-08-01'),
          achievement: {
            slug: 'first-quiz',
            name: 'First quiz completed',
            description: 'Complete your first quiz.',
          },
        },
      ]);

      const result = await service.getMeAchievements('user-1');

      expect(result.achievements[0].slug).toBe('first-quiz');
    });
  });
});
