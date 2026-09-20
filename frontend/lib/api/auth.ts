import { apiPost } from "./fetch";

type AuthUser = {
  id: string;
  email: string;
  username: string;
  createdAt: string;
};

type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export function login(email: string, password: string) {
  return apiPost<LoginResponse>("/auth/login", { email, password });
}

export function register(email: string, username: string, password: string) {
  return apiPost<RegisterResponse>("/auth/register", {
    email,
    username,
    password,
  });
}
