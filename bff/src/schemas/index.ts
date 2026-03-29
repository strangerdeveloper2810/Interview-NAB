import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

export const updateNameSchema = z.object({
  name: z.string().min(2),
});

export const transferSchema = z.object({
  fromAccountId: z.number().positive(),
  toAccountId: z.number().positive(),
  amount: z.number().positive(),
  description: z.string().max(100).optional(),
});
