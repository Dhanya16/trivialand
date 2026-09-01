export type ClearedLevelItem = {
    levelId: string;
    levelName: string;
    levelOrder: number;
    subcategorySlug: string;
    subcategoryName: string;
    categorySlug: string;
    categoryName: string;
    clearedAt: Date;
  };
  
  export type UserProgressResponse = {
    levelsCleared: number;
    levels: ClearedLevelItem[];
  };