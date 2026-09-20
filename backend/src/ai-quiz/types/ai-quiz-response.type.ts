import type { AiQuizStatus } from '@prisma/client';

export type UploadMaterialResponse = {
  id: string;
  filename: string;
  mimeType: string;
  createdAt: Date;
};

export type GenerateAiQuizResponse = {
  id: string;
  title: string;
  status: AiQuizStatus;
  materialId: string;
  createdAt: Date;
};

export type AiQuizStatusResponse = {
  id: string;
  status: AiQuizStatus;
};

export type AiQuizQuestionOptionResponse = {
  id: string;
  text: string;
};

export type AiQuizQuestionResponse = {
  id: string;
  text: string;
  order: number;
  options: AiQuizQuestionOptionResponse[];
};

export type AiQuizDetailResponse = {
  id: string;
  title: string;
  status: AiQuizStatus;
  materialId: string;
  createdAt: Date;
  questions: AiQuizQuestionResponse[];
};

export type GradedAiQuizOptionResponse = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type GradedAiQuizQuestionResponse = {
  id: string;
  text: string;
  explanation: string | null;
  options: GradedAiQuizOptionResponse[];
  selectedOptionId: string;
  isCorrect: boolean;
};

export type SubmitAiQuizAttemptResponse = {
  attemptId: string;
  score: number;
  total: number;
  percentage: number;
  questions: GradedAiQuizQuestionResponse[];
};
