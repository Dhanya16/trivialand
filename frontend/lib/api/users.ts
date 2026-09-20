import type { UserProfile } from "../types";
import { apiGet } from "./fetch";

export function fetchProfile(token: string, limit = 10) {
  return apiGet<UserProfile>("/users/me/profile", {
    token,
    query: { limit, page: 1 },
  });
}
