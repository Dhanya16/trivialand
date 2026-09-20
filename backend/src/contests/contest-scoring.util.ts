type ContestQuestionForGrading = {
  question: {
    id: string;
    text: string;
    explanation: string | null;
    options: Array<{ id: string; text: string; isCorrect: boolean }>;
  };
  points: number;
  order: number;
};

type Submission = {
  questionId: string;
  selectedOptionId: string;
};

export function gradeContestSubmission(
  questions: ContestQuestionForGrading[],
  submissions: Submission[],
) {
  const submissionByQuestion = new Map(
    submissions.map((item) => [item.questionId, item.selectedOptionId]),
  );

  let score = 0;
  let maxScore = 0;

  const gradedQuestions = questions.map((contestQuestion) => {
    const question = contestQuestion.question;
    maxScore += contestQuestion.points;

    const selectedOptionId = submissionByQuestion.get(question.id);
    const selectedOption = question.options.find(
      (option) => option.id === selectedOptionId,
    );
    const isCorrect = selectedOption?.isCorrect ?? false;

    if (isCorrect) {
      score += contestQuestion.points;
    }

    return {
      id: question.id,
      text: question.text,
      explanation: question.explanation,
      points: contestQuestion.points,
      order: contestQuestion.order,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
      selectedOptionId: selectedOptionId ?? '',
      isCorrect,
    };
  });

  const percentage =
    maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);

  return { score, maxScore, percentage, questions: gradedQuestions };
}
