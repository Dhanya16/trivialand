export type ContestHistoryItem = {
    id: string;
    contestId: string;
    contestTitle: string;
    score: number;
    ratingChange: number | null;
    participatedAt: Date;
  };
  
  export type PaginatedContestHistoryResponse = {
    data: ContestHistoryItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };