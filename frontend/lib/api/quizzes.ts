import type {
  QuizMetadata,
  QuizQuestion,
  StartAttemptResponse,
  SubmitQuizResponse,
} from "../types";
import { apiGet, apiPost } from "./fetch";

export async function fetchQuiz(quizId: string) {
  return apiGet<QuizMetadata>(`/quizzes/${quizId}`);
}

export async function fetchQuizQuestions(quizId: string) {
  return apiGet<QuizQuestion[]>(`/quizzes/${quizId}/questions`);
}

export function startQuizAttempt(quizId: string, token: string) {
  return apiPost<StartAttemptResponse>(`/quizzes/${quizId}/attempts`, undefined, {
    token,
  });
}

export function submitQuizAttempt(
  quizId: string,
  attemptId: string,
  answers: { questionId: string; selectedOptionId: string }[],
  token: string,
) {
  return apiPost<SubmitQuizResponse>(
    `/quizzes/${quizId}/attempts/${attemptId}/submit`,
    { answers },
    { token },
  );
}
