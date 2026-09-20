import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../src/auth/auth.service';
import { ContestRatingService } from '../../src/contests/contest-rating.service';
import { LevelProgressService } from '../../src/progress/level-progress.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QuizzesService } from '../../src/quizzes/quizzes.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('API security guards', () => {
  describe('auth responses', () => {
    it('never returns passwordHash from login', async () => {
      const prisma = {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'user-1',
            email: 'user@example.com',
            username: 'user',
            passwordHash: 'hashed-secret',
            createdAt: new Date(),
          }),
        },
      };
      const jwtService = { signAsync: jest.fn().mockResolvedValue('token') };
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: PrismaService, useValue: prisma },
          { provide: JwtService, useValue: jwtService },
          {
            provide: LevelProgressService,
            useValue: { unlockLevelOneForUser: jest.fn() },
          },
          {
            provide: ContestRatingService,
            useValue: { initializeForUser: jest.fn() },
          },
        ],
      }).compile();

      const service = module.get<AuthService>(AuthService);
      const result = await service.login({
        email: 'user@example.com',
        password: 'Password1',
      });

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(JSON.stringify(result)).not.toContain('hashed-secret');
    });
  });

  describe('quiz question responses', () => {
    it('does not expose isCorrect before submit', async () => {
      const prisma = {
        quiz: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'quiz-1',
            title: 'Quiz',
            levelId: 'level-1',
            level: {
              subcategory: { slug: 'physics', category: { slug: 'science' } },
            },
            questions: [
              {
                id: 'q1',
                text: 'Question',
                order: 1,
                options: [
                  { id: 'o1', text: 'A', isCorrect: true },
                  { id: 'o2', text: 'B', isCorrect: false },
                ],
              },
            ],
          }),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          QuizzesService,
          { provide: PrismaService, useValue: prisma },
          {
            provide: LevelProgressService,
            useValue: { handleQuizSubmit: jest.fn() },
          },
        ],
      }).compile();

      const service = module.get<QuizzesService>(QuizzesService);
      const questions = await service.findQuestions('quiz-1');

      expect(questions[0].options[0]).not.toHaveProperty('isCorrect');
    });
  });
});
