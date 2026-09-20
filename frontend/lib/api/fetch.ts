import { API_BASE_URL } from "../config";
import { ApiError, parseApiError } from "./errors";

type FetchOptions = RequestInit & {
  token?: string | null;
  query?: Record<string, string | number | undefined>;
};

function buildUrl(path: string, query?: FetchOptions["query"]) {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  { token, query, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(
  path: string,
  options?: Omit<FetchOptions, "method" | "body">,
) {
  return apiFetch<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Omit<FetchOptions, "method" | "body">,
) {
  return apiFetch<T>(path, {
    ...options,
    method: "POST",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
}

export function isNotFoundError(error: unknown) {
  return error instanceof ApiError && error.statusCode === 404;
}
