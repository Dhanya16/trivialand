import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { AiProvider } from './ai-provider.interface';
import { buildQuizGenerationPrompt } from './ai-prompt.util';
import type { GeneratedQuestion } from '../types/generated-question.type';

@Injectable()
export class OpenAiAiProvider implements AiProvider {
  async generateQuestions(
    materialText: string,
    title: string,
  ): Promise<GeneratedQuestion[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('OPENAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You generate quiz questions. Respond with valid JSON only.',
          },
          {
            role: 'user',
            content: buildQuizGenerationPrompt(materialText, title),
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new InternalServerErrorException(
        `OpenAI request failed with status ${response.status}`,
      );
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new InternalServerErrorException('OpenAI returned an empty response');
    }

    const parsed = JSON.parse(content) as { questions?: GeneratedQuestion[] };
    const questions = parsed.questions ?? [];

    if (questions.length === 0) {
      throw new InternalServerErrorException(
        'OpenAI returned no quiz questions',
      );
    }

    return questions.map((question) => ({
      text: question.text,
      explanation: question.explanation,
      options: question.options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      })),
    }));
  }
}
