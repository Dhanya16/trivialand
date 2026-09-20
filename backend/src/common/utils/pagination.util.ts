import type { PaginatedResponse, PaginationMeta } from '../types/api-response.type';

export type PaginationInput = {
  page?: number;
  limit?: number;
};

export type ParsedPagination = {
  page: number;
  limit: number;
  skip: number;
};

export function parsePagination(
  query: PaginationInput,
  maxLimit = 50,
): ParsedPagination {
  const page = query.page ?? 1;
  const limit = Math.min(query.limit ?? 10, maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
  nextCursor?: string | null,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    nextCursor: nextCursor ?? null,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  nextCursor?: string | null,
): PaginatedResponse<T> {
  return {
    data,
    meta: buildPaginationMeta(page, limit, total, nextCursor),
  };
}

export function parseCursorPagination(query: {
  limit?: number;
  cursor?: string;
}) {
  const limit = Math.min(query.limit ?? 10, 50);
  return {
    limit,
    cursor: query.cursor ?? null,
  };
}
