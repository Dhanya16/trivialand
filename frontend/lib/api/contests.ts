import type { Contest, PaginatedResponse, Ranking } from "../types";
import { apiGet } from "./fetch";

type ContestStatus = Contest["status"];

export async function fetchContestsByStatus(status?: ContestStatus) {
  return apiGet<Contest[]>("/contests", {
    query: status ? { status } : undefined,
  });
}

export async function fetchRankings(limit = 50, page = 1) {
  const response = await apiGet<PaginatedResponse<Ranking>>("/contests/rankings", {
    query: { limit, page },
  });
  return response.data;
}

export async function fetchRankingsPreview(previewLimit = 5) {
  return fetchRankings(previewLimit + 1, 1);
}
