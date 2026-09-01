import type { QuizAttemptType } from '@prisma/client';

export type QuizHistoryItem = {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  type: QuizAttemptType;
  completedAt: Date;
};

export type PaginatedQuizHistoryResponse = {
  data: QuizHistoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};