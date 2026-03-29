# NAB Banking Portal

Micro-frontend Banking Portal demo — NAB Vietnam Frontend Engineer interview preparation.

## Architecture

```
                              Shell (Host)
                             localhost:3000
                    ┌────────────┼────────────┐
                    │            │            │
               ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌─────────┐
               │Dashboard│ │Accounts │ │Transfer │ │  Admin  │
               │  :3001  │ │  :3002  │ │  :3003  │ │  :3004  │
               └─────────┘ └─────────┘ └─────────┘ └─────────┘
                                    │
                              ┌─────┴─────┐
                              │  BFF API  │
                              │   :4000   │
                              └─────┬─────┘
                           ┌────────┼────────┐
                           │ PostgreSQL │ Redis │
                           │   :5432    │ :6379 │
                           └────────────┴───────┘
```

| App | Port | Responsibility |
|-----|------|----------------|
| **shell** | 3000 | Host app — Auth, Home, Profile, routing, layouts |
| **dashboard** | 3001 | User dashboard — balance overview, recent transactions |
| **accounts** | 3002 | Account list + Account detail (transactions, filters) |
| **transfer** | 3003 | Money transfer — 3-step form (input → confirm → result) |
| **admin** | 3004 | Admin dashboard (monitoring/charts) + User management |
| **bff** | 4000 | Express.js Backend for Frontend |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Rspack + Module Federation 2.0 (`@module-federation/enhanced`) |
| Styling | CSS Modules / SCSS (BEM naming) |
| State | Zustand (auth) with persist middleware |
| Forms | React Hook Form + Zod |
| BFF | Express.js + PostgreSQL + JWT (access + refresh tokens) |
| Validation | Zod (BFF + Frontend) |
| Monorepo | pnpm workspaces |
| Infra | Docker Compose (PostgreSQL 16, Redis 7, Adminer) |
| Testing | Jest + React Testing Library (setup ready) |
| Docs | Storybook 8.x |

## Project Structure

```
nab-banking-portal/
├── apps/
│   ├── shell/              # Host — Auth, Home, Profile, layouts, routing
│   ├── dashboard/          # Remote — User dashboard
│   ├── accounts/           # Remote — Accounts + Account Detail
│   ├── transfer/           # Remote — Money transfer
│   └── admin/              # Remote — Admin dashboard + User management
├── bff/                    # Backend for Frontend (Express.js)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access (PostgreSQL)
│   │   ├── middleware/     # Auth (JWT), validation (Zod), error handling
│   │   ├── routes/         # API route definitions
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── config/         # Database config
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # JWT utilities
│   └── scripts/init.sql    # DB schema + seed data
├── packages/
│   ├── shared-ui/          # Shared components (Button, Input, Card, Toast, etc.)
│   ├── shared-utils/       # apiClient, formatting, validation utilities
│   └── shared-types/       # TypeScript type definitions
├── docs/
│   ├── backlog/            # Product backlog & progress tracking
│   └── plans/              # Technical plans & flow diagrams
└── docker-compose.yml      # PostgreSQL + Redis + Adminer
```

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker + Docker Compose

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start infrastructure (PostgreSQL, Redis, Adminer)
docker compose up -d

# 3. Init database (schema + seed data)
docker exec -i nab-postgres psql -U nab_user -d nab_banking < bff/scripts/init.sql

# 4. Start all apps
pnpm dev:all
```

### Access

| Service | URL |
|---------|-----|
| Shell (main app) | http://localhost:3000 |
| Dashboard remote | http://localhost:3001 |
| Accounts remote | http://localhost:3002 |
| Transfer remote | http://localhost:3003 |
| Admin remote | http://localhost:3004 |
| BFF API | http://localhost:4000 |
| Adminer (DB UI) | http://localhost:8080 |

### Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@nab.com | 123456 | Admin |
| john@nab.com | 123456 | User |
| jane@nab.com | 123456 | User |

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev:all` | Start all apps + BFF (5 processes) |
| `pnpm dev:mf` | Start shell + all remotes (no BFF) |
| `pnpm dev:shell` | Shell only (port 3000) |
| `pnpm dev:dashboard` | Dashboard remote (port 3001) |
| `pnpm dev:accounts` | Accounts remote (port 3002) |
| `pnpm dev:transfer` | Transfer remote (port 3003) |
| `pnpm dev:admin` | Admin remote (port 3004) |
| `pnpm dev:bff` | BFF server (port 4000) |
| `pnpm dev:storybook` | Storybook (port 6006) |
| `pnpm build` | Build all apps |
| `pnpm test` | Run all tests |

## API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (returns message only) |
| POST | `/api/auth/login` | Login (returns user + tokens) |
| POST | `/api/auth/refresh` | Refresh access token |

### User (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user |
| PATCH | `/api/users/me` | Update name |
| PUT | `/api/users/password` | Change password |

### Accounts (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/accounts` | List user accounts |
| GET | `/api/accounts/:id` | Account detail |
| GET | `/api/accounts/:id/transactions` | Transactions (filter: `?type=deposit&days=30&page=1&limit=10`) |

### Transfer (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transfers` | Transfer money (DB transaction) |

### Dashboard (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard summary |

### Admin (Admin role only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id/accounts` | User's accounts |
| GET | `/api/admin/transactions` | All transactions |

## Task Board

### Done
- [x] BFF: Auth (login, register, refresh), Users, Accounts, Transfers (DB transaction), Dashboard, Admin
- [x] BFF: Zod validation, JWT dual-token, role-based middleware, error handling
- [x] Shell: Auth pages (RHF + Zod), AuthLayout, HomeLayout (role-based nav)
- [x] Shell: GuestRoute, ProtectedRoute (allowedRoles), Toast notifications
- [x] Shell: apiClient with refresh token mutex + auth endpoint skip
- [x] Remote: Dashboard (user overview, summary cards, accounts, transactions)
- [x] Remote: Accounts (list + detail with filters/pagination)
- [x] Remote: Transfer (3-step form)
- [x] Remote: Admin (monitoring dashboard with CSS charts + user management table)
- [x] Shared: UI components, utils, types packages
- [x] Module Federation: 4 remotes + shell host, CORS, error boundary, type declarations

### To Do

#### Phase 1: Kết nối API (thay mock data)

**Dashboard Remote (apps/dashboard)**
- [ ] Tạo custom hook `useDashboard()` — gọi `GET /api/dashboard` via apiClient
- [ ] Replace mock summary data (totalBalance, accountCount, transactionCount) bằng API response
- [ ] Replace mock accounts list bằng `GET /api/accounts`
- [ ] Replace mock transactions bằng response `recentTransactions`
- [ ] Shared Zustand store — pass user data từ shell (hiện đang mock `{ name: 'User' }`)
- [ ] Loading state: hiển thị Skeleton khi fetching
- [ ] Error state: hiển thị Alert + nút "Thử lại"

**Accounts Remote (apps/accounts)**
- [ ] Tạo custom hook `useAccounts()` — gọi `GET /api/accounts`
- [ ] Accounts page: replace mock data, tính totalBalance từ API
- [ ] Tạo custom hook `useAccountDetail(id)` — gọi `GET /api/accounts/:id`
- [ ] AccountDetail: replace mock account info bằng API
- [ ] Tạo custom hook `useTransactions(accountId, filters)` — gọi `GET /api/accounts/:id/transactions?type=&days=&page=&limit=`
- [ ] AccountDetail: wire filters (type, days) vào API query params
- [ ] AccountDetail: wire pagination ("Xem thêm" button tăng page)
- [ ] Loading/Error states cho cả 2 pages

**Transfer Remote (apps/transfer)**
- [ ] Step 1: replace mock account dropdown bằng `GET /api/accounts`
- [ ] Step 1: pre-select account từ `?from=` URL param (match với API data)
- [ ] Step 2: submit gọi `POST /api/transfers { fromAccountId, toAccountId, amount, description }`
- [ ] Step 3: hiển thị kết quả từ API response (transaction ID, timestamp)
- [ ] Handle errors: insufficient balance (400), account not found (404), same account (400)
- [ ] Toast notification khi transfer thành công

**Admin Remote (apps/admin)**
- [ ] Admin Dashboard: replace mock KPI data bằng `GET /api/admin/users` (count) + `GET /api/admin/transactions` (count, recent)
- [ ] Admin Dashboard: replace mock user list bằng API
- [ ] Admin Dashboard: replace mock transaction feed bằng API
- [ ] Users page: replace mock table bằng `GET /api/admin/users`
- [ ] Users page: "Xem tài khoản" button → gọi `GET /api/admin/users/:id/accounts`

**Profile (apps/shell)**
- [ ] Tạo custom hook `useProfile()` — gọi `GET /api/users/me`
- [ ] Display real user data (name, email, role, created_at)
- [ ] Edit name: gọi `PATCH /api/users/me { name }` + toast success
- [ ] Change password: gọi `PUT /api/users/password { currentPassword, newPassword }` + validation + toast
- [ ] Loading/Error states

#### Phase 2: Testing

**Unit Tests — shared-utils**
- [ ] `formatCurrency()` — VND, USD, edge cases (0, negative)
- [ ] `formatDate()` — short, long, time formats
- [ ] `formatAccountNumber()` — masking
- [ ] `formatTransactionAmount()` — deposit (+), withdrawal (-), transfer (-)
- [ ] `isValidEmail()` — valid, invalid, edge cases
- [ ] `isValidPassword()` — length, uppercase, number

**Unit Tests — shared-ui components**
- [ ] Button: render variants, click handler, disabled, loading state
- [ ] Input: render with label, onChange, error state, disabled
- [ ] Alert: render variants, close button handler
- [ ] Toast: showToast triggers render, auto-dismiss after 3s
- [ ] AccountCard: render props, format balance, click handler
- [ ] TransactionItem: render type icon, format date, amount color

**Integration Tests**
- [ ] Auth flow: register → redirect login → login → redirect dashboard
- [ ] Transfer flow: select account → enter amount → confirm → success
- [ ] Role guard: user truy cập /admin → redirect /dashboard
- [ ] Token refresh: expired access token → auto refresh → retry request

**E2E Tests (Playwright)**
- [ ] Full login/logout flow
- [ ] Dashboard loads remote module correctly
- [ ] Transfer 3-step flow end-to-end
- [ ] Admin dashboard loads for admin role

#### Phase 3: DevOps & Optimization

**CI/CD**
- [ ] GitHub Actions workflow: lint → typecheck → test → build
- [ ] Separate build jobs per app (shell, dashboard, accounts, transfer, admin)
- [ ] Cache pnpm store + node_modules

**Performance**
- [ ] Bundle analysis per app (rspack-bundle-analyzer)
- [ ] Lazy loading audit: verify code splitting boundaries
- [ ] Shared deps size check: ensure no duplicate React bundles
- [ ] Lighthouse audit: target >90 performance score

**Accessibility**
- [ ] axe-core audit trên tất cả pages
- [ ] Keyboard navigation test: Tab order, Enter/Space activation
- [ ] Screen reader test: ARIA labels, landmarks, live regions
- [ ] Color contrast check (WCAG AA minimum)
- [ ] Focus management khi navigate giữa routes

## Module Federation Setup

### Tổng quan

Dự án sử dụng **Module Federation 2.0** (`@module-federation/enhanced/rspack`) để chia app thành các remote modules độc lập. Shell app (Host) consume các remote modules qua `mf-manifest.json`.

### Shell App (Host) — Port 3000

```
apps/shell/
├── src/
│   ├── @types/
│   │   └── remotes.d.ts       # Type declarations cho remote modules
│   ├── components/
│   │   └── RemoteErrorBoundary.tsx  # Error boundary khi remote load fail
│   ├── routes/
│   │   ├── AppRoute.tsx        # Route config — lazy import remotes
│   │   ├── ProtectedRoute.tsx  # Auth guard + allowedRoles
│   │   └── GuestRoute.tsx      # Redirect nếu đã login
│   ├── layouts/
│   │   ├── HomeLayout/         # Nav bar (role-based), user menu, outlet
│   │   └── AuthLayout/         # Gradient bg + logo + card container
│   ├── stores/
│   │   └── authStore.ts        # Zustand persist (key: "nab-auth")
│   ├── pages/                  # Chỉ giữ local pages
│   │   ├── Auth/Login/         # RHF + Zod validation
│   │   ├── Auth/Register/      # RHF + Zod + password strength
│   │   ├── Home/               # Quick nav cards
│   │   └── Profile/            # User info + change password (UI)
│   └── validation/
│       └── auth.validation.ts  # Zod schemas (login, register)
├── @mf-types/                  # Auto-generated types từ MF plugin
│   ├── dashboard/
│   ├── accounts/
│   ├── transfer/
│   └── admin/
└── rspack.config.ts
```

**Shell rspack.config.ts — key config:**

```ts
ModuleFederationPlugin({
  name: "shell",
  remotes: {
    dashboard: "dashboard@http://localhost:3001/mf-manifest.json",
    accounts:  "accounts@http://localhost:3002/mf-manifest.json",
    transfer:  "transfer@http://localhost:3003/mf-manifest.json",
    admin:     "admin@http://localhost:3004/mf-manifest.json",
  },
  shared: {
    react:          { singleton: true, requiredVersion: "^18.2.0" },
    "react-dom":    { singleton: true, requiredVersion: "^18.2.0" },
    "react-router": { singleton: true },
    zustand:        { singleton: true },
  },
})
```

**Lưu ý quan trọng:**
- `publicPath: "/"` — Shell dùng absolute path vì là host app, tránh lỗi khi refresh ở nested routes (vd `/auth/register` → `/auth/main.js` 404)
- `proxy: [{ context: ['/api'], target: 'http://localhost:4000' }]` — Proxy API calls tới BFF
- `historyApiFallback: true` — SPA client-side routing

### Remote App (Producer) — Ví dụ Dashboard

```
apps/dashboard/
├── src/
│   ├── index.tsx              # import('./App') — async bootstrap
│   ├── App.tsx                # Re-export: export { default as DashboardPage } from ...
│   ├── @types/
│   │   └── scss.d.ts          # Module declaration cho *.module.scss
│   └── pages/
│       └── Dashboard/
│           ├── Dashboard.tsx
│           └── Dashboard.module.scss
├── rspack.config.ts
├── package.json
└── tsconfig.json
```

**Remote rspack.config.ts — key config:**

```ts
ModuleFederationPlugin({
  name: "dashboard",
  exposes: {
    "./DashboardPage": "./src/pages/Dashboard/Dashboard.tsx",
  },
  shared: { /* same as shell */ },
})
```

**Lưu ý quan trọng:**
- `publicPath: "auto"` — Remote dùng auto để chunk URLs resolve đúng bất kể host nào load
- `headers: { 'Access-Control-Allow-Origin': '*' }` — Bắt buộc cho dev server, shell (port 3000) fetch manifest từ remote (port 3001) = cross-origin
- `singleton: true` trên shared deps — đảm bảo chỉ 1 instance React/Zustand runtime, tránh "hooks can only be called inside a component" error

### Cách Shell consume Remote

```tsx
// 1. Type declaration (src/@types/remotes.d.ts)
declare module 'dashboard/DashboardPage' {
  import { FC } from 'react';
  const DashboardPage: FC;
  export default DashboardPage;
}

// 2. Lazy import trong AppRoute.tsx
const DashboardLazy = lazy(() => import('dashboard/DashboardPage'));

// 3. Route config
{ path: '/dashboard', element: <DashboardLazy /> }

// 4. Wrap trong Suspense + ErrorBoundary
<RemoteErrorBoundary>
  <Suspense fallback={<div>Loading...</div>}>
    {element}
  </Suspense>
</RemoteErrorBoundary>
```

### `@mf-types/` — Auto-generated Types

Khi chạy dev, `@module-federation/enhanced` tự generate type declarations vào `apps/shell/@mf-types/`. Folder này chứa compiled types từ mỗi remote:

```
@mf-types/
├── index.d.ts
├── dashboard/
│   ├── DashboardPage.d.ts     # Auto-gen từ remote exposes
│   ├── apis.d.ts
│   └── compiled-types/        # Full type tree của remote
├── accounts/
│   ├── AccountsPage.d.ts
│   ├── AccountDetailPage.d.ts
│   └── compiled-types/
├── transfer/
│   └── TransferPage.d.ts
└── admin/
    ├── AdminDashboardPage.d.ts
    └── AdminUsersPage.d.ts
```

> **Note:** `@mf-types/` là auto-generated, nên add vào `.gitignore`. File `src/@types/remotes.d.ts` là manual fallback khi auto-gen chưa ready.

### Tất cả Remote Apps

| Remote | Port | publicPath | exposes | CORS |
|--------|------|------------|---------|------|
| dashboard | 3001 | auto | `./DashboardPage` | `*` |
| accounts | 3002 | auto | `./AccountsPage`, `./AccountDetailPage` | `*` |
| transfer | 3003 | auto | `./TransferPage` | `*` |
| admin | 3004 | auto | `./AdminDashboardPage`, `./AdminUsersPage` | `*` |

### Shared Dependencies

Tất cả apps (shell + 4 remotes) share cùng config:

```ts
shared: {
  react:          { singleton: true, requiredVersion: "^18.2.0" },
  "react-dom":    { singleton: true, requiredVersion: "^18.2.0" },
  "react-router": { singleton: true },
  zustand:        { singleton: true },
}
```

`singleton: true` = chỉ load 1 instance duy nhất. Nếu shell đã load React, remotes sẽ dùng cùng instance đó → tránh duplicate React runtime.

### Role-based Routing

```
Admin login  → /admin           → AdminDashboardLazy (từ admin remote)
             → /admin/users     → AdminUsersLazy (từ admin remote)

User login   → /dashboard       → DashboardLazy (từ dashboard remote)
             → /accounts        → AccountsLazy (từ accounts remote)
             → /accounts/:id    → AccountDetailLazy (từ accounts remote)
             → /transfer        → TransferLazy (từ transfer remote)

Admin vào /dashboard → redirect /admin
User vào /admin      → redirect /dashboard
```

### Troubleshooting

| Vấn đề | Nguyên nhân | Fix |
|--------|-------------|-----|
| `Failed to get manifest` RUNTIME-003 | Remote app chưa chạy hoặc CORS | Chạy remote app + thêm `Access-Control-Allow-Origin: *` |
| `publicPath: auto` → 404 trên shell | Shell cần `publicPath: "/"`, chỉ remotes dùng `auto` | Đổi shell về `/` |
| Refresh page → 404 `main.js` | `historyApiFallback` chưa enable hoặc `publicPath` sai | Enable fallback + `publicPath: "/"` |
| Hooks error (invalid hook call) | 2 React instances | Kiểm tra `singleton: true` trên tất cả apps |
| Login 401 → page reload | apiClient refresh logic chạy cho auth endpoints | Thêm auth endpoint skip list |

## BFF Architecture (Backend for Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Micro-frontends)                │
│   Shell(:3000)  Dashboard(:3001)  Accounts(:3002)           │
│   Transfer(:3003)  Admin(:3004)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP (REST API)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      BFF LAYER (:4000)                       │
│                                                              │
│  Middleware:  CORS → Helmet → JSON → Logger → Auth (JWT)     │
│                           │                                  │
│  Routes:     /auth/*  /users/*  /accounts/*  /transfers      │
│              /dashboard  /admin/*                             │
│                           │                                  │
│  Controllers:  Parse request → validate → format response    │
│                           │                                  │
│  Services:     Business logic, orchestration                 │
│                           │                                  │
│  Repositories: Data access (parameterized SQL queries)       │
│                                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌──────────┼──────────┐
                │ PostgreSQL │  Redis  │
                │   :5432    │  :6379  │
                └────────────┴─────────┘
```

### Request Flow

```
POST /api/auth/login { email, password }
  │
  ├─→ Middleware: CORS → Helmet → JSON → Logger
  ├─→ Zod Validation: loginSchema.parse(req.body)
  ├─→ Controller: extract { email, password }
  ├─→ Service: findUser → bcrypt.compare → generateTokenPair
  ├─→ Repository: SELECT * FROM users WHERE email = $1
  │
  └─→ Response: { success: true, data: { user, tokens } }
```

### Transfer with DB Transaction

```
POST /api/transfers { fromAccountId, toAccountId, amount }
  │
  ├─→ Zod Validation: transferSchema
  ├─→ Controller → Service.transfer()
  │
  ├─→ BEGIN
  │   ├─→ Validate source account (ownership)
  │   ├─→ Check sufficient balance
  │   ├─→ Validate destination account
  │   ├─→ UPDATE source: balance - amount
  │   ├─→ UPDATE destination: balance + amount
  │   ├─→ INSERT transaction record
  │   └─→ COMMIT
  │
  └─→ On error: ROLLBACK + release client
```

## JWT Token Flow & Refresh Strategy

```
┌──────────────────────────────────────────────────────────────┐
│  ACCESS TOKEN              │  REFRESH TOKEN                  │
│  Expire: 15 minutes        │  Expire: 7 days                 │
│  Usage: API authentication  │  Usage: Get new access token    │
│  Storage: Memory/localStorage │  Storage: HttpOnly cookie     │
└──────────────────────────────────────────────────────────────┘
```

### Normal Flow

```
Client                                           BFF
  │                                                │
  │  1. POST /auth/login {email, password}         │
  │───────────────────────────────────────────────>│
  │  2. { user, tokens: {accessToken, refreshToken} } │
  │<───────────────────────────────────────────────│
  │                                                │
  │  3. GET /accounts (Authorization: Bearer <AT>) │
  │───────────────────────────────────────────────>│
  │  4. { accounts: [...] }                        │
  │<───────────────────────────────────────────────│
```

### Token Expired → Auto Refresh (apiClient)

```
Client (apiClient)                               BFF
  │                                                │
  │  1. GET /accounts (expired token)              │
  │───────────────────────────────────────────────>│
  │  2. 401 Unauthorized                           │
  │<───────────────────────────────────────────────│
  │                                                │
  │  ┌─ refreshTokenOnce() ─────────────────────┐  │
  │  │ Check: is someone already refreshing?     │  │
  │  │   YES → await same promise (mutex)        │  │
  │  │   NO  → POST /auth/refresh {refreshToken} │  │
  │  │         ────────────────────────────────>  │  │
  │  │         { newAccessToken, newRefreshToken }│  │
  │  │         <────────────────────────────────  │  │
  │  │ .finally() → reset mutex                  │  │
  │  └──────────────────────────────────────────┘  │
  │                                                │
  │  3. Retry: GET /accounts (new token)           │
  │───────────────────────────────────────────────>│
  │  4. { accounts: [...] }                        │
  │<───────────────────────────────────────────────│
```

### Multiple 401s — Mutex Pattern

```
Token expired, 3 requests fail simultaneously:

  /accounts     → 401 → refreshTokenOnce() → POST /auth/refresh ← ONLY 1 CALL
  /transactions → 401 → refreshTokenOnce() → await same promise ← WAIT
  /profile      → 401 → refreshTokenOnce() → await same promise ← WAIT

  Refresh done → all 3 get result → all 3 retry → all 3 succeed
```

### Auth Endpoint Skip

```
apiClient skips refresh logic for auth endpoints:

  POST /auth/login → 401 (wrong password)
    → skip refresh → throw ApiError(401) → show error in UI
    → NO page reload, NO redirect

  GET /accounts → 401 (token expired)
    → try refresh → if success: retry
                   → if fail: redirect /auth/login
```

---

**Note:** This project is built for learning and interview preparation purposes.
