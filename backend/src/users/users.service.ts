import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { UserBasicProfile } from './types/user-basic-profile.type';
import { LevelProgressStatus } from '@prisma/client';
import type { UserProgressResponse } from './types/user-progress.type';
import type { QuizHistoryQueryDto } from './dto/quiz-history-query.dto';
import type { PaginatedQuizHistoryResponse } from './types/quiz-history.type';
import type { PaginatedContestHistoryResponse } from './types/contest-history.type';
import type { UserContestRatingResponse } from './types/contest-rating.type';
import type { UserAchievementsResponse } from './types/user-achievements.type';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserBasicProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async getMeProgress(userId: string): Promise<UserProgressResponse> {
    const progress = await this.prisma.levelProgress.findMany({
      where: {
        userId,
        status: LevelProgressStatus.completed,
      },
      include: {
        level: {
          include: {
            subcategory: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  
    const levels = progress.map((item) => ({
      levelId: item.level.id,
      levelName: item.level.name,
      levelOrder: item.level.order,
      subcategorySlug: item.level.subcategory.slug,
      subcategoryName: item.level.subcategory.name,
      categorySlug: item.level.subcategory.category.slug,
      categoryName: item.level.subcategory.category.name,
      clearedAt: item.updatedAt,
    }));
  
    return {
      levelsCleared: levels.length,
      levels,
    };
  }
  async getMeQuizHistory(
    userId: string,
    query: QuizHistoryQueryDto,
  ): Promise<PaginatedQuizHistoryResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
  
    const where = { userId };
  
    const [attempts, total] = await Promise.all([
      this.prisma.quizAttempt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { completedAt: 'desc' },
        select: {
          id: true,
          quizId: true,
          score: true,
          total: true,
          type: true,
          completedAt: true,
          quiz: {
            select: {
              title: true,
            },
          },
        },
      }),
      this.prisma.quizAttempt.count({ where }),
    ]);
  
    const data = attempts.map((attempt) => ({
      id: attempt.id,
      quizId: attempt.quizId,
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      total: attempt.total,
      type: attempt.type,
      completedAt: attempt.completedAt,
    }));
  
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }
  async getMeContestHistory(
    userId: string,
    query: QuizHistoryQueryDto,
  ): Promise<PaginatedContestHistoryResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
  
    const where = {
      userId,
      submittedAt: { not: null },
    };
  
    const [participations, total] = await Promise.all([
      this.prisma.contestParticipation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          contestId: true,
          score: true,
          ratingChange: true,
          submittedAt: true,
          contest: {
            select: {
              title: true,
            },
          },
        },
      }),
      this.prisma.contestParticipation.count({ where }),
    ]);
  
    const data = participations.map((item) => ({
      id: item.id,
      contestId: item.contestId,
      contestTitle: item.contest.title,
      score: item.score ?? 0,
      ratingChange: item.ratingChange,
      participatedAt: item.submittedAt as Date,
    }));
  
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }
  async getMeContestRating(userId: string): Promise<UserContestRatingResponse> {
    const record = await this.prisma.contestRating.findUnique({
      where: { userId },
      select: {
        rating: true,
        updatedAt: true,
      },
    });
    return {
      rating: record?.rating ?? 1200,
      updatedAt: record?.updatedAt ?? null,
    };
  }
  async getMeAchievements(userId: string): Promise<UserAchievementsResponse> {
    const earned = await this.prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' },
      select: {
        earnedAt: true,
        achievement: {
          select: {
            slug: true,
            name: true,
            description: true,
          },
        },
      },
    });
    return {
      achievements: earned.map((item) => ({
        slug: item.achievement.slug,
        name: item.achievement.name,
        description: item.achievement.description,
        earnedAt: item.earnedAt,
      })),
    };
  }
}