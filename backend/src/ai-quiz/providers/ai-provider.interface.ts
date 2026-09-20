import type { GeneratedQuestion } from '../types/generated-question.type';

export interface AiProvider {
  generateQuestions(
    materialText: string,
    title: string,
  ): Promise<GeneratedQuestion[]>;
}
