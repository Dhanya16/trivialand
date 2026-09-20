import { cookies } from "next/headers";
import { apiGet } from "./fetch";

export async function getServerToken() {
  const cookieStore = await cookies();
  return cookieStore.get("trivialand_token")?.value ?? null;
}

export async function serverGet<T>(path: string, token?: string | null) {
  const authToken = token ?? (await getServerToken());
  return apiGet<T>(path, { token: authToken });
}
