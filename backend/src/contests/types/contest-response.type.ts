import type { ContestStatus } from '@prisma/client';

export type ContestListItem = {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  durationMinutes: number;
  status: ContestStatus;
};

export type ContestParticipationSummary = {
  participationId: string;
  startedAt: Date;
  submittedAt: Date | null;
  score: number | null;
};

export type ContestDetailResponse = ContestListItem & {
  questionCount: number;
  participation: ContestParticipationSummary | null;
};

export type JoinContestResponse = {
  participationId: string;
  contestId: string;
  startedAt: Date;
  expiresAt: Date;
};

export type ContestQuestionOptionResponse = {
  id: string;
  text: string;
};

export type ContestQuestionResponse = {
  id: string;
  text: string;
  order: number;
  points: number;
  options: ContestQuestionOptionResponse[];
};

export type GradedContestOptionResponse = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type GradedContestQuestionResponse = {
  id: string;
  text: string;
  explanation: string | null;
  points: number;
  order: number;
  options: GradedContestOptionResponse[];
  selectedOptionId: string;
  isCorrect: boolean;
};

export type SubmitContestResponse = {
  participationId: string;
  score: number;
  maxScore: number;
  percentage: number;
  ratingChange: number;
  newRating: number;
  questions: GradedContestQuestionResponse[];
};

export type ContestStandingItem = {
  rank: number;
  username: string;
  score: number;
  ratingChange: number | null;
  submittedAt: Date;
};

export type GlobalRankingItem = {
  rank: number;
  username: string;
  rating: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
