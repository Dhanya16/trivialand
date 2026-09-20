import { Injectable } from '@nestjs/common';
import type { AiProvider } from './ai-provider.interface';
import type { GeneratedQuestion } from '../types/generated-question.type';

@Injectable()
export class MockAiProvider implements AiProvider {
  async generateQuestions(
    materialText: string,
    title: string,
  ): Promise<GeneratedQuestion[]> {
    const lines = materialText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 20);

    const snippets =
      lines.length > 0
        ? lines.slice(0, 3)
        : [
            `Key concepts from ${title}`,
            `Important details from ${title}`,
            `Summary points from ${title}`,
          ];

    return snippets.map((snippet, index) => ({
      text: `According to your material, which statement best matches: "${snippet.slice(0, 80)}"?`,
      explanation: 'Generated from your uploaded study material.',
      options: [
        { text: snippet.slice(0, 60), isCorrect: true },
        { text: 'An unrelated concept from another topic', isCorrect: false },
        { text: 'A contradictory statement', isCorrect: false },
        { text: 'None of the above', isCorrect: false },
      ].slice(0, index === 0 ? 4 : 3),
    }));
  }
}
