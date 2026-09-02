import { gradeQuizSubmission } from '../../src/quizzes/quiz-scoring.util';

describe('gradeQuizSubmission', () => {
  const questions = [
    {
      id: 'q1',
      text: 'Q1',
      explanation: 'Because A',
      options: [
        { id: 'o1', text: 'A', isCorrect: true },
        { id: 'o2', text: 'B', isCorrect: false },
      ],
    },
    {
      id: 'q2',
      text: 'Q2',
      explanation: null,
      options: [
        { id: 'o3', text: 'C', isCorrect: false },
        { id: 'o4', text: 'D', isCorrect: true },
      ],
    },
  ];

  it('calculates score and percentage', () => {
    const result = gradeQuizSubmission(questions, [
      { questionId: 'q1', selectedOptionId: 'o1' },
      { questionId: 'q2', selectedOptionId: 'o3' },
    ]);

    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(50);
    expect(result.questions[0].isCorrect).toBe(true);
    expect(result.questions[1].isCorrect).toBe(false);
  });
});