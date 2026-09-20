import { MockAiProvider } from '../../src/ai-quiz/providers/mock-ai.provider';

describe('MockAiProvider', () => {
  const provider = new MockAiProvider();

  it('generates questions from material text', async () => {
    const questions = await provider.generateQuestions(
      'Newton first law is about inertia.\nNewton second law relates force and acceleration.',
      'Physics Notes',
    );

    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].options.some((option) => option.isCorrect)).toBe(true);
  });
});
