export type UserAchievementItem = {
    slug: string;
    name: string;
    description: string;
    earnedAt: Date;
  };
  
  export type UserAchievementsResponse = {
    achievements: UserAchievementItem[];
  };