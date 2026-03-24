import { Request } from "express";

// ============ Entity Types ============

export interface User {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: "checking" | "savings" | "credit";
  balance: number;
  currency: string;
  account_number: string;
  created_at: Date;
}

export interface Transaction {
  id: number;
  account_id: number;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string | null;
  created_at: Date;
}

// ============ Auth Types ============

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

// ============ API Response Types ============

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ============ Pagination Types ============

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ============ Request DTOs ============

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface CreateTransactionRequest {
  account_id: number;
  type: Transaction["type"];
  amount: number;
  description?: string;
}
