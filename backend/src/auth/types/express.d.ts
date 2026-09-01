import type { AuthUser } from '../auth/types/auth-user.type';

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}

export {};