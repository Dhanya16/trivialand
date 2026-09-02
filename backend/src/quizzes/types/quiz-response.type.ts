export type QuizMetadataResponse = {
    id: string;
    title: string;
    levelId: string;
    categorySlug: string;
    subcategorySlug: string;
    questionCount: number;
  };
  
  export type QuizOptionResponse = {
    id: string;
    text: string;
  };
  
  export type QuizQuestionResponse = {
    id: string;
    text: string;
    order: number;
    options: QuizOptionResponse[];
  };
  
  export type StartAttemptResponse = {
    attemptId: string;
    quizId: string;
    total: number;
    startedAt: Date;
  };
  
  export type GradedOptionResponse = {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  
  export type GradedQuestionResponse = {
    id: string;
    text: string;
    explanation: string | null;
    options: GradedOptionResponse[];
    selectedOptionId: string;
    isCorrect: boolean;
  };
  
  export type SubmitQuizResponse = {
    attemptId: string;
    score: number;
    total: number;
    percentage: number;
    questions: GradedQuestionResponse[];
  };