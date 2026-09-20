export type LevelStatus = "locked" | "unlocked" | "completed";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Subcategory = {
  slug: string;
  name: string;
  categorySlug: string;
};

export type Level = {
  id: string;
  name: string;
  categorySlug: string;
  subcategorySlug: string;
  status: LevelStatus;
};

export type Quiz = {
  id: string;
  title: string;
  levelId: string;
  categorySlug: string;
  subcategorySlug: string;
};

export type QuizMetadata = Quiz & {
  questionCount: number;
};

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  order: number;
  options: QuizOption[];
};

export type StartAttemptResponse = {
  attemptId: string;
  quizId: string;
  total: number;
  startedAt: string;
};

export type GradedOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type GradedQuestion = {
  id: string;
  text: string;
  explanation: string | null;
  options: GradedOption[];
  selectedOptionId: string;
  isCorrect: boolean;
};

export type SubmitQuizResponse = {
  attemptId: string;
  score: number;
  total: number;
  percentage: number;
  questions: GradedQuestion[];
};

export type Contest = {
  id: string;
  title: string;
  description: string;
  startTime: string;
  durationMinutes: number;
  status: "upcoming" | "live" | "past";
};

export type Ranking = {
  rank: number;
  username: string;
  rating: number;
};

export type Discussion = {
  id: string;
  title: string;
  author: string;
  replyCount: number;
  createdAt: string;
  topic: string;
};

export type DiscussionReply = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type DiscussionDetail = Discussion & {
  linkedQuestionId: string | null;
  linkedQuizId: string | null;
  replies: DiscussionReply[];
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type QuizHistoryItem = {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  type: "normal" | "ai";
  completedAt: string;
};

export type ContestHistoryItem = {
  id: string;
  contestId: string;
  contestTitle: string;
  score: number;
  ratingChange: number | null;
  participatedAt: string;
};

export type Achievement = {
  slug: string;
  name: string;
  description: string;
  earnedAt: string;
};

export type UserProfile = {
  user: {
    username: string;
    email: string;
    createdAt: string;
  };
  levelsCleared: number;
  contestRating: number;
  quizHistory: PaginatedResponse<QuizHistoryItem>;
  contestHistory: PaginatedResponse<ContestHistoryItem>;
  achievements: Achievement[];
};
