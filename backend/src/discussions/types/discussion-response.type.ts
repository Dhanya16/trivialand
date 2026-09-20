export type DiscussionListItem = {
  id: string;
  title: string;
  author: string;
  replyCount: number;
  createdAt: Date;
  topic: string;
};

export type DiscussionReplyItem = {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
};

export type DiscussionDetailResponse = {
  id: string;
  title: string;
  topic: string;
  author: string;
  createdAt: Date;
  replyCount: number;
  linkedQuestionId: string | null;
  linkedQuizId: string | null;
  replies: DiscussionReplyItem[];
};
