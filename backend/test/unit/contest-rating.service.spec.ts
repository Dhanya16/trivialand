import { Test, TestingModule } from '@nestjs/testing';
import { ContestRatingService } from '../../src/contests/contest-rating.service';
import { DEFAULT_RATING } from '../../src/contests/contest-rating.util';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('ContestRatingService', () => {
  let service: ContestRatingService;

  const prisma = {
    contestRating: {
      createMany: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    contestParticipation: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContestRatingService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ContestRatingService>(ContestRatingService);
    jest.clearAllMocks();
  });

  describe('initializeForUser', () => {
    it('creates a default rating row for new users', async () => {
      prisma.contestRating.createMany.mockResolvedValue({ count: 1 });

      await service.initializeForUser('user-1');

      expect(prisma.contestRating.createMany).toHaveBeenCalledWith({
        data: [{ userId: 'user-1', rating: DEFAULT_RATING }],
        skipDuplicates: true,
      });
    });
  });

  describe('getRatingForUser', () => {
    it('returns stored rating when present', async () => {
      prisma.contestRating.findUnique.mockResolvedValue({ rating: 1310 });

      await expect(service.getRatingForUser('user-1')).resolves.toBe(1310);
    });

    it('falls back to default rating when row is missing', async () => {
      prisma.contestRating.findUnique.mockResolvedValue(null);

      await expect(service.getRatingForUser('user-1')).resolves.toBe(
        DEFAULT_RATING,
      );
    });
  });

  describe('applyRatingAfterSubmit', () => {
    it('updates rating and returns the change after a contest submit', async () => {
      prisma.contestParticipation.findMany.mockResolvedValue([
        { userId: 'user-2' },
      ]);
      prisma.contestRating.findMany.mockResolvedValue([{ rating: 1200 }]);
      prisma.contestRating.findUnique.mockResolvedValue({ rating: 1200 });
      prisma.contestRating.upsert.mockResolvedValue({});

      const result = await service.applyRatingAfterSubmit(
        'user-1',
        'c2',
        3,
        3,
        prisma as never,
      );

      expect(result.ratingChange).toBeGreaterThan(0);
      expect(result.newRating).toBe(1200 + result.ratingChange);
      expect(prisma.contestRating.upsert).toHaveBeenCalled();
    });
  });
});
