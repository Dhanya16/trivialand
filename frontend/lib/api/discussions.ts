import type { Discussion, DiscussionDetail } from "../types";
import { apiGet } from "./fetch";

export async function fetchDiscussions() {
  return apiGet<Discussion[]>("/discussions");
}

export async function fetchDiscussion(id: string) {
  return apiGet<DiscussionDetail>(`/discussions/${id}`);
}
