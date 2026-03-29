import type { User, UserRole } from './user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: User;
  tokens: TokenPair;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
}
