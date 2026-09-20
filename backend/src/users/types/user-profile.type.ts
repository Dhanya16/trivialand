import type { PaginatedContestHistoryResponse } from './contest-history.type';
import type { PaginatedQuizHistoryResponse } from './quiz-history.type';
import type { UserAchievementsResponse } from './user-achievements.type';
import type { UserBasicProfile } from './user-basic-profile.type';

export type UserProfileResponse = {
  user: UserBasicProfile;
  levelsCleared: number;
  contestRating: number;
  quizHistory: PaginatedQuizHistoryResponse;
  contestHistory: PaginatedContestHistoryResponse;
  achievements: UserAchievementsResponse['achievements'];
};
