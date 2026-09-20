import { Injectable } from '@nestjs/common';
import {
  LevelProgressStatus,
  Prisma,
  QuizAttemptStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async awardEligibleAchievements(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    const [quizAttempts, levelsCleared, contestParticipations, ratingRow] =
      await Promise.all([
        client.quizAttempt.count({
          where: { userId, status: QuizAttemptStatus.completed },
        }),
        client.levelProgress.count({
          where: { userId, status: LevelProgressStatus.completed },
        }),
        client.contestParticipation.count({ where: { userId } }),
        client.contestRating.findUnique({ where: { userId } }),
      ]);

    const rating = ratingRow?.rating ?? 1200;

    const slugs: string[] = [];
    if (quizAttempts >= 1) slugs.push('first-quiz');
    if (levelsCleared >= 1) slugs.push('first-level');
    if (contestParticipations >= 1) slugs.push('first-contest');
    if (levelsCleared >= 5) slugs.push('levels-5');
    if (levelsCleared >= 10) slugs.push('levels-10');
    if (rating >= 1200) slugs.push('rating-1200');
    if (rating >= 1500) slugs.push('rating-1500');

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
