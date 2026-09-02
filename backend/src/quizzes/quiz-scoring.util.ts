type QuestionForGrading = {
    id: string;
    text: string;
    explanation: string | null;
    options: Array<{ id: string; text: string; isCorrect: boolean }>;
};

type Submission = {
    questionId: string;
    selectedOptionId: string;
};

export function gradeQuizSubmission(
    questions: QuestionForGrading[],
    submissions: Submission[],
) {
    const submissionByQuestion = new Map(
        submissions.map((item) => [item.questionId, item.selectedOptionId]),
    );

    let score = 0;

    const gradedQuestions = questions.map((question) => {
        const selectedOptionId = submissionByQuestion.get(question.id);
        const selectedOption = question.options.find(
            (option) => option.id === selectedOptionId,
        );
        const isCorrect = selectedOption?.isCorrect ?? false;

        if (isCorrect) {
            score += 1;
        }

        return {
            id: question.id,
            text: question.text,
            explanation: question.explanation,
            options: question.options.map((option) => ({
                id: option.id,
                text: option.text,
                isCorrect: option.isCorrect,
            })),
            selectedOptionId: selectedOptionId ?? '',
            isCorrect,
        };
    });

    const total = questions.length;
    const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

    return { score, total, percentage, questions: gradedQuestions };
}