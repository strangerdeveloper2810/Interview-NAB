# shared-lib Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tạo `packages/shared-lib` chứa Axios instance (httpOnly cookie + silent refresh) và Zustand global store (auth, ui, notification) dùng chung cho shell và tất cả remote apps.

**Architecture:** Shared-lib là một pnpm workspace package (`@nab/shared-lib`). Cả shell và remote apps đều import trực tiếp từ package này. MF config `shared` đảm bảo chỉ có 1 instance duy nhất ở runtime. Token được lưu trong httpOnly cookie — browser tự gửi, không cần attach thủ công.

**Tech Stack:** Axios 1.x, Zustand 5.x, TypeScript strict

---

## Task 1: Tạo package skeleton

**Files:**
- Create: `packages/shared-lib/package.json`
- Create: `packages/shared-lib/tsconfig.json`
- Create: `packages/shared-lib/src/index.ts`

**Step 1: Tạo `packages/shared-lib/package.json`**

```json
{
  "name": "@nab/shared-lib",
  "private": true,
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "axios": "^1.7.0",
    "zustand": "^5.0.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

**Step 2: Tạo `packages/shared-lib/tsconfig.json`**

Copy từ `packages/shared-ui/tsconfig.json` (nếu có), hoặc dùng:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**Step 3: `src/index.ts` để trống trước, sẽ export sau**

```ts
// exports sẽ được thêm dần
```

**Step 4: Install dependencies**

```bash
cd packages/shared-lib && pnpm install
# hoặc từ root:
pnpm install
```

---

## Task 2: Zustand store — authSlice

**Files:**
- Create: `packages/shared-lib/src/store/slices/authSlice.ts`

**Mục tiêu:** Quản lý user info và trạng thái authentication.

**Step 1: Tạo types và slice**

```ts
// packages/shared-lib/src/store/slices/authSlice.ts

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthActions {
  setUser: (user: User) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export type AuthSlice = AuthState & AuthActions

export const createAuthSlice = (set: (fn: (state: AuthSlice) => Partial<AuthSlice>) => void): AuthSlice => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: (user) => set(() => ({ user, isAuthenticated: true, isLoading: false })),
  clearAuth: () => set(() => ({ user: null, isAuthenticated: false, isLoading: false })),
  setLoading: (loading) => set(() => ({ isLoading: loading })),
})
```

> **Note về Zustand 5.x slice pattern:** Mỗi slice nhận `set` (và `get` nếu cần) như argument, trả về object chứa state + actions. Sẽ combine lại ở `useStore.ts`.

---

## Task 3: Zustand store — uiSlice

**Files:**
- Create: `packages/shared-lib/src/store/slices/uiSlice.ts`

```ts
// packages/shared-lib/src/store/slices/uiSlice.ts

export type Theme = 'light' | 'dark'
export type Language = 'vi' | 'en'

export interface UIState {
  theme: Theme
  language: Language
  sidebarOpen: boolean
}

export interface UIActions {
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleSidebar: () => void
}

export type UISlice = UIState & UIActions

export const createUISlice = (set: (fn: (state: UISlice) => Partial<UISlice>) => void): UISlice => ({
  // State
  theme: 'light',
  language: 'vi',
  sidebarOpen: true,

  // Actions
  setTheme: (theme) => set(() => ({ theme })),
  setLanguage: (language) => set(() => ({ language })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
})
```

---

## Task 4: Zustand store — notificationSlice

**Files:**
- Create: `packages/shared-lib/src/store/slices/notificationSlice.ts`

```ts
// packages/shared-lib/src/store/slices/notificationSlice.ts

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number  // ms, undefined = persist until dismissed
}

export interface NotificationState {
  notifications: Notification[]
}

export interface NotificationActions {
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export type NotificationSlice = NotificationState & NotificationActions

export const createNotificationSlice = (set: (fn: (state: NotificationSlice) => Partial<NotificationSlice>) => void): NotificationSlice => ({
  // State
  notifications: [],

  // Actions
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set(() => ({ notifications: [] })),
})
```

---

## Task 5: Combine slices → root store

**Files:**
- Create: `packages/shared-lib/src/store/useStore.ts`
- Create: `packages/shared-lib/src/store/index.ts`

**Step 1: `useStore.ts`**

```ts
// packages/shared-lib/src/store/useStore.ts
import { create } from 'zustand'
import { createAuthSlice, type AuthSlice } from './slices/authSlice'
import { createUISlice, type UISlice } from './slices/uiSlice'
import { createNotificationSlice, type NotificationSlice } from './slices/notificationSlice'

export type RootStore = AuthSlice & UISlice & NotificationSlice

export const useStore = create<RootStore>()((set) => ({
  ...createAuthSlice(set),
  ...createUISlice(set),
  ...createNotificationSlice(set),
}))
```

**Step 2: `store/index.ts`**

```ts
export { useStore } from './useStore'
export type { RootStore } from './useStore'
export type { User, AuthSlice } from './slices/authSlice'
export type { Theme, Language, UISlice } from './slices/uiSlice'
export type { Notification, NotificationType, NotificationSlice } from './slices/notificationSlice'
```

> **Cách dùng trong bất kỳ app nào:**
> ```ts
> import { useStore } from '@nab/shared-lib'
> const user = useStore((state) => state.user)           // selector để tránh re-render thừa
> const setTheme = useStore((state) => state.setTheme)
> ```

---

## Task 6: Axios instance + silent refresh

**Files:**
- Create: `packages/shared-lib/src/http/axiosInstance.ts`
- Create: `packages/shared-lib/src/http/index.ts`

**Step 1: Tạo `axiosInstance.ts`**

```ts
// packages/shared-lib/src/http/axiosInstance.ts
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'

// Dùng lazy import để tránh circular dependency
// store sẽ được inject từ ngoài vào
type ClearAuthFn = () => void

let _clearAuth: ClearAuthFn | null = null

export function injectClearAuth(fn: ClearAuthFn) {
  _clearAuth = fn
}

// --- Refresh token queue logic ---

let isRefreshing = false
type QueueItem = { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }
let failedQueue: QueueItem[] = []

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}

// --- Axios instance ---

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,   // browser tự gửi httpOnly cookie
  timeout: 15000,
})

// Request interceptor — không cần attach token vì cookie tự gửi
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error) => Promise.reject(error)
)

// Response interceptor — xử lý 401 + silent refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Nếu không phải 401, hoặc đã retry rồi → trả lỗi luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Nếu đang refresh → queue request này lại
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err))
    }

    // Bắt đầu refresh
    originalRequest._retry = true
    isRefreshing = true

    try {
      // BFF endpoint: POST /auth/refresh
      // Browser tự gửi refreshToken cookie, BFF trả về accessToken cookie mới
      await axios.post(
        'http://localhost:4000/api/auth/refresh',
        {},
        { withCredentials: true }
      )

      processQueue(null)          // flush queue — retry tất cả
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)  // reject tất cả pending requests
      _clearAuth?.()              // clear store + redirect về login
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)
```

**Step 2: `http/index.ts`**

```ts
export { apiClient, injectClearAuth } from './axiosInstance'
```

---

## Task 7: Wiring — inject clearAuth vào axios

**Files:**
- Modify: `apps/shell/src/bootstrap.tsx` (hoặc `main.tsx`)

Ở entry point của shell app, inject `clearAuth` vào axios sau khi store được init:

```ts
// apps/shell/src/bootstrap.tsx
import { injectClearAuth, useStore } from '@nab/shared-lib'

// Inject một lần duy nhất khi app khởi động
injectClearAuth(() => {
  useStore.getState().clearAuth()
  window.location.href = '/login'
})
```

> **Tại sao không import store trực tiếp trong axiosInstance?** Tránh circular dependency. `axiosInstance` được init trước khi React/store mount, nên dùng pattern "inject later".

---

## Task 8: Export public API

**Files:**
- Modify: `packages/shared-lib/src/index.ts`

```ts
// packages/shared-lib/src/index.ts

// Store
export { useStore } from './store'
export type { RootStore, User, Theme, Language, Notification, NotificationType } from './store'

// HTTP
export { apiClient, injectClearAuth } from './http'
```

---

## Task 9: Cập nhật MF shared config

**Files:**
- Modify: `apps/shell/rspack.config.ts`

Thêm `axios` và `@nab/shared-lib` vào `shared` để đảm bảo singleton:

```ts
shared: {
  react: { singleton: true, requiredVersion: '^18.2.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  'react-router': { singleton: true },
  zustand: { singleton: true },
  axios: { singleton: true },                    // thêm mới
  '@nab/shared-lib': { singleton: true },        // thêm mới
},
```

> **Quan trọng:** Mỗi remote app khi tạo sau này đều phải có cùng `shared` config này. Nếu không, sẽ có 2 instance của store → state không sync.

---

## Task 10: Verify hoạt động

**Step 1: Kiểm tra import từ shell**

Trong `App.tsx` thêm tạm:

```ts
import { useStore, apiClient } from '@nab/shared-lib'
console.log('store:', useStore.getState())
console.log('apiClient baseURL:', apiClient.defaults.baseURL)
```

**Step 2: Chạy shell app**

```bash
pnpm dev:shell
```

Mở browser console, kiểm tra 2 log trên không bị lỗi.

**Step 3: Xóa console.log sau khi verify xong**

---

## Checklist

- [ ] Task 1: package skeleton (`package.json`, `tsconfig.json`)
- [ ] Task 2: `authSlice.ts`
- [ ] Task 3: `uiSlice.ts`
- [ ] Task 4: `notificationSlice.ts`
- [ ] Task 5: `useStore.ts` + `store/index.ts`
- [ ] Task 6: `axiosInstance.ts` + `http/index.ts`
- [ ] Task 7: inject `clearAuth` vào `bootstrap.tsx`
- [ ] Task 8: `src/index.ts` public API
- [ ] Task 9: MF `shared` config trong `rspack.config.ts`
- [ ] Task 10: Verify chạy không lỗi
