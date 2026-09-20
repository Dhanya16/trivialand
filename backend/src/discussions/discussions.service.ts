import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import type {
  DiscussionDetailResponse,
  DiscussionListItem,
  DiscussionReplyItem,
} from './types/discussion-response.type';

@Injectable()
export class DiscussionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DiscussionListItem[]> {
    const discussions = await this.prisma.discussion.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        topic: true,
        createdAt: true,
        author: { select: { username: true } },
        _count: { select: { replies: true } },
      },
    });

    return discussions.map((discussion) => ({
      id: discussion.id,
      title: discussion.title,
      topic: discussion.topic,
      author: discussion.author.username,
      replyCount: discussion._count.replies,
      createdAt: discussion.createdAt,
    }));
  }

  async findById(discussionId: string): Promise<DiscussionDetailResponse> {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      select: {
        id: true,
        title: true,
        topic: true,
        createdAt: true,
        linkedQuestionId: true,
        linkedQuizId: true,
        author: { select: { username: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: { select: { username: true } },
          },
        },
      },
    });

    if (!discussion) {
      throw new NotFoundException(`Discussion "${discussionId}" not found`);
    }

    return {
      id: discussion.id,
      title: discussion.title,
      topic: discussion.topic,
      author: discussion.author.username,
      createdAt: discussion.createdAt,
      replyCount: discussion.replies.length,
      linkedQuestionId: discussion.linkedQuestionId,
      linkedQuizId: discussion.linkedQuizId,
      replies: discussion.replies.map((reply) => this.toReplyItem(reply)),
    };
  }

  async create(
    authorId: string,
    dto: CreateDiscussionDto,
  ): Promise<DiscussionListItem> {
    if (dto.linkedQuestionId && dto.linkedQuizId) {
      throw new BadRequestException(
        'A discussion can link to a question or a quiz, not both',
      );
    }

    if (dto.linkedQuestionId) {
      const question = await this.prisma.question.findUnique({
        where: { id: dto.linkedQuestionId },
        select: { id: true },
      });

      if (!question) {
        throw new NotFoundException(
          `Question "${dto.linkedQuestionId}" not found`,
        );
      }
    }

    if (dto.linkedQuizId) {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: dto.linkedQuizId },
        select: { id: true },
      });

      if (!quiz) {
        throw new NotFoundException(`Quiz "${dto.linkedQuizId}" not found`);
      }
    }

    const discussion = await this.prisma.discussion.create({
      data: {
        title: dto.title,
        topic: dto.topic,
        authorId,
        linkedQuestionId: dto.linkedQuestionId ?? null,
        linkedQuizId: dto.linkedQuizId ?? null,
      },
      select: {
        id: true,
        title: true,
        topic: true,
        createdAt: true,
        author: { select: { username: true } },
      },
    });

    return {
      id: discussion.id,
      title: discussion.title,
      topic: discussion.topic,
      author: discussion.author.username,
      replyCount: 0,
      createdAt: discussion.createdAt,
    };
  }

  async addReply(
    discussionId: string,
    authorId: string,
    dto: CreateReplyDto,
  ): Promise<DiscussionReplyItem> {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { id: true },
    });

    if (!discussion) {
      throw new NotFoundException(`Discussion "${discussionId}" not found`);
    }

    const reply = await this.prisma.discussionReply.create({
      data: {
        discussionId,
        authorId,
        content: dto.content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: { select: { username: true } },
      },
    });

    return this.toReplyItem(reply);
  }

  private toReplyItem(reply: {
    id: string;
    content: string;
    createdAt: Date;
    author: { username: string };
  }): DiscussionReplyItem {
    return {
      id: reply.id,
      author: reply.author.username,
      content: reply.content,
      createdAt: reply.createdAt,
    };
  }
}
