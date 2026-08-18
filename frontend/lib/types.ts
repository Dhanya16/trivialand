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

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
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
