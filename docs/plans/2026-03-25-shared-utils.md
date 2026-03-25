# shared-utils Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tạo `packages/shared-utils` chứa pure functions và React hooks dùng chung cho toàn bộ monorepo (shell + remote apps).

**Architecture:** Workspace package `@nab/shared-utils`, không có React dependency ngoại trừ nhóm hooks. Mỗi nhóm là một file riêng, export qua `src/index.ts`. Không có side effects — tất cả đều là pure functions hoặc hooks.

**Tech Stack:** TypeScript strict, React 18 (chỉ cho hooks)

---

## Task 1: Package skeleton

**Files:**
- Create: `packages/shared-utils/package.json`
- Create: `packages/shared-utils/tsconfig.json`
- Create: `packages/shared-utils/src/index.ts`

**Step 1: `package.json`**

```json
{
  "name": "@nab/shared-utils",
  "private": true,
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

**Step 2: `tsconfig.json`** — copy từ `packages/shared-ui/tsconfig.json`, xóa `outDir` và `rootDir` vì package này không build riêng (bundler xử lý):

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

**Step 3: `src/index.ts`** để trống, export sau.

---

## Task 2: Formatting utils

**Files:**
- Create: `packages/shared-utils/src/formatting.ts`

```ts
// packages/shared-utils/src/formatting.ts

/**
 * Format số tiền theo locale VN
 * formatCurrency(25000000, 'VND') → '25.000.000 ₫'
 * formatCurrency(100, 'USD') → '$100.00'
 */
export function formatCurrency(amount: number, currency = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date thân thiện cho transaction list
 * formatDate(new Date()) → '25/03/2026 14:30'
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (format === 'time') {
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
  }
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Mask account number, chỉ hiện 4 số cuối
 * formatAccountNumber('1234567890') → '**** **** 7890'
 */
export function formatAccountNumber(accountNumber: string): string {
  const last4 = accountNumber.slice(-4)
  return `**** **** ${last4}`
}

/**
 * Format amount với dấu +/- theo loại transaction
 * formatTransactionAmount(5000000, 'deposit') → '+5.000.000 ₫'
 * formatTransactionAmount(500000, 'withdrawal') → '-500.000 ₫'
 */
export function formatTransactionAmount(
  amount: number,
  type: 'deposit' | 'withdrawal' | 'transfer',
  currency = 'VND'
): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  const sign = type === 'deposit' ? '+' : '-'
  return `${sign}${formatted}`
}
```

---

## Task 3: Validation utils

**Files:**
- Create: `packages/shared-utils/src/validation.ts`

```ts
// packages/shared-utils/src/validation.ts

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * Password: tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 số
 * Banking standard — không dùng min 6 như backlog để đúng thực tế
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

/**
 * Account number: đúng 10 chữ số (chuẩn banking VN)
 */
export function isValidAccountNumber(accountNumber: string): boolean {
  return /^\d{10}$/.test(accountNumber.trim())
}

/**
 * Transfer amount: > 0, không vượt quá balance, tối đa 500tr/lần (business rule mẫu)
 */
export function isValidAmount(amount: number, balance?: number, maxPerTransaction = 500_000_000): boolean {
  if (amount <= 0) return false
  if (amount > maxPerTransaction) return false
  if (balance !== undefined && amount > balance) return false
  return true
}

/**
 * Số điện thoại VN: 10 số, bắt đầu bằng 0[3|5|7|8|9]
 */
export function isValidVNPhone(phone: string): boolean {
  return /^(0[35789])\d{8}$/.test(phone.trim())
}
```

---

## Task 4: Constants

**Files:**
- Create: `packages/shared-utils/src/constants.ts`

```ts
// packages/shared-utils/src/constants.ts

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: (id: string | number) => `/accounts/${id}`,
  TRANSFER: '/transfer',
  PROFILE: '/profile',
} as const

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  // User
  USER_PROFILE: '/user/profile',
  // Accounts
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: (id: number) => `/accounts/${id}`,
  // Transactions
  ACCOUNT_TRANSACTIONS: (accountId: number) => `/accounts/${accountId}/transactions`,
  // Transfer
  TRANSFER: '/transfer',
  // Dashboard
  DASHBOARD: '/dashboard',
} as const

// Sync với BFF ErrorResponse.code field
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SERVER_ERROR: 'SERVER_ERROR',
} as const

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
} as const

export const ACCOUNT_TYPES = {
  CHECKING: 'checking',
  SAVINGS: 'savings',
  CREDIT: 'credit',
} as const
```

---

## Task 5: API helpers

**Files:**
- Create: `packages/shared-utils/src/apiHelpers.ts`

```ts
// packages/shared-utils/src/apiHelpers.ts
import type { AxiosError } from 'axios'

interface ApiErrorResponse {
  success: false
  error: string
  code?: string
}

/**
 * Extract user-friendly message từ axios error
 * Dùng trong catch blocks thay vì hiện raw error
 */
export function parseApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>

  if (axiosError.response?.data?.error) {
    return axiosError.response.data.error
  }

  if (axiosError.message === 'Network Error') {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
  }

  if (axiosError.code === 'ECONNABORTED') {
    return 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.'
  }

  return 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
}

/**
 * Convert page/size UI sang limit/offset cho BFF
 * buildPaginationParams(2, 10) → { limit: 10, offset: 10 }
 */
export function buildPaginationParams(page: number, size = 10): { limit: number; offset: number } {
  return {
    limit: size,
    offset: (page - 1) * size,
  }
}
```

---

## Task 6: Storage helper

**Files:**
- Create: `packages/shared-utils/src/storage.ts`

```ts
// packages/shared-utils/src/storage.ts
// Typed localStorage wrapper — KHÔNG dùng cho token (httpOnly cookie)
// Dùng cho: theme preference, language, sidebar state

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage có thể bị disabled (private mode, quota exceeded)
      console.warn(`[storage] Failed to set key: ${key}`)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  },
}
```

---

## Task 7: Security utils

**Files:**
- Create: `packages/shared-utils/src/security.ts`

```ts
// packages/shared-utils/src/security.ts

/**
 * Strip HTML tags để tránh XSS khi render user input
 * sanitizeInput('<script>alert(1)</script>') → 'alert(1)'
 */
export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}

/**
 * Mask sensitive string, chỉ giữ N ký tự cuối
 * dùng khi log hoặc debug, không log raw account number
 * maskSensitiveData('1234567890', 4) → '******7890'
 */
export function maskSensitiveData(str: string, visibleChars = 4): string {
  if (str.length <= visibleChars) return str
  return '*'.repeat(str.length - visibleChars) + str.slice(-visibleChars)
}
```

---

## Task 8: React hooks

**Files:**
- Create: `packages/shared-utils/src/hooks/useDebounce.ts`
- Create: `packages/shared-utils/src/hooks/useClickOutside.ts`
- Create: `packages/shared-utils/src/hooks/usePrevious.ts`
- Create: `packages/shared-utils/src/hooks/index.ts`

**`useDebounce.ts`** — dùng cho search/filter input:
```ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

**`useClickOutside.ts`** — dùng cho dropdown, modal:
```ts
import { useEffect, type RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
): void {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, handler])
}
```

**`usePrevious.ts`** — track giá trị trước đó:
```ts
import { useRef, useEffect } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
```

**`hooks/index.ts`**:
```ts
export { useDebounce } from './useDebounce'
export { useClickOutside } from './useClickOutside'
export { usePrevious } from './usePrevious'
```

---

## Task 9: Export public API

**Files:**
- Modify: `packages/shared-utils/src/index.ts`

```ts
// Formatting
export {
  formatCurrency,
  formatDate,
  formatAccountNumber,
  formatTransactionAmount,
} from './formatting'

// Validation
export {
  isValidEmail,
  isValidPassword,
  isValidAccountNumber,
  isValidAmount,
  isValidVNPhone,
} from './validation'

// Constants
export { ROUTES, API_ENDPOINTS, ERROR_CODES, TRANSACTION_TYPES, ACCOUNT_TYPES } from './constants'

// API helpers
export { parseApiError, buildPaginationParams } from './apiHelpers'

// Storage
export { storage } from './storage'

// Security
export { sanitizeInput, maskSensitiveData } from './security'

// Hooks
export { useDebounce, useClickOutside, usePrevious } from './hooks'
```

---

## Task 10: Thêm vào pnpm workspace + MF shared config

**Step 1: Kiểm tra `pnpm-workspace.yaml`**

```bash
cat pnpm-workspace.yaml
```

Phải có `packages/*` trong danh sách. Nếu chưa có thì thêm vào.

**Step 2: Install từ root**

```bash
pnpm install
```

**Step 3: Thêm `@nab/shared-utils` vào MF shared config của shell** (`apps/shell/rspack.config.ts`):

```ts
shared: {
  // ... existing
  '@nab/shared-utils': { singleton: true },   // thêm dòng này
},
```

> Remote apps tạo sau cũng phải thêm dòng này.

---

## Task 11: Verify

**Step 1: Import thử trong `App.tsx`**

```ts
import { formatCurrency, ROUTES, isValidEmail } from '@nab/shared-utils'
console.log(formatCurrency(25000000, 'VND'))  // → '25.000.000 ₫'
console.log(ROUTES.DASHBOARD)                  // → '/dashboard'
console.log(isValidEmail('test@nab.com'))      // → true
```

**Step 2: Chạy shell**

```bash
pnpm dev:shell
```

Không có lỗi TypeScript/import → done.

**Step 3: Xóa console.log**

---

## Checklist

- [ ] Task 1: Package skeleton
- [ ] Task 2: `formatting.ts`
- [ ] Task 3: `validation.ts`
- [ ] Task 4: `constants.ts`
- [ ] Task 5: `apiHelpers.ts`
- [ ] Task 6: `storage.ts`
- [ ] Task 7: `security.ts`
- [ ] Task 8: Hooks (`useDebounce`, `useClickOutside`, `usePrevious`)
- [ ] Task 9: `index.ts` public API
- [ ] Task 10: pnpm workspace + MF shared config
- [ ] Task 11: Verify không lỗi
