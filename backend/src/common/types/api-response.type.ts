export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextCursor?: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type DataResponse<T> = {
  data: T;
};

export type ListResponse<T> = {
  data: T[];
};
