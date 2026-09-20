const TOKEN_KEY = "trivialand_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `trivialand_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = "trivialand_token=; path=/; max-age=0";
}
