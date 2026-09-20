import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  calculateContestRatingChange,
  DEFAULT_RATING,
} from './contest-rating.util';

export type RatingUpdateResult = {
  ratingChange: number;
  newRating: number;
};

@Injectable()
export class ContestRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeForUser(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.contestRating.createMany({
      data: [{ userId, rating: DEFAULT_RATING }],
      skipDuplicates: true,
    });
  }

  async getRatingForUser(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prisma;
    const record = await client.contestRating.findUnique({
      where: { userId },
      select: { rating: true },
    });

    return record?.rating ?? DEFAULT_RATING;
  }

  async applyRatingAfterSubmit(
    userId: string,
    contestId: string,
    score: number,
    maxScore: number,
    tx: Prisma.TransactionClient,
  ): Promise<RatingUpdateResult> {
    const otherParticipations = await tx.contestParticipation.findMany({
      where: {
        contestId,
        submittedAt: { not: null },
        userId: { not: userId },
      },
      select: { userId: true },
    });

    const opponentUserIds = otherParticipations.map((item) => item.userId);
    const opponentRatings =
      opponentUserIds.length > 0
        ? await tx.contestRating.findMany({
            where: { userId: { in: opponentUserIds } },
            select: { rating: true },
          })
        : [];

    const userRating = await this.getRatingForUser(userId, tx);
    const ratingChange = calculateContestRatingChange(
      userRating,
      score,
      maxScore,
      opponentRatings.map((item) => item.rating),
    );
    const newRating = userRating + ratingChange;

    await tx.contestRating.upsert({
      where: { userId },
      create: { userId, rating: newRating },
      update: { rating: newRating },
    });

    return { ratingChange, newRating };
  }
}
