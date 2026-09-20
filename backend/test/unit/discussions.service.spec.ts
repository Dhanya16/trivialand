import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { DiscussionsService } from '../../src/discussions/discussions.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('DiscussionsService', () => {
  let service: DiscussionsService;

  const prisma = {
    discussion: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    discussionReply: {
      create: jest.fn(),
    },
    question: { findUnique: jest.fn() },
    quiz: { findUnique: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscussionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DiscussionsService>(DiscussionsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns discussions with reply counts', async () => {
      prisma.discussion.findMany.mockResolvedValue([
        {
          id: 'd1',
          title: 'Thread',
          topic: 'Physics',
          createdAt: new Date('2026-08-15T10:00:00.000Z'),
          author: { username: 'learner42' },
          _count: { replies: 2 },
        },
      ]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id: 'd1',
          title: 'Thread',
          topic: 'Physics',
          author: 'learner42',
          replyCount: 2,
          createdAt: new Date('2026-08-15T10:00:00.000Z'),
        },
      ]);
    });
  });

  describe('findById', () => {
    it('returns thread with flat replies', async () => {
      prisma.discussion.findUnique.mockResolvedValue({
        id: 'd1',
        title: 'Thread',
        topic: 'Physics',
        createdAt: new Date('2026-08-15T10:00:00.000Z'),
        linkedQuestionId: null,
        linkedQuizId: null,
        author: { username: 'learner42' },
        replies: [
          {
            id: 'r1',
            content: 'Helpful tip',
            createdAt: new Date('2026-08-15T11:00:00.000Z'),
            author: { username: 'brainiac' },
          },
        ],
      });

      const result = await service.findById('d1');

      expect(result.replyCount).toBe(1);
      expect(result.replies[0].author).toBe('brainiac');
    });

    it('throws when discussion is missing', async () => {
      prisma.discussion.findUnique.mockResolvedValue(null);

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a thread with optional quiz link', async () => {
      prisma.quiz.findUnique.mockResolvedValue({ id: 'quiz-1' });
      prisma.discussion.create.mockResolvedValue({
        id: 'd-new',
        title: 'New thread',
        topic: 'Science',
        createdAt: new Date('2026-09-01T10:00:00.000Z'),
        author: { username: 'new_user' },
      });

      const result = await service.create('user-1', {
        title: 'New thread',
        topic: 'Science',
        linkedQuizId: 'quiz-1',
      });

      expect(result.replyCount).toBe(0);
      expect(prisma.discussion.create).toHaveBeenCalledWith({
        data: {
          title: 'New thread',
          topic: 'Science',
          authorId: 'user-1',
          linkedQuestionId: null,
          linkedQuizId: 'quiz-1',
        },
        select: expect.any(Object),
      });
    });

    it('rejects linking both a question and a quiz', async () => {
      await expect(
        service.create('user-1', {
          title: 'New thread',
          topic: 'Science',
          linkedQuestionId: 'q1',
          linkedQuizId: 'quiz-1',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addReply', () => {
    it('creates a reply for an existing thread', async () => {
      prisma.discussion.findUnique.mockResolvedValue({ id: 'd1' });
      prisma.discussionReply.create.mockResolvedValue({
        id: 'r-new',
        content: 'My reply',
        createdAt: new Date('2026-09-01T11:00:00.000Z'),
        author: { username: 'new_user' },
      });

      const result = await service.addReply('d1', 'user-1', {
        content: 'My reply',
      });

      expect(result.content).toBe('My reply');
      expect(prisma.discussionReply.create).toHaveBeenCalled();
    });

    it('throws when thread is missing', async () => {
      prisma.discussion.findUnique.mockResolvedValue(null);

      await expect(
        service.addReply('missing', 'user-1', { content: 'Reply' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
