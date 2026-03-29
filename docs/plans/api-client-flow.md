# apiClient Flow — Token Refresh

## 1. Single Request Flow

```
Component
  │
  ▼
apiClient.get<Account[]>('/accounts')
  │
  ▼
request('/accounts')
  │
  ▼
fetch('/api/accounts', { credentials: 'include' })
  │
  ├── 200 OK ──────────────────────► return res.json() ──► Component nhận data
  │
  ├── 401 Unauthorized ──► refreshTokenOnce()
  │                              │
  │                              ▼
  │                        refreshPromise === null?
  │                              │
  │                         ┌────┴────┐
  │                        YES       NO
  │                         │         │
  │                         ▼         ▼
  │                  refreshToken()   return refreshPromise
  │                         │         (chờ chung)
  │                         ▼
  │                  POST /api/auth/refresh
  │                         │
  │                    ┌────┴────┐
  │                   OK       FAIL
  │                    │         │
  │                    ▼         ▼
  │               .finally()  .finally()
  │            refreshPromise  refreshPromise
  │               = null        = null
  │                    │         │
  │                    ▼         ▼
  │               return true  return false
  │                    │         │
  │                    ▼         ▼
  │              retry request  redirect /auth/login
  │                    │
  │                    ▼
  │              request('/accounts') ← lần 2
  │                    │
  │                    ▼
  │              fetch → 200 OK → return data
  │
  ├── 400/403/500 ──► throw ApiError(status, message)
  │
  ▼
Component nhận data hoặc catch error
```

## 2. Multiple Requests (401 cùng lúc)

### Tình huống

```
Dashboard load → 3 API calls đồng thời → token hết hạn → cả 3 nhận 401
```

### Timeline

```
T=0ms   /accounts     → fetch → 401
T=2ms   /transactions → fetch → 401
T=3ms   /profile      → fetch → 401

        ┌──────────────────────────────────────────────────┐
        │            refreshTokenOnce()                     │
        │                                                   │
T=5ms   │  /accounts vào:                                   │
        │    refreshPromise = null                          │
        │    → refreshPromise = refreshToken() ← GỌI API   │
        │                                                   │
T=6ms   │  /transactions vào:                               │
        │    refreshPromise ≠ null                          │
        │    → return refreshPromise ← CHỜR CHUNG           │
        │                                                   │
T=7ms   │  /profile vào:                                    │
        │    refreshPromise ≠ null                          │
        │    → return refreshPromise ← CHỜ CHUNG            │
        │                                                   │
        │  ┌─────────────────────────────┐                  │
        │  │  POST /api/auth/refresh     │                  │
        │  │  (chỉ 1 request duy nhất)   │                  │
        │  └─────────────────────────────┘                  │
        │                                                   │
T=200ms │  Refresh xong → return true                       │
        │  .finally() → refreshPromise = null (reset cờ)    │
        │                                                   │
        │  Cả 3 await đều nhận: true                        │
        └──────────────────────────────────────────────────┘

T=201ms /accounts     → retry → fetch → 200 → return Account[]
T=202ms /transactions → retry → fetch → 200 → return Transaction[]
T=203ms /profile      → retry → fetch → 200 → return User

        Dashboard nhận đủ data, render bình thường.
```

### So sánh

```
Không có mutex:
  /accounts     → 401 → refreshToken() → POST /auth/refresh
  /transactions → 401 → refreshToken() → POST /auth/refresh  ← THỪA
  /profile      → 401 → refreshToken() → POST /auth/refresh  ← THỪA
  = 3 lần gọi refresh API

Có mutex (refreshTokenOnce):
  /accounts     → 401 → refreshTokenOnce() → refreshToken() → POST /auth/refresh
  /transactions → 401 → refreshTokenOnce() → chờ ↑
  /profile      → 401 → refreshTokenOnce() → chờ ↑
  = 1 lần gọi refresh API
```

## 3. Refresh Fail Flow

```
T=0ms   /accounts → 401 → refreshTokenOnce() → refreshToken()
                                                     │
                                                     ▼
                                          POST /api/auth/refresh
                                                     │
                                                     ▼
                                              401 (refresh token
                                               cũng hết hạn)
                                                     │
                                                     ▼
                                              return false
                                                     │
                                                     ▼
                                      refreshed = false
                                                     │
                                                     ▼
                                      window.location.href = '/auth/login'
                                      throw ApiError(401, 'Session expired')
                                                     │
                                                     ▼
                                      User bị redirect về trang login
```

## 4. Code tham chiếu

```ts
// packages/shared-utils/src/apiClient.ts

// Mutex variable
let refreshPromise: Promise<boolean> | null = null

// Gọi API refresh — chỉ làm 1 việc
async function refreshToken(): Promise<boolean> { ... }

// Mutex wrapper — đảm bảo chỉ refresh 1 lần
function refreshTokenOnce(): Promise<boolean> { ... }

// Core — handle mọi request + 401 retry
async function request<T>(endpoint, options): Promise<T> { ... }

// Public API — shortcut cho request()
export const apiClient = { get, post, put, delete }
```
