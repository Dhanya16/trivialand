import type { AuthUser } from './auth-user.type';

export type UserProfileStub = {
  levelsCleared: number;
  contestRating: number | null;
  quizHistory: [];
  contestHistory: [];
  achievements: string[];
};

export type MeResponse = {
  user: AuthUser;
  profile: UserProfileStub;
};