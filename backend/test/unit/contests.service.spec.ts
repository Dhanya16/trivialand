import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ContestStatus } from '@prisma/client';
import { ContestRatingService } from '../../src/contests/contest-rating.service';
import { ContestsService } from '../../src/contests/contests.service';
import { AchievementsService } from '../../src/progress/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ContestsService', () => {
  let service: ContestsService;

  const achievementsService = {
    awardEligibleAchievements: jest.fn(),
  };

  const contestRatingService = {
    applyRatingAfterSubmit: jest.fn(),
  };

  const prisma = {
    contest: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    contestParticipation: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    contestQuestion: {
      findMany: jest.fn(),
    },
    contestAnswer: {
      createMany: jest.fn(),
    },
    contestRating: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const liveContest = {
    id: 'c2',
    title: 'Friday Night Trivia',
    description: 'Mixed topics',
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    durationMinutes: 90,
    status: ContestStatus.live,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestsService,
        { provide: PrismaService, useValue: prisma },
        { provide: AchievementsService, useValue: achievementsService },
        { provide: ContestRatingService, useValue: contestRatingService },
      ],
    }).compile();

    service = module.get<ContestsService>(ContestsService);
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });

  describe('findAll', () => {
    it('filters contests by derived status', async () => {
      const now = Date.now();
      prisma.contest.findMany.mockResolvedValue([
        {
          id: 'upcoming',
          title: 'Upcoming',
          description: 'Soon',
          startTime: new Date(now + 60 * 60 * 1000),
          durationMinutes: 60,
        },
        {
          id: 'live',
          title: 'Live',
          description: 'Now',
          startTime: new Date(now - 10 * 60 * 1000),
          durationMinutes: 90,
        },
      ]);

      const result = await service.findAll({ status: ContestStatus.live });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('live');
      expect(result[0].status).toBe(ContestStatus.live);
    });
  });

  describe('join', () => {
    it('rejects joining a non-live contest', async () => {
      prisma.contest.findUnique.mockResolvedValue({
        ...liveContest,
        startTime: new Date(Date.now() + 60 * 60 * 1000),
      });

      await expect(service.join('c1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('creates participation for a live contest', async () => {
      prisma.contest.findUnique.mockResolvedValue(liveContest);
      prisma.contestParticipation.findUnique.mockResolvedValue(null);
      prisma.contestParticipation.create.mockResolvedValue({
        id: 'part-1',
        startedAt: new Date(),
      });

      const result = await service.join('c2', 'user-1');

      expect(result.participationId).toBe('part-1');
      expect(achievementsService.awardEligibleAchievements).toHaveBeenCalledWith(
        'user-1',
      );
      expect(contestRatingService.applyRatingAfterSubmit).not.toHaveBeenCalled();
    });

    it('rejects joining after submission', async () => {
      prisma.contest.findUnique.mockResolvedValue(liveContest);
      prisma.contestParticipation.findUnique.mockResolvedValue({
        id: 'part-1',
        submittedAt: new Date(),
      });

      await expect(service.join('c2', 'user-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('submit', () => {
    const participation = {
      id: 'part-1',
      userId: 'user-1',
      contestId: 'c2',
      submittedAt: null,
    };

    const contestQuestions = [
      {
        order: 1,
        points: 1,
        question: {
          id: 'q1',
          text: 'Question 1',
          explanation: null,
          options: [
            { id: 'o1', text: 'A', isCorrect: true },
            { id: 'o2', text: 'B', isCorrect: false },
          ],
        },
      },
    ];

    beforeEach(() => {
      prisma.contest.findUnique.mockResolvedValue(liveContest);
      prisma.contestParticipation.findUnique.mockResolvedValue(participation);
      prisma.contestQuestion.findMany.mockResolvedValue(contestQuestions);
      prisma.contestAnswer.createMany.mockResolvedValue({ count: 1 });
      prisma.contestParticipation.update.mockResolvedValue({});
      contestRatingService.applyRatingAfterSubmit.mockResolvedValue({
        ratingChange: 8,
        newRating: 1208,
      });
    });

    it('rejects submit after contest expiry', async () => {
      prisma.contest.findUnique.mockResolvedValue({
        ...liveContest,
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
        durationMinutes: 30,
      });

      await expect(
        service.submit('c2', 'user-1', {
          answers: [{ questionId: 'q1', selectedOptionId: 'o1' }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects submit without joining', async () => {
      prisma.contestParticipation.findUnique.mockResolvedValue(null);

      await expect(
        service.submit('c2', 'user-1', {
          answers: [{ questionId: 'q1', selectedOptionId: 'o1' }],
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('finalizes score and rating on valid submit', async () => {
      const result = await service.submit('c2', 'user-1', {
        answers: [{ questionId: 'q1', selectedOptionId: 'o1' }],
      });

      expect(result.score).toBe(1);
      expect(result.maxScore).toBe(1);
      expect(result.ratingChange).toBe(8);
      expect(result.newRating).toBe(1208);
      expect(prisma.contestParticipation.update).toHaveBeenCalled();
      expect(contestRatingService.applyRatingAfterSubmit).toHaveBeenCalled();
    });
  });

  describe('getStandings', () => {
    it('throws when contest is missing', async () => {
      prisma.contest.findUnique.mockResolvedValue(null);

      await expect(
        service.getStandings('missing', { page: 1, limit: 10 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
