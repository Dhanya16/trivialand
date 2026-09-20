import { promises as fs } from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AiQuizStatus } from '@prisma/client';
import { AiQuizService } from '../../src/ai-quiz/ai-quiz.service';
import { AiGenerationService } from '../../src/ai-quiz/ai-generation.service';
import { AchievementsService } from '../../src/progress/achievements.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('AiQuizService', () => {
  let service: AiQuizService;

  const aiGenerationService = {
    generateQuestions: jest.fn(),
  };

  const achievementsService = {
    awardEligibleAchievements: jest.fn(),
  };

  const prisma = {
    uploadedMaterial: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    aiQuiz: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    aiQuestion: {
      create: jest.fn(),
    },
    aiQuizAttempt: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
    jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
    jest.spyOn(fs, 'readFile').mockResolvedValue(
      Buffer.from('Newton laws describe motion.'),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiQuizService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiGenerationService, useValue: aiGenerationService },
        { provide: AchievementsService, useValue: achievementsService },
      ],
    }).compile();

    service = module.get<AiQuizService>(AiQuizService);
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((callback) => callback(prisma));
  });

  describe('uploadMaterial', () => {
    it('rejects unsupported file types', async () => {
      await expect(
        service.uploadMaterial('user-1', {
          originalname: 'notes.doc',
          mimetype: 'application/msword',
          buffer: Buffer.from('data'),
        } as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });

    it('stores uploaded text material', async () => {
      prisma.uploadedMaterial.create.mockResolvedValue({
        id: 'mat-1',
        filename: 'notes.txt',
        mimeType: 'text/plain',
        createdAt: new Date('2026-09-01'),
      });

      const result = await service.uploadMaterial('user-1', {
        originalname: 'notes.txt',
        mimetype: 'text/plain',
        buffer: Buffer.from('Newton laws describe motion.'),
      } as Express.Multer.File);

      expect(result.id).toBe('mat-1');
      expect(prisma.uploadedMaterial.create).toHaveBeenCalled();
    });
  });

  describe('generate', () => {
    it('creates a processing quiz for owned material', async () => {
      prisma.uploadedMaterial.findFirst.mockResolvedValue({
        id: 'mat-1',
        filename: 'notes.txt',
      });
      prisma.aiQuiz.create.mockResolvedValue({
        id: 'ai-1',
        title: 'Quiz from notes.txt',
        status: AiQuizStatus.processing,
        materialId: 'mat-1',
        createdAt: new Date('2026-09-01'),
      });
      prisma.aiQuiz.findUnique.mockResolvedValue(null);

      const result = await service.generate('user-1', { materialId: 'mat-1' });

      expect(result.status).toBe(AiQuizStatus.processing);
    });

    it('throws when material is missing', async () => {
      prisma.uploadedMaterial.findFirst.mockResolvedValue(null);

      await expect(
        service.generate('user-1', { materialId: 'missing' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitAttempt', () => {
    it('saves an AI attempt without touching level progression', async () => {
      prisma.aiQuiz.findFirst.mockResolvedValue({
        id: 'ai-1',
        status: AiQuizStatus.ready,
        questions: [
          {
            id: 'q1',
            text: 'Question',
            explanation: null,
            order: 1,
            options: [
              { id: 'o1', text: 'A', isCorrect: true },
              { id: 'o2', text: 'B', isCorrect: false },
            ],
          },
        ],
      });
      prisma.aiQuizAttempt.create.mockResolvedValue({ id: 'attempt-1' });

      const result = await service.submitAttempt('ai-1', 'user-1', {
        answers: [{ questionId: 'q1', selectedOptionId: 'o1' }],
      });

      expect(result.score).toBe(1);
      expect(prisma.aiQuizAttempt.create).toHaveBeenCalled();
      expect(achievementsService.awardEligibleAchievements).toHaveBeenCalledWith(
        'user-1',
        prisma,
      );
    });
  });
});
