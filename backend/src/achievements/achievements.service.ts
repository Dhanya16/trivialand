import { Injectable } from '@nestjs/common';
import {
  LevelProgressStatus,
  Prisma,
  QuizAttemptStatus,
} from '@prisma/client';
import { DEFAULT_RATING } from '../contests/contest-rating.util';
import { PrismaService } from '../prisma/prisma.service';
import { resolveEligibleAchievementSlugs } from './achievement-slugs.constants';
import type { AchievementDefinitionsResponse } from './types/achievement-definition.type';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllDefinitions(): Promise<AchievementDefinitionsResponse> {
    const achievements = await this.prisma.achievement.findMany({
      orderBy: { name: 'asc' },
      select: {
        slug: true,
        name: true,
        description: true,
        criteria: true,
      },
    });

    return { achievements };
  }

  async awardEligibleAchievements(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    const [
      quizAttempts,
      aiQuizAttempts,
      levelsCleared,
      contestParticipations,
      submittedContests,
      ratingRow,
    ] = await Promise.all([
      client.quizAttempt.count({
        where: { userId, status: QuizAttemptStatus.completed },
      }),
      client.aiQuizAttempt.count({ where: { userId } }),
      client.levelProgress.count({
        where: { userId, status: LevelProgressStatus.completed },
      }),
      client.contestParticipation.count({ where: { userId } }),
      client.contestParticipation.count({
        where: { userId, submittedAt: { not: null } },
      }),
      client.contestRating.findUnique({ where: { userId } }),
    ]);

    const slugs = resolveEligibleAchievementSlugs({
      quizAttempts,
      aiQuizAttempts,
      levelsCleared,
      contestParticipations,
      submittedContests,
      rating: ratingRow?.rating ?? DEFAULT_RATING,
    });

    if (slugs.length === 0) {
      return;
    }

    const achievements = await client.achievement.findMany({
      where: { slug: { in: slugs } },
      select: { id: true },
    });

    if (achievements.length === 0) {
      return;
    }

    await client.userAchievement.createMany({
      data: achievements.map((achievement) => ({
        userId,
        achievementId: achievement.id,
      })),
      skipDuplicates: true,
    });
  }
}
