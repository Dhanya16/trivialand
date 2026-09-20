export type GeneratedQuestionOption = {
  text: string;
  isCorrect: boolean;
};

export type GeneratedQuestion = {
  text: string;
  explanation?: string;
  options: GeneratedQuestionOption[];
};
