import { Injectable } from '@nestjs/common';
import {
  LevelProgressStatus,
  Prisma,
  QuizAttemptStatus,
  QuizAttemptType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from './achievements.service';
import { isPassingScore } from './level-progress.constants';

export type LevelProgressResult = {
  levelCompleted: boolean;
  nextLevelUnlocked: boolean;
};

@Injectable()
export class LevelProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async unlockLevelOneForUser(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    const levelOnes = await client.level.findMany({
      where: { order: 1 },
      select: { id: true },
    });

    if (levelOnes.length === 0) {
      return;
    }

    await client.levelProgress.createMany({
      data: levelOnes.map((level) => ({
        userId,
        levelId: level.id,
        status: LevelProgressStatus.unlocked,
      })),
      skipDuplicates: true,
    });
  }

  /**
   * After a quiz is submitted, evaluate level completion and unlock the next level.
   * Idempotent when the level is already completed or the quiz did not pass.
   */
  async handleQuizSubmit(
    userId: string,
    levelId: string,
    score: number,
    total: number,
    tx?: Prisma.TransactionClient,
  ): Promise<LevelProgressResult> {
    const run = async (
      transaction: Prisma.TransactionClient,
    ): Promise<LevelProgressResult> => {
      await this.achievementsService.awardEligibleAchievements(
        userId,
        transaction,
      );

      if (!isPassingScore(score, total)) {
        return { levelCompleted: false, nextLevelUnlocked: false };
      }

      const existingProgress = await transaction.levelProgress.findUnique({
        where: { userId_levelId: { userId, levelId } },
      });

      if (existingProgress?.status === LevelProgressStatus.completed) {
        return { levelCompleted: true, nextLevelUnlocked: false };
      }

      const level = await transaction.level.findUnique({
        where: { id: levelId },
        include: { quizzes: { select: { id: true } } },
      });

      if (!level || level.quizzes.length === 0) {
        return { levelCompleted: false, nextLevelUnlocked: false };
      }

      const quizIds = level.quizzes.map((quiz) => quiz.id);
      const attempts = await transaction.quizAttempt.findMany({
        where: {
          userId,
          quizId: { in: quizIds },
          status: QuizAttemptStatus.completed,
          type: QuizAttemptType.normal,
        },
        select: { quizId: true, score: true, total: true },
      });

      const passedQuizIds = new Set<string>();
      for (const attempt of attempts) {
        if (isPassingScore(attempt.score, attempt.total)) {
          passedQuizIds.add(attempt.quizId);
        }
      }

      const allQuizzesPassed = quizIds.every((quizId) =>
        passedQuizIds.has(quizId),
      );

      if (!allQuizzesPassed) {
        return { levelCompleted: false, nextLevelUnlocked: false };
      }

      await transaction.levelProgress.upsert({
        where: { userId_levelId: { userId, levelId } },
        create: {
          userId,
          levelId,
          status: LevelProgressStatus.completed,
        },
        update: {
          status: LevelProgressStatus.completed,
        },
      });

      const nextLevelUnlocked = await this.unlockNextLevel(
        userId,
        level.subcategoryId,
        level.order,
        transaction,
      );

      await this.achievementsService.awardEligibleAchievements(
        userId,
        transaction,
      );

      return { levelCompleted: true, nextLevelUnlocked };
    };

    if (tx) {
      return run(tx);
    }

    return this.prisma.$transaction(run);
  }

  private async unlockNextLevel(
    userId: string,
    subcategoryId: string,
    currentOrder: number,
    tx: Prisma.TransactionClient,
  ): Promise<boolean> {
    const nextLevel = await tx.level.findFirst({
      where: { subcategoryId, order: currentOrder + 1 },
      select: { id: true },
    });

    if (!nextLevel) {
      return false;
    }

    const existing = await tx.levelProgress.findUnique({
      where: { userId_levelId: { userId, levelId: nextLevel.id } },
    });

    if (existing?.status === LevelProgressStatus.completed) {
      return false;
    }

    await tx.levelProgress.upsert({
      where: { userId_levelId: { userId, levelId: nextLevel.id } },
      create: {
        userId,
        levelId: nextLevel.id,
        status: LevelProgressStatus.unlocked,
      },
      update: {
        status: LevelProgressStatus.unlocked,
      },
    });

    return true;
  }
}
