import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { LevelProgressStatus, QuizAttemptStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { gradeQuizSubmission } from './quiz-scoring.util';
// ... import response types

@Injectable()
export class QuizzesService {
    constructor(private readonly prisma: PrismaService) { }

    async findById(quizId: string) { /* 11.1 */ }
    async findQuestions(quizId: string) { /* 11.2 */ }
    async startAttempt(quizId: string, userId: string) { /* 11.3, 11.8 */ }
    async submitAttempt(
        quizId: string,
        attemptId: string,
        userId: string,
        dto: SubmitQuizDto,
    ) { /* 11.4–11.7 */ }

    private async getQuizWithContext(quizId: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                level: {
                    include: {
                        subcategory: { include: { category: true } },
                    },
                },
                questions: {
                    orderBy: { order: 'asc' },
                    include: { options: true },
                },
            },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz "${quizId}" not found`);
        }

        return quiz;
    }

    private async assertLevelUnlocked(userId: string, levelId: string) {
        const level = await this.prisma.level.findUnique({
            where: { id: levelId },
            include: {
                subcategory: {
                    include: {
                        levels: { orderBy: { order: 'asc' }, select: { id: true, order: true } },
                    },
                },
            },
        });

        if (!level) {
            throw new NotFoundException('Level not found');
        }

        const progressRows = await this.prisma.levelProgress.findMany({
            where: {
                userId,
                levelId: { in: level.subcategory.levels.map((item) => item.id) },
            },
        });

        const progressByLevelId = new Map(
            progressRows.map((row) => [row.levelId, row.status]),
        );

        let previousCompleted = false;

        for (const item of level.subcategory.levels) {
            const stored = progressByLevelId.get(item.id);
            const status = stored
                ? stored
                : item.order === 1
                    ? LevelProgressStatus.unlocked
                    : previousCompleted
                        ? LevelProgressStatus.unlocked
                        : LevelProgressStatus.locked;

            if (item.id === levelId) {
                if (status === LevelProgressStatus.locked) {
                    throw new ForbiddenException('This level is locked');
                }
                return;
            }

            previousCompleted = status === LevelProgressStatus.completed;
        }
    }
    async findQuestions(quizId: string): Promise<QuizQuestionResponse[]> {
        const quiz = await this.getQuizWithContext(quizId);

        return quiz.questions.map((question) => ({
            id: question.id,
            text: question.text,
            order: question.order,
            options: question.options.map((option) => ({
                id: option.id,
                text: option.text,
            })),
        }));
    }
    async startAttempt(quizId: string, userId: string): Promise<StartAttemptResponse> {
        const quiz = await this.getQuizWithContext(quizId);

        if (quiz.questions.length === 0) {
            throw new BadRequestException('This quiz has no questions');
        }

        await this.assertLevelUnlocked(userId, quiz.levelId);

        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                quizId,
                total: quiz.questions.length,
                status: QuizAttemptStatus.in_progress,
                type: 'normal',
            },
        });

        return {
            attemptId: attempt.id,
            quizId: attempt.quizId,
            total: attempt.total,
            startedAt: attempt.startedAt,
        };
    }
    async submitAttempt(
        quizId: string,
        attemptId: string,
        userId: string,
        dto: SubmitQuizDto,
    ): Promise<SubmitQuizResponse> {
        const quiz = await this.getQuizWithContext(quizId);

        const attempt = await this.prisma.quizAttempt.findFirst({
            where: { id: attemptId, quizId, userId },
        });

        if (!attempt) {
            throw new NotFoundException('Attempt not found');
        }

        if (attempt.status !== QuizAttemptStatus.in_progress) {
            throw new BadRequestException('This attempt has already been submitted');
        }

        if (dto.answers.length !== quiz.questions.length) {
            throw new BadRequestException('All questions must be answered');
        }

        const questionIds = new Set(quiz.questions.map((q) => q.id));
        for (const answer of dto.answers) {
            if (!questionIds.has(answer.questionId)) {
                throw new BadRequestException('Invalid question in submission');
            }

            const question = quiz.questions.find((q) => q.id === answer.questionId)!;
            const optionBelongs = question.options.some(
                (o) => o.id === answer.selectedOptionId,
            );

            if (!optionBelongs) {
                throw new BadRequestException('Invalid option for question');
            }
        }

        const { score, total, percentage, questions } = gradeQuizSubmission(
            quiz.questions,
            dto.answers,
        );

        await this.prisma.$transaction(async (tx) => {
            await tx.quizAttempt.update({
                where: { id: attemptId },
                data: {
                    score,
                    total,
                    status: QuizAttemptStatus.completed,
                    completedAt: new Date(),
                },
            });

            await tx.quizAnswer.createMany({
                data: dto.answers.map((answer) => {
                    const question = quiz.questions.find((q) => q.id === answer.questionId)!;
                    const selected = question.options.find(
                        (o) => o.id === answer.selectedOptionId,
                    )!;

                    return {
                        attemptId,
                        questionId: answer.questionId,
                        selectedOptionId: answer.selectedOptionId,
                        isCorrect: selected.isCorrect,
                    };
                }),
            });
        });

        return {
            attemptId,
            score,
            total,
            percentage,
            questions,
        };
    }
}