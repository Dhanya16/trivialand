export function buildQuizGenerationPrompt(
  materialText: string,
  title: string,
  questionCount = 5,
): string {
  return `You are a quiz generator. Create ${questionCount} multiple-choice questions from the study material below.

Quiz title: ${title}

Return JSON in this exact shape:
{
  "questions": [
    {
      "text": "question text",
      "explanation": "short explanation",
      "options": [
        { "text": "option A", "isCorrect": false },
        { "text": "option B", "isCorrect": true }
      ]
    }
  ]
}

Rules:
- Each question must have 3 or 4 options.
- Exactly one option per question must have isCorrect: true.
- Questions must be grounded in the material.

Study material:
${materialText.slice(0, 12000)}`;
}
