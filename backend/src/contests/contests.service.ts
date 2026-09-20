import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContestStatus } from '@prisma/client';
import { AchievementsService } from '../progress/achievements.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitQuizDto } from '../quizzes/dto/submit-quiz.dto';
import {
  calculateContestRatingChange,
  DEFAULT_RATING,
} from './contest-rating.util';
import { gradeContestSubmission } from './contest-scoring.util';
import {
  deriveContestStatus,
  getContestEndTime,
  isContestExpired,
} from './contest-status.util';
import { ListContestsQueryDto } from './dto/list-contests-query.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import type {
  ContestDetailResponse,
  ContestListItem,
  ContestQuestionResponse,
  ContestStandingItem,
  GlobalRankingItem,
  JoinContestResponse,
  PaginatedResponse,
  SubmitContestResponse,
} from './types/contest-response.type';

@Injectable()
export class ContestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async findAll(query: ListContestsQueryDto): Promise<ContestListItem[]> {
    const contests = await this.prisma.contest.findMany({
      orderBy: { startTime: 'asc' },
    });

    const mapped = contests.map((contest) => this.toContestListItem(contest));

    if (!query.status) {
      return mapped;
    }

    return mapped.filter((contest) => contest.status === query.status);
  }

  async findById(
    contestId: string,
    userId?: string,
  ): Promise<ContestDetailResponse> {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        questions: { select: { id: true } },
        participations: userId
          ? {
              where: { userId },
              select: {
                id: true,
                startedAt: true,
                submittedAt: true,
                score: true,
              },
            }
          : false,
      },
    });

    if (!contest) {
      throw new NotFoundException(`Contest "${contestId}" not found`);
    }

    const participation = userId && contest.participations?.[0]
      ? {
          participationId: contest.participations[0].id,
          startedAt: contest.participations[0].startedAt,
          submittedAt: contest.participations[0].submittedAt,
          score: contest.participations[0].score,
        }
      : null;

    return {
      ...this.toContestListItem(contest),
      questionCount: contest.questions.length,
      participation,
    };
  }

  async getRankings(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<GlobalRankingItem>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      this.prisma.contestRating.findMany({
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
        select: {
          rating: true,
          user: { select: { username: true } },
        },
      }),
      this.prisma.contestRating.count(),
    ]);

    const data = ratings.map((item, index) => ({
      rank: skip + index + 1,
      username: item.user.username,
      rating: item.rating,
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

  async join(contestId: string, userId: string): Promise<JoinContestResponse> {
    const contest = await this.getContestOrThrow(contestId);
    const status = deriveContestStatus(contest);

    if (status !== ContestStatus.live) {
      throw new ForbiddenException('Contest is not live');
    }

    const existing = await this.prisma.contestParticipation.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });

    if (existing) {
      if (existing.submittedAt) {
        throw new ConflictException('You have already submitted this contest');
      }

      return {
        participationId: existing.id,
        contestId,
        startedAt: existing.startedAt,
        expiresAt: getContestEndTime(contest.startTime, contest.durationMinutes),
      };
    }

    const participation = await this.prisma.contestParticipation.create({
      data: { userId, contestId },
    });

    await this.achievementsService.awardEligibleAchievements(userId);

    return {
      participationId: participation.id,
      contestId,
      startedAt: participation.startedAt,
      expiresAt: getContestEndTime(contest.startTime, contest.durationMinutes),
    };
  }

  async findQuestions(
    contestId: string,
    userId: string,
  ): Promise<ContestQuestionResponse[]> {
    const contest = await this.getContestOrThrow(contestId);
    const status = deriveContestStatus(contest);

    if (status !== ContestStatus.live) {
      throw new ForbiddenException('Contest questions are only available while live');
    }

    const participation = await this.prisma.contestParticipation.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });

    if (!participation) {
      throw new ForbiddenException('Join the contest before viewing questions');
    }

    if (participation.submittedAt) {
      throw new BadRequestException('You have already submitted this contest');
    }

    const contestQuestions = await this.prisma.contestQuestion.findMany({
      where: { contestId },
      orderBy: { order: 'asc' },
      include: {
        question: {
          include: { options: true },
        },
      },
    });

    return contestQuestions.map((item) => ({
      id: item.question.id,
      text: item.question.text,
      order: item.order,
      points: item.points,
      options: item.question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
    }));
  }

  async submit(
    contestId: string,
    userId: string,
    dto: SubmitQuizDto,
  ): Promise<SubmitContestResponse> {
    const contest = await this.getContestOrThrow(contestId);

    if (isContestExpired(contest)) {
      throw new BadRequestException('Contest time has expired');
    }

    const participation = await this.prisma.contestParticipation.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });

    if (!participation) {
      throw new ForbiddenException('Join the contest before submitting');
    }

    if (participation.submittedAt) {
      throw new BadRequestException('You have already submitted this contest');
    }

    const contestQuestions = await this.prisma.contestQuestion.findMany({
      where: { contestId },
      orderBy: { order: 'asc' },
      include: {
        question: {
          include: { options: true },
        },
      },
    });

    if (contestQuestions.length === 0) {
      throw new BadRequestException('This contest has no questions');
    }

    if (dto.answers.length !== contestQuestions.length) {
      throw new BadRequestException('All questions must be answered');
    }

    const questionIds = new Set(
      contestQuestions.map((item) => item.question.id),
    );

    for (const answer of dto.answers) {
      if (!questionIds.has(answer.questionId)) {
        throw new BadRequestException('Invalid question in submission');
      }

      const contestQuestion = contestQuestions.find(
        (item) => item.question.id === answer.questionId,
      )!;

      const optionBelongs = contestQuestion.question.options.some(
        (option) => option.id === answer.selectedOptionId,
      );

      if (!optionBelongs) {
        throw new BadRequestException('Invalid option for question');
      }
    }

    const { score, maxScore, percentage, questions } = gradeContestSubmission(
      contestQuestions.map((item) => ({
        question: item.question,
        points: item.points,
        order: item.order,
      })),
      dto.answers,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.contestAnswer.createMany({
        data: dto.answers.map((answer) => {
          const contestQuestion = contestQuestions.find(
            (item) => item.question.id === answer.questionId,
          )!;
          const selected = contestQuestion.question.options.find(
            (option) => option.id === answer.selectedOptionId,
          )!;

          return {
            participationId: participation.id,
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOptionId,
            isCorrect: selected.isCorrect,
          };
        }),
      });

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

      const currentRating = await tx.contestRating.findUnique({
        where: { userId },
      });
      const userRating = currentRating?.rating ?? DEFAULT_RATING;

      const ratingChange = calculateContestRatingChange(
        userRating,
        score,
        maxScore,
        opponentRatings.map((item) => item.rating),
      );
      const newRating = userRating + ratingChange;

      await tx.contestParticipation.update({
        where: { id: participation.id },
        data: {
          score,
          submittedAt: new Date(),
          ratingChange,
        },
      });

      await tx.contestRating.upsert({
        where: { userId },
        create: { userId, rating: newRating },
        update: { rating: newRating },
      });

      await this.achievementsService.awardEligibleAchievements(userId, tx);

      return {
        participationId: participation.id,
        score,
        maxScore,
        percentage,
        ratingChange,
        newRating,
        questions,
      };
    });

    return result;
  }

  async getStandings(
    contestId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponse<ContestStandingItem>> {
    await this.getContestOrThrow(contestId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      contestId,
      submittedAt: { not: null },
    };

    const [participations, total] = await Promise.all([
      this.prisma.contestParticipation.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ score: 'desc' }, { submittedAt: 'asc' }],
        select: {
          score: true,
          ratingChange: true,
          submittedAt: true,
          user: { select: { username: true } },
        },
      }),
      this.prisma.contestParticipation.count({ where }),
    ]);

    const data = participations.map((item, index) => ({
      rank: skip + index + 1,
      username: item.user.username,
      score: item.score ?? 0,
      ratingChange: item.ratingChange,
      submittedAt: item.submittedAt as Date,
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

  private async getContestOrThrow(contestId: string) {
    const contest = await this.prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      throw new NotFoundException(`Contest "${contestId}" not found`);
    }

    return contest;
  }

  private toContestListItem(contest: {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    durationMinutes: number;
  }): ContestListItem {
    return {
      id: contest.id,
      title: contest.title,
      description: contest.description,
      startTime: contest.startTime,
      durationMinutes: contest.durationMinutes,
      status: deriveContestStatus(contest),
    };
  }
}
