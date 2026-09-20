import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AiQuizStatus } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';
import { AchievementsService } from '../progress/achievements.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitQuizDto } from '../quizzes/dto/submit-quiz.dto';
import { AiGenerationService } from './ai-generation.service';
import { ALLOWED_MIME_TYPES, UPLOAD_DIR } from './ai-quiz.constants';
import { gradeAiQuizSubmission } from './ai-quiz-scoring.util';
import { GenerateAiQuizDto } from './dto/generate-ai-quiz.dto';
import type {
  AiQuizDetailResponse,
  AiQuizStatusResponse,
  GenerateAiQuizResponse,
  SubmitAiQuizAttemptResponse,
  UploadMaterialResponse,
} from './types/ai-quiz-response.type';

@Injectable()
export class AiQuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiGenerationService: AiGenerationService,
    private readonly achievementsService: AchievementsService,
  ) {}

  async uploadMaterial(
    userId: string,
    file: Express.Multer.File,
  ): Promise<UploadMaterialResponse> {
    const mimeType = this.resolveMimeType(file);

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      throw new BadRequestException(
        'Unsupported file type. Allowed: PDF, plain text, JPEG, PNG, WebP',
      );
    }

    const userUploadDir = join(UPLOAD_DIR, userId);
    await fs.mkdir(userUploadDir, { recursive: true });

    const safeName = file.originalname.replace(/[^\w.\-() ]+/g, '_');
    const storagePath = join(userUploadDir, `${Date.now()}-${safeName}`);
    await fs.writeFile(storagePath, file.buffer);

    const material = await this.prisma.uploadedMaterial.create({
      data: {
        userId,
        filename: file.originalname,
        mimeType,
        storagePath,
      },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        createdAt: true,
      },
    });

    return material;
  }

  async generate(
    userId: string,
    dto: GenerateAiQuizDto,
  ): Promise<GenerateAiQuizResponse> {
    const material = await this.prisma.uploadedMaterial.findFirst({
      where: { id: dto.materialId, userId },
    });

    if (!material) {
      throw new NotFoundException(`Material "${dto.materialId}" not found`);
    }

    const title = dto.title ?? `Quiz from ${material.filename}`;

    const aiQuiz = await this.prisma.aiQuiz.create({
      data: {
        userId,
        materialId: material.id,
        title,
        status: AiQuizStatus.processing,
      },
      select: {
        id: true,
        title: true,
        status: true,
        materialId: true,
        createdAt: true,
      },
    });

    void this.processGeneration(aiQuiz.id).catch((error) => {
      console.error(`AI quiz generation failed for ${aiQuiz.id}:`, error);
    });

    return aiQuiz;
  }

  async getStatus(
    aiQuizId: string,
    userId: string,
  ): Promise<AiQuizStatusResponse> {
    const aiQuiz = await this.getOwnedQuizOrThrow(aiQuizId, userId);

    return {
      id: aiQuiz.id,
      status: aiQuiz.status,
    };
  }

  async findById(
    aiQuizId: string,
    userId: string,
  ): Promise<AiQuizDetailResponse> {
    const aiQuiz = await this.prisma.aiQuiz.findFirst({
      where: { id: aiQuizId, userId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: true },
        },
      },
    });

    if (!aiQuiz) {
      throw new NotFoundException(`AI quiz "${aiQuizId}" not found`);
    }

    if (aiQuiz.status !== AiQuizStatus.ready) {
      throw new BadRequestException('AI quiz is not ready yet');
    }

    return {
      id: aiQuiz.id,
      title: aiQuiz.title,
      status: aiQuiz.status,
      materialId: aiQuiz.materialId,
      createdAt: aiQuiz.createdAt,
      questions: aiQuiz.questions.map((question) => ({
        id: question.id,
        text: question.text,
        order: question.order,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
      })),
    };
  }

  async submitAttempt(
    aiQuizId: string,
    userId: string,
    dto: SubmitQuizDto,
  ): Promise<SubmitAiQuizAttemptResponse> {
    const aiQuiz = await this.prisma.aiQuiz.findFirst({
      where: { id: aiQuizId, userId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: { options: true },
        },
      },
    });

    if (!aiQuiz) {
      throw new NotFoundException(`AI quiz "${aiQuizId}" not found`);
    }

    if (aiQuiz.status !== AiQuizStatus.ready) {
      throw new BadRequestException('AI quiz is not ready yet');
    }

    if (aiQuiz.questions.length === 0) {
      throw new BadRequestException('This AI quiz has no questions');
    }

    if (dto.answers.length !== aiQuiz.questions.length) {
      throw new BadRequestException('All questions must be answered');
    }

    const questionIds = new Set(aiQuiz.questions.map((question) => question.id));
    for (const answer of dto.answers) {
      if (!questionIds.has(answer.questionId)) {
        throw new BadRequestException('Invalid question in submission');
      }

      const question = aiQuiz.questions.find(
        (item) => item.id === answer.questionId,
      )!;
      const optionBelongs = question.options.some(
        (option) => option.id === answer.selectedOptionId,
      );

      if (!optionBelongs) {
        throw new BadRequestException('Invalid option for question');
      }
    }

    const { score, total, percentage, questions } = gradeAiQuizSubmission(
      aiQuiz.questions,
      dto.answers,
    );

    const attempt = await this.prisma.$transaction(async (tx) => {
      const createdAttempt = await tx.aiQuizAttempt.create({
        data: {
          userId,
          aiQuizId,
          score,
          total,
        },
      });

      await this.achievementsService.awardEligibleAchievements(userId, tx);

      return createdAttempt;
    });

    return {
      attemptId: attempt.id,
      score,
      total,
      percentage,
      questions,
    };
  }

  private async processGeneration(aiQuizId: string): Promise<void> {
    const aiQuiz = await this.prisma.aiQuiz.findUnique({
      where: { id: aiQuizId },
      include: { material: true },
    });

    if (!aiQuiz) {
      return;
    }

    try {
      const materialText = await this.readMaterialContent(aiQuiz.material);
      const generatedQuestions = await this.aiGenerationService.generateQuestions(
        materialText,
        aiQuiz.title,
      );

      await this.prisma.$transaction(async (tx) => {
        for (const [index, question] of generatedQuestions.entries()) {
          await tx.aiQuestion.create({
            data: {
              aiQuizId,
              text: question.text,
              explanation: question.explanation ?? null,
              order: index + 1,
              options: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              },
            },
          });
        }

        await tx.aiQuiz.update({
          where: { id: aiQuizId },
          data: { status: AiQuizStatus.ready },
        });
      });
    } catch {
      await this.prisma.aiQuiz.update({
        where: { id: aiQuizId },
        data: { status: AiQuizStatus.failed },
      });
    }
  }

  private resolveMimeType(file: Express.Multer.File): string {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return file.mimetype;
    }

    const lowerName = file.originalname.toLowerCase();
    if (lowerName.endsWith('.txt')) {
      return 'text/plain';
    }
    if (lowerName.endsWith('.pdf')) {
      return 'application/pdf';
    }
    if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
      return 'image/jpeg';
    }
    if (lowerName.endsWith('.png')) {
      return 'image/png';
    }
    if (lowerName.endsWith('.webp')) {
      return 'image/webp';
    }

    return file.mimetype;
  }

  private async readMaterialContent(material: {
    storagePath: string;
    mimeType: string;
    filename: string;
  }): Promise<string> {
    const buffer = await fs.readFile(material.storagePath);

    if (material.mimeType === 'text/plain') {
      return buffer.toString('utf8');
    }

    if (material.mimeType === 'application/pdf') {
      return `PDF study material uploaded as ${material.filename}. Summarize and quiz its key concepts.`;
    }

    if (material.mimeType.startsWith('image/')) {
      return `Image study material uploaded as ${material.filename}. Extract and quiz its visible notes.`;
    }

    return buffer.toString('utf8');
  }

  private async getOwnedQuizOrThrow(aiQuizId: string, userId: string) {
    const aiQuiz = await this.prisma.aiQuiz.findFirst({
      where: { id: aiQuizId, userId },
      select: { id: true, status: true },
    });

    if (!aiQuiz) {
      throw new NotFoundException(`AI quiz "${aiQuizId}" not found`);
    }

    return aiQuiz;
  }
}
