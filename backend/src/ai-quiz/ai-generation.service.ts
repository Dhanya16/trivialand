import { Injectable } from '@nestjs/common';
import type { AiProvider } from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock-ai.provider';
import { OpenAiAiProvider } from './providers/openai-ai.provider';
import type { GeneratedQuestion } from './types/generated-question.type';

@Injectable()
export class AiGenerationService {
  constructor(
    private readonly mockAiProvider: MockAiProvider,
    private readonly openAiAiProvider: OpenAiAiProvider,
  ) {}

  async generateQuestions(
    materialText: string,
    title: string,
  ): Promise<GeneratedQuestion[]> {
    return this.getProvider().generateQuestions(materialText, title);
  }

  private getProvider(): AiProvider {
    const provider = process.env.AI_PROVIDER ?? 'mock';
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      return this.openAiAiProvider;
    }

    return this.mockAiProvider;
  }
}
