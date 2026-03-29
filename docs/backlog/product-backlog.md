# NAB Banking Portal - Product Backlog & Interview Topics

> **Last updated:** 2026-03-29 (session 2)

## Progress Summary

| Epic | User Stories | Status | Notes |
|------|-------------|--------|-------|
| Epic 1: Authentication | US-001 ~ US-005 | ✅ Done | Login/Register with RHF+Zod, GuestRoute, ProtectedRoute, role-based redirect, apiClient refresh token with mutex |
| Epic 2: Dashboard | US-006 | 🔶 UI Done | Mock data, remote module (port 3001). Admin có dashboard riêng (monitoring style) |
| Epic 3: Accounts | US-007 ~ US-008 | 🔶 UI Done | Mock data, remote module (port 3002). Filter by type/time range có trong BFF |
| Epic 4: Transfer | US-009 | 🔶 UI Done | Mock data, remote module (port 3003). 3-step flow UI hoàn chỉnh |
| Epic 5: Profile | US-010 | 🔶 UI Done | Mock data. BFF có change password endpoint. Chưa kết nối API |
| Epic 6: MF Remotes | US-011 ~ US-012+ | ✅ Done | 4 remotes: dashboard(3001), accounts(3002), transfer(3003), admin(3004). ErrorBoundary, type declarations, CORS |
| Epic 7: Testing | US-013 ~ US-015 | ⬜ Not Started | Jest setup sẵn cho shared-utils |
| Epic 8: DevOps | US-016 ~ US-017 | 🔶 Partial | Nx done, Docker Compose (postgres+redis+adminer), CI/CD chưa |

## What's Done

### BFF (Backend for Frontend) — Port 4000
- [x] Auth: login, register (message only), refresh token
- [x] Users: get/update profile, change password
- [x] Accounts: list, detail, transactions (paginated + filter by type/days)
- [x] Transfers: with DB transaction (BEGIN/COMMIT/ROLLBACK)
- [x] Dashboard: summary endpoint
- [x] Admin: list users, user accounts, all transactions
- [x] Zod input validation on all endpoints
- [x] JWT dual-token (access 15m + refresh 7d), role-based middleware
- [x] TypeScript clean (0 errors)

### Shell App — Port 3000
- [x] Auth pages: Login + Register (RHF + Zod validation)
- [x] AuthLayout (shared gradient bg + logo + card)
- [x] HomeLayout (nav bar, role-based nav links, user dropdown, mobile menu)
- [x] GuestRoute (redirect authenticated users away from login/register)
- [x] ProtectedRoute with allowedRoles (admin vs user route separation)
- [x] Toast notifications (success/error)
- [x] Home page (quick nav cards)
- [x] Profile page (UI only, mock data)
- [x] RemoteErrorBoundary for MF loading failures
- [x] apiClient with refresh token mutex + auth endpoint skip

### Remote Apps (Module Federation 2.0 + Rspack)
- [x] dashboard (3001): User dashboard — summary cards, account list, recent transactions
- [x] accounts (3002): Accounts list + Account Detail (filters, pagination, copy account number)
- [x] transfer (3003): 3-step transfer form (input → confirm → result)
- [x] admin (3004): Admin Dashboard (KPI cards, CSS bar/donut charts, activity feed) + User Management table

### Shared Packages
- [x] @nab/shared-ui: Button, Input, Card, Alert, Toast, Badge, Avatar, Skeleton, Icon (Eye/EyeOff), AccountCard, TransactionItem, AmountDisplay
- [x] @nab/shared-utils: apiClient, formatCurrency, formatDate, formatAccountNumber, formatTransactionAmount, isValidEmail, isValidPassword, constants
- [x] @nab/shared-types: User, Account, Transaction, Auth types, API response types, Permission types

## What's Remaining

### High Priority
- [ ] Connect all pages to real BFF APIs (replace mock data)
- [ ] Unit tests: shared-ui components, shared-utils functions
- [ ] Integration tests: auth flow, transfer flow

### Medium Priority
- [ ] Dashboard remote: pass user data via shared zustand store (not mock)
- [ ] Profile page: connect to BFF (update name, change password)
- [ ] Admin: connect to BFF admin endpoints (real user list, real transactions)
- [ ] E2E tests with Playwright

### Low Priority
- [ ] DashboardWidget (compact version for shell)
- [ ] CI/CD pipeline
- [ ] Performance: lazy loading optimization, bundle analysis
- [ ] Accessibility audit (WCAG compliance check)

## Sprint Backlog

---

### Epic 1: Authentication ✅

#### US-001: User Login ✅
**As a** user
**I want to** login with email and password
**So that** I can access my banking account

**Acceptance Criteria:**
- [x] Hiển thị form login với 2 fields: Email, Password
- [x] Email validation: required, format email hợp lệ (regex)
- [x] Password validation: required, minimum 6 ký tự
- [x] Khi submit form invalid → hiển thị error message dưới mỗi field
- [x] Khi submit form valid → call API, hiển thị loading spinner trên button
- [x] Login thành công → lưu tokens, redirect về `/dashboard`
- [x] Login thất bại → hiển thị error message "Email hoặc mật khẩu không đúng"
- [x] Có link "Chưa có tài khoản? Đăng ký" → navigate đến `/register`

**UI Specifications:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    ┌─────────────────┐                      │
│                    │   NAB Logo      │                      │
│                    │   (80x80px)     │                      │
│                    └─────────────────┘                      │
│                                                             │
│                    Đăng nhập vào tài khoản                  │
│                    (text-xl, font-semibold)                 │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 📧 Email                                     │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ placeholder: "your@email.com"           │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     │ ⚠️ Email không hợp lệ (error state, red)   │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 🔒 Mật khẩu                                  │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ ••••••••           👁️ toggle visibility │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     │ ⚠️ Mật khẩu tối thiểu 6 ký tự              │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │           🔄 Đăng nhập                      │        │
│     │     (primary button, full width)            │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│           Chưa có tài khoản? Đăng ký ngay                  │
│           (link color: primary-600)                         │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ ❌ Email hoặc mật khẩu không đúng          │        │
│     │     (Alert variant="error", chỉ hiện       │        │
│     │      khi login fail)                        │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: Centered card (max-width: 400px)
Background: Gradient từ primary-50 đến primary-100
Card: White background, border-radius: 16px, shadow-lg
Spacing: padding 32px, gap giữa fields 24px
```

**Component States:**
| State | UI Behavior |
|-------|-------------|
| Default | Form trống, button enabled |
| Typing | Real-time validation, border-primary khi focus |
| Invalid | Border-red, error message hiện dưới field |
| Submitting | Button disabled, spinner icon, text "Đang đăng nhập..." |
| Error | Alert đỏ phía trên form với error message |
| Success | Redirect ngay, không hiện gì |

**Responsive:**
| Breakpoint | Changes |
|------------|---------|
| Mobile (<640px) | Card full width, padding 24px |
| Tablet (640-1024px) | Card 400px centered |
| Desktop (>1024px) | Card 400px, có thể thêm illustration bên cạnh |

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Login.tsx` |
| API | `POST /api/auth/login` với body `{ email, password }` |
| Response | `{ success: true, data: { user, tokens: { accessToken, refreshToken } } }` |
| Components | `Input`, `Button`, `Alert` từ `@nab/shared-ui` |
| State | Lưu tokens vào `authStore` (Zustand) |

---

#### US-002: User Registration 🔶
**As a** new user
**I want to** create an account
**So that** I can use the banking portal

**Acceptance Criteria:**
- [x] Form với 4 fields: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
- [x] Họ tên: required, minimum 2 ký tự *(Zod: `.min(2, 'Họ tên phải có ít nhất 2 ký tự')`)*
- [x] Email: required, format hợp lệ, chưa được đăng ký
- [x] Mật khẩu: required, minimum 6 ký tự
- [x] Xác nhận mật khẩu: phải khớp với Mật khẩu *(Zod `.refine()` validation)*
- [ ] Submit thành công → auto login, redirect về `/dashboard` ❌ *Redirect về `/auth/login` + toast "Đăng ký thành công! Vui lòng đăng nhập."*
- [x] Email đã tồn tại → hiển thị "Email đã được đăng ký" *(409 error handling)*
- [x] Có link "Đã có tài khoản? Đăng nhập" → navigate đến `/auth/login`
- [ ] Password strength indicator ❌ *Chỉ có password match indicator (✓/✗), không có Weak/Medium/Strong*

**UI Specifications:**
```
┌─────────────────────────────────────────────────────────────┐
│                    ┌─────────────────┐                      │
│                    │   NAB Logo      │                      │
│                    └─────────────────┘                      │
│                                                             │
│                    Tạo tài khoản mới                        │
│                    (text-xl, font-semibold)                 │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 👤 Họ và tên                                 │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ placeholder: "Nguyễn Văn A"             │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 📧 Email                                     │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ placeholder: "your@email.com"           │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 🔒 Mật khẩu                                  │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ ••••••••           👁️                   │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     │ Password strength indicator:                │        │
│     │ [████░░░░░░] Trung bình                     │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │ 🔒 Xác nhận mật khẩu                        │        │
│     │ ┌─────────────────────────────────────────┐ │        │
│     │ │ ••••••••                                │ │        │
│     │ └─────────────────────────────────────────┘ │        │
│     │ ✅ Mật khẩu khớp (green) / ❌ Không khớp   │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│     ┌─────────────────────────────────────────────┐        │
│     │           Đăng ký                           │        │
│     │     (primary button, full width)            │        │
│     └─────────────────────────────────────────────┘        │
│                                                             │
│           Đã có tài khoản? Đăng nhập                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Layout: Tương tự Login page
Password Strength: Weak (đỏ) / Medium (vàng) / Strong (xanh)
```

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Register.tsx` |
| API | `POST /api/auth/register` với body `{ name, email, password }` |
| Response | `{ success: true, data: { user, tokens } }` |
| Error 409 | Email already registered |

---

#### US-003: Auth State Management 🔶
**As a** developer
**I want to** centralized auth state
**So that** all components can access user info and auth status

**Acceptance Criteria:**
- [x] Zustand store với state: `{ user, tokens, isAuthenticated, isLoading }` *(File: `apps/shell/src/stores/authStore.ts`)*
- [ ] Actions: `login(tokens, user)`, `logout()`, `setUser(user)` ⚠️ *Có `setAuth()` + `logout()` nhưng thiếu `setUser()` riêng. `isLoading` defined nhưng không có action set*
- [x] Tokens được persist vào localStorage *(Zustand `persist` middleware, key: `"nab-auth"`)*
- [x] Khi app load → check localStorage, restore auth state *(Zustand auto hydration)*
- [x] `logout()` → clear localStorage, reset state, redirect `/login`
- [x] Export hook `useAuthStore()` để components sử dụng

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/store/authStore.ts` |
| Library | Zustand với `persist` middleware |
| Storage Key | `nab-auth` |

---

#### US-004: Protected Routes 🔶
**As a** user
**I want to** secure pages require login
**So that** unauthorized users cannot access my data

**Acceptance Criteria:**
- [x] Component `ProtectedRoute` wrap các routes cần auth *(+ role-based + permission-based)*
- [x] Nếu `isAuthenticated = false` → redirect về `/auth/login` với `returnUrl` state
- [ ] Nếu đang loading auth state → hiển thị loading spinner ⚠️ *Chỉ render `<div>Loading...</div>`, không có spinner component*
- [ ] Sau login thành công → redirect về trang user muốn truy cập ban đầu ❌ *`returnUrl` được truyền qua state nhưng Login page KHÔNG đọc/sử dụng — luôn redirect cứng theo role*
- [x] Routes public: `/auth/login`, `/auth/register` *(wrapped bởi `GuestRoute`)*
- [x] Routes protected: `/dashboard`, `/accounts`, `/accounts/:id`, `/transfer`, `/profile`
- [x] **Bonus:** Admin routes `/admin`, `/admin/users` với `allowedRoles=['admin']`

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/components/ProtectedRoute.tsx` |
| Pattern | HOC hoặc wrapper component |
| Redirect state | Lưu `returnUrl` để redirect sau login |

---

#### US-005: Auto Refresh Token 🔶
**As a** user
**I want to** stay logged in
**So that** I don't have to login repeatedly

**Acceptance Criteria:**
- [x] Access token hết hạn sau 15 phút *(BFF: `ACCESS_TOKEN_EXPIRES_IN = "15m"`)*
- [ ] Trước khi access token hết hạn 1 phút → auto call refresh ❌ *Không có proactive refresh, chỉ reactive khi gặp 401*
- [ ] Refresh thành công → update tokens trong store ❌ **BUG CRITICAL:** `refreshToken()` gửi POST rỗng (không gửi refreshToken trong body) → BFF trả 400. Response mới cũng không được lưu vào store
- [ ] Refresh thất bại (refresh token hết hạn) → logout, redirect `/login` ⚠️ *Hard redirect `window.location.href` thay vì gọi `authStore.logout()`*
- [x] Khi API trả về 401 → thử refresh token 1 lần, nếu fail → redirect *(có request dedup tốt)*

> **🐛 CRITICAL BUG:** `apiClient.ts` gọi `POST /auth/refresh` nhưng không gửi `refreshToken` trong body. BFF expect `req.body.refreshToken` → sẽ luôn trả 400. Cần fix: lấy token từ authStore rồi gửi trong body

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/utils/apiClient.ts` |
| API | `POST /api/auth/refresh` với body `{ refreshToken }` |
| Pattern | Axios interceptor hoặc fetch wrapper |

---

### Epic 2: Dashboard ✅

#### US-006: Dashboard Overview ✅
**As a** user
**I want to** see overview of my accounts
**So that** I can quickly check my financial status

**Acceptance Criteria:**
- [x] Hiển thị tổng số dư tất cả tài khoản (format: 25.000.000 VND)
- [x] Hiển thị số lượng tài khoản đang có
- [x] Hiển thị 5 giao dịch gần nhất
- [x] Mỗi giao dịch hiển thị: loại (deposit/withdraw/transfer), số tiền, mô tả, ngày giờ
- [x] Loading state: hiển thị Skeleton cho từng section
- [ ] Error state: hiển thị Alert với nút "Thử lại" ⚠️ *Chưa có error state UI*
- [x] Click vào tài khoản → navigate đến `/accounts/:id`
- [x] Click "Xem tất cả giao dịch" → navigate đến `/accounts`

> **Note:** Đang dùng mock data, chưa kết nối API `/api/dashboard/summary`

**UI Specifications:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header (sticky)                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ NAB Logo    Dashboard  Accounts  Transfer    🔔    👤 Nguyễn Văn A ▼   │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ Main Content (padding: 24px)                                                 │
│                                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │  Chào mừng trở lại, Nguyễn Văn A! 👋                                    │  │
│ │  (text-2xl, font-bold)                                                  │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─────────── Summary Cards (Grid: 3 columns, gap: 24px) ─────────────────┐  │
│ │                                                                         │  │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐            │  │
│ │ │ 💰 Tổng số dư   │ │ 🏦 Tài khoản   │ │ 📊 Giao dịch   │            │  │
│ │ │                 │ │                 │ │    tháng này   │            │  │
│ │ │ 125.500.000     │ │      3          │ │     47         │            │  │
│ │ │ VND             │ │   tài khoản     │ │   giao dịch    │            │  │
│ │ │                 │ │                 │ │                 │            │  │
│ │ │ ↑ 12.5% so với  │ │                 │ │ ↓ 5% so với    │            │  │
│ │ │   tháng trước   │ │                 │ │   tháng trước  │            │  │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘            │  │
│ │                                                                         │  │
│ │ Card style: gradient background (primary-500 → primary-600)            │  │
│ │ Text: white, số tiền font-bold text-3xl                                │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─────────── Content Grid (2 columns on desktop) ────────────────────────┐  │
│ │                                                                         │  │
│ │ ┌─────────────────────────────┐ ┌─────────────────────────────────────┐ │  │
│ │ │ Tài khoản của tôi      →   │ │ Giao dịch gần đây              →   │ │  │
│ │ ├─────────────────────────────┤ ├─────────────────────────────────────┤ │  │
│ │ │                             │ │                                     │ │  │
│ │ │ ┌─────────────────────────┐ │ │ ┌─────────────────────────────────┐ │ │  │
│ │ │ │ 🏦 Tài khoản tiết kiệm  │ │ │ │ ↓ Lương tháng 3                │ │ │  │
│ │ │ │    ****7890             │ │ │ │   + 15.000.000 VND             │ │ │  │
│ │ │ │    75.000.000 VND       │ │ │ │   25/03/2026 09:00  (green)    │ │ │  │
│ │ │ └─────────────────────────┘ │ │ └─────────────────────────────────┘ │ │  │
│ │ │                             │ │                                     │ │  │
│ │ │ ┌─────────────────────────┐ │ │ ┌─────────────────────────────────┐ │ │  │
│ │ │ │ 💳 Tài khoản thanh toán │ │ │ │ ↑ Thanh toán điện             │ │ │  │
│ │ │ │    ****1234             │ │ │ │   - 500.000 VND                │ │ │  │
│ │ │ │    50.500.000 VND       │ │ │ │   24/03/2026 14:30  (red)      │ │ │  │
│ │ │ └─────────────────────────┘ │ │ └─────────────────────────────────┘ │ │  │
│ │ │                             │ │                                     │ │  │
│ │ │ [+ Xem tất cả tài khoản]   │ │ [Xem tất cả giao dịch →]           │ │  │
│ │ └─────────────────────────────┘ └─────────────────────────────────────┘ │  │
│ │                                                                         │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│ ┌─────────── Quick Actions ──────────────────────────────────────────────┐  │
│ │                                                                         │  │
│ │   [💸 Chuyển khoản]   [📥 Nạp tiền]   [📤 Rút tiền]   [📜 Lịch sử]   │  │
│ │                                                                         │  │
│ │   Button style: outline, icon + text, hover: fill primary              │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Responsive:
- Mobile: Single column, summary cards scroll horizontal
- Tablet: 2 columns grid
- Desktop: 2-3 columns, sidebar navigation
```

**Loading State:**
```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ ░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░ │ │ ░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░       │ │ ░░░░░           │ │ ░░░░░░░         │
│ ░░░░░░░░░░░░░   │ │ ░░░░░░░░░       │ │ ░░░░░░░░░░      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
(Skeleton cards với animation shimmer)
```

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Dashboard.tsx` |
| API | `GET /api/dashboard/summary` |
| Response | `{ totalBalance, accountCount, recentTransactions: [...] }` |
| Components | `Card`, `AccountCard`, `TransactionItem`, `Skeleton`, `Alert` |

---

### Epic 3: Accounts Management ✅

#### US-007: Accounts List ✅
**As a** user
**I want to** see all my accounts
**So that** I can manage my money

**Acceptance Criteria:**
- [x] Hiển thị danh sách tất cả tài khoản của user
- [x] Mỗi tài khoản hiển thị: tên, loại (savings/checking), số tài khoản, số dư
- [x] Số tài khoản được mask: `****7890`
- [ ] Sort theo số dư giảm dần (mặc định) ❌ *Mock data không được sort — hiển thị theo thứ tự array*
- [x] Loading: hiển thị 3 Skeleton cards *(LOADING_SKELETON_COUNT = 3)*
- [x] Empty state: "Bạn chưa có tài khoản nào" *(có icon 🏦 + hint text)*
- [x] Click vào account → navigate đến `/accounts/:id`

> **Note:** Đang dùng mock data (5 accounts), chưa kết nối API

**UI Specifications:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Tài khoản của tôi                     [+ Mở tài khoản mới] (optional)     │
│   (text-2xl, font-bold)                  (outline button)                    │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Tổng số dư: 125.500.000 VND                    3 tài khoản         │   │
│   │ (text-lg, color: gray-600)                                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────── Account Cards Grid (gap: 16px) ──────────────────────────┐   │
│   │                                                                      │   │
│   │   ┌────────────────────────────────────────────────────────────┐    │   │
│   │   │  🏦                                                         │    │   │
│   │   │  Tài khoản tiết kiệm                    [Badge: Savings]   │    │   │
│   │   │  ****7890                                                   │    │   │
│   │   │                                                             │    │   │
│   │   │  75.000.000 VND                                            │    │   │
│   │   │  (text-2xl, font-bold, color: primary-600)                 │    │   │
│   │   │                                                             │    │   │
│   │   │  ──────────────────────────────────────────────────────    │    │   │
│   │   │  Giao dịch gần nhất: -500.000 VND (24/03)    [→]          │    │   │
│   │   └────────────────────────────────────────────────────────────┘    │   │
│   │                                                                      │   │
│   │   ┌────────────────────────────────────────────────────────────┐    │   │
│   │   │  💳                                                         │    │   │
│   │   │  Tài khoản thanh toán                   [Badge: Checking]  │    │   │
│   │   │  ****1234                                                   │    │   │
│   │   │                                                             │    │   │
│   │   │  50.500.000 VND                                            │    │   │
│   │   │                                                             │    │   │
│   │   │  ──────────────────────────────────────────────────────    │    │   │
│   │   │  Giao dịch gần nhất: +15.000.000 VND (25/03)   [→]        │    │   │
│   │   └────────────────────────────────────────────────────────────┘    │   │
│   │                                                                      │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Empty State (khi không có tài khoản):                                     │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         🏦                                          │   │
│   │              Bạn chưa có tài khoản nào                              │   │
│   │              Liên hệ ngân hàng để mở tài khoản                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Card hover: shadow-lg, border-primary-200, cursor-pointer
Badge colors: Savings (green), Checking (blue), Credit (purple)
Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop
```

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Accounts.tsx` |
| API | `GET /api/accounts` |
| Response | `{ accounts: [{ id, name, type, accountNumber, balance, currency }] }` |
| Components | `AccountCard`, `Skeleton` |

---

#### US-008: Account Detail & Transactions ✅
**As a** user
**I want to** see account detail and transaction history
**So that** I can track my spending

**Acceptance Criteria:**
- [x] Hiển thị thông tin tài khoản: tên, loại, số tài khoản đầy đủ, số dư
- [x] Hiển thị danh sách giao dịch của tài khoản
- [x] Mỗi giao dịch: icon theo loại, mô tả, ngày giờ, số tiền (+/- với màu xanh/đỏ)
- [x] Pagination: 10 transactions/page, có nút "Xem thêm"
- [x] Filter theo loại giao dịch: Tất cả, Nạp tiền, Rút tiền, Chuyển khoản
- [x] Filter theo khoảng thời gian: 7 ngày, 30 ngày, 90 ngày, Tùy chọn
- [x] Empty state ⚠️ *Text hơi khác: "Không có giao dịch nào trong khoảng thời gian này." thay vì "Chưa có giao dịch nào"*
- [x] Nút "Chuyển khoản" → navigate đến `/transfer?from=:accountId`
- [x] **Bonus:** Copy account number to clipboard với visual feedback (✓ 2 giây)

> **Note:** Đang dùng mock data (30 transactions), transactions grouped by date

**UI Specifications:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Quay lại                                               [💸 Chuyển khoản] │
│  (back button)                                            (primary button)   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Account Info Card (gradient background: primary-500 → primary-700)     │ │
│  │                                                                         │ │
│  │  🏦 Tài khoản tiết kiệm                              [Badge: Active]   │ │
│  │                                                                         │ │
│  │  Số tài khoản: 0123 4567 8901 2345                                     │ │
│  │  (có nút copy 📋)                                                       │ │
│  │                                                                         │ │
│  │  Số dư khả dụng                                                        │ │
│  │  75.000.000 VND                                                        │ │
│  │  (text-4xl, font-bold, white)                                          │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Lịch sử giao dịch                                                      │ │
│  │                                                                         │ │
│  │  Filters:                                                               │ │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │ │
│  │  │ Loại giao dịch ▼ │  │ Thời gian ▼      │  │ 🔍 Tìm kiếm...   │      │ │
│  │  │ ○ Tất cả         │  │ ○ 7 ngày         │  └──────────────────┘      │ │
│  │  │ ○ Nạp tiền       │  │ ● 30 ngày        │                            │ │
│  │  │ ○ Rút tiền       │  │ ○ 90 ngày        │                            │ │
│  │  │ ○ Chuyển khoản   │  │ ○ Tùy chọn...    │                            │ │
│  │  └──────────────────┘  └──────────────────┘                            │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  📅 Hôm nay - 25/03/2026                                        │   │ │
│  │  ├─────────────────────────────────────────────────────────────────┤   │ │
│  │  │  ↓   Lương tháng 3                      + 15.000.000 VND       │   │ │
│  │  │      Công ty ABC                         09:00  ✓ Hoàn thành   │   │ │
│  │  │      (deposit icon green)                (green text)           │   │ │
│  │  ├─────────────────────────────────────────────────────────────────┤   │ │
│  │  │  ↑   Thanh toán điện                    - 500.000 VND          │   │ │
│  │  │      EVN HCM                             14:30  ✓ Hoàn thành   │   │ │
│  │  │      (withdraw icon red)                 (red text)             │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │  📅 Hôm qua - 24/03/2026                                        │   │ │
│  │  ├─────────────────────────────────────────────────────────────────┤   │ │
│  │  │  ↔   Chuyển khoản đến Nguyễn Văn B      - 2.000.000 VND        │   │ │
│  │  │      ****5678                            16:45  ✓ Hoàn thành   │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                         │ │
│  │           [Xem thêm giao dịch] (outline button)                        │ │
│  │            Đang hiển thị 10/47 giao dịch                               │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

Transaction grouping: Group by date
Transaction icons: ↓ deposit (green), ↑ withdraw (red), ↔ transfer (blue)
Amount colors: positive green-600, negative red-600
```

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/AccountDetail.tsx` |
| Route | `/accounts/:id` |
| API 1 | `GET /api/accounts/:id` |
| API 2 | `GET /api/accounts/:id/transactions?page=1&limit=10&type=all&days=30` |
| Components | `Card`, `TransactionItem`, `Badge`, `Button` |

---

### Epic 4: Money Transfer ✅

#### US-009: Transfer Money ✅
**As a** user
**I want to** transfer money between accounts
**So that** I can pay or send money to others

**Acceptance Criteria:**
- [x] Form với fields: Từ tài khoản (dropdown), Số tài khoản đích, Số tiền, Nội dung
- [x] Dropdown "Từ tài khoản" hiển thị tên + số dư
- [x] Nếu URL có `?from=:accountId` → pre-select tài khoản đó
- [x] Số tiền: required, > 0, <= số dư tài khoản nguồn
- [ ] Số tài khoản đích: required, 9-14 ký tự số ⚠️ *Validate format OK nhưng thiếu check khác tài khoản nguồn*
- [x] Nội dung: optional, max 100 ký tự *(maxLength={100} + character counter)*
- [x] Hiển thị preview trước khi submit: từ, đến, số tiền, phí, tổng, nội dung *(Step 2)*
- [x] Xác nhận chuyển khoản bằng step-based flow (3 bước thay vì modal)
- [x] Thành công → hiển thị mã giao dịch + timestamp + nút "Về trang chủ" + "Chuyển khoản mới"
- [x] Thất bại → hiển thị Alert error message + nút "Thử lại" + "Về trang chủ"
- [x] Số dư không đủ → "Số dư không đủ để thực hiện giao dịch"

> **Note:** 3-step flow (Form → Confirm → Result) với ProgressIndicator. Mock 80% success rate. Quick amount buttons (100K, 500K, 1M, 2M, 5M). Thiếu: recipient lookup (tên + ngân hàng), download receipt, share button

**UI Specifications:**
```
STEP 1: FORM NHẬP THÔNG TIN
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   💸 Chuyển khoản                                                           │
│   (text-2xl, font-bold)                                                     │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  BƯỚC 1/3: Nhập thông tin                    ○───○───○              │   │
│   │                                               1   2   3              │   │
│   │  (progress indicator)                                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Từ tài khoản *                                                      │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  🏦 Tài khoản tiết kiệm - ****7890           ▼              │    │   │
│   │  │     Số dư: 75.000.000 VND                                   │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │                                                                      │   │
│   │  Dropdown options:                                                   │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  🏦 Tài khoản tiết kiệm - ****7890                          │    │   │
│   │  │     Số dư: 75.000.000 VND                      ✓            │    │   │
│   │  │  ─────────────────────────────────────────────────────────  │    │   │
│   │  │  💳 Tài khoản thanh toán - ****1234                         │    │   │
│   │  │     Số dư: 50.500.000 VND                                   │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Số tài khoản người nhận *                                           │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  0123456789012345                                            │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  ✓ Nguyễn Văn B - Ngân hàng ABC (auto lookup sau khi nhập đủ)      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Số tiền *                                                           │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  2.000.000                                          VND     │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  Quick amounts: [100K] [500K] [1M] [2M] [5M]                        │   │
│   │  Số dư sau giao dịch: 73.000.000 VND                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Nội dung chuyển khoản                                               │   │
│   │  ┌─────────────────────────────────────────────────────────────┐    │   │
│   │  │  Thanh toán tiền nhà tháng 3                                │    │   │
│   │  └─────────────────────────────────────────────────────────────┘    │   │
│   │  0/100 ký tự                                                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         [Tiếp tục →]                                │   │
│   │                    (primary button, full width)                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

STEP 2: XÁC NHẬN THÔNG TIN (Modal hoặc Page)
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  BƯỚC 2/3: Xác nhận thông tin                ○───●───○              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │   Từ tài khoản                                                       │   │
│   │   🏦 Tài khoản tiết kiệm - ****7890                                 │   │
│   │                                                                      │   │
│   │   ─────────────────── ↓ ───────────────────                         │   │
│   │                                                                      │   │
│   │   Đến tài khoản                                                      │   │
│   │   👤 Nguyễn Văn B                                                   │   │
│   │   0123 4567 8901 2345 - Ngân hàng ABC                               │   │
│   │                                                                      │   │
│   │   ═══════════════════════════════════════════════════════════════   │   │
│   │                                                                      │   │
│   │   Số tiền chuyển                           2.000.000 VND            │   │
│   │   Phí giao dịch                                    0 VND            │   │
│   │   ───────────────────────────────────────────────────────           │   │
│   │   Tổng cộng                                2.000.000 VND            │   │
│   │   (text-xl, font-bold, primary-600)                                 │   │
│   │                                                                      │   │
│   │   Nội dung: Thanh toán tiền nhà tháng 3                             │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ⚠️ Vui lòng kiểm tra kỹ thông tin trước khi xác nhận                     │
│                                                                              │
│   ┌────────────────────────┐  ┌────────────────────────────────────────┐   │
│   │     ← Quay lại         │  │         Xác nhận chuyển khoản         │   │
│   │    (outline button)    │  │         (primary button)               │   │
│   └────────────────────────┘  └────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

STEP 3: KẾT QUẢ
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │                            ✅                                        │   │
│   │                    (icon lớn, animated)                              │   │
│   │                                                                      │   │
│   │                  Chuyển khoản thành công!                           │   │
│   │                  (text-2xl, font-bold, green-600)                   │   │
│   │                                                                      │   │
│   │   ─────────────────────────────────────────────────────────────     │   │
│   │                                                                      │   │
│   │   Mã giao dịch: TXN-2026032512345                                   │   │
│   │   Thời gian: 25/03/2026 15:30:45                                    │   │
│   │   Số tiền: 2.000.000 VND                                            │   │
│   │   Người nhận: Nguyễn Văn B                                          │   │
│   │                                                                      │   │
│   │   ─────────────────────────────────────────────────────────────     │   │
│   │                                                                      │   │
│   │   [📥 Tải biên lai]  [📤 Chia sẻ]                                   │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌────────────────────────┐  ┌────────────────────────────────────────┐   │
│   │   Chuyển khoản mới     │  │         Về trang chủ                   │   │
│   │    (outline button)    │  │         (primary button)               │   │
│   └────────────────────────┘  └────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

ERROR STATE:
┌─────────────────────────────────────────────────────────────────────┐
│  ❌ Chuyển khoản thất bại                                           │
│                                                                      │
│  Lý do: Số dư không đủ để thực hiện giao dịch                       │
│  Số dư hiện tại: 75.000.000 VND                                     │
│  Số tiền cần: 80.000.000 VND                                        │
│                                                                      │
│  [Thử lại]  [Về trang chủ]                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Transfer.tsx` |
| API GET | `GET /api/accounts` (populate dropdown) |
| API POST | `POST /api/transfers` với body `{ fromAccountId, toAccountId, amount, description }` |
| Response | `{ transaction: { id, amount, status, createdAt } }` |
| Error 400 | Insufficient balance, Same account, Invalid amount |
| Components | `Input`, `Button`, `Alert`, `Card`, Modal component |

---

### Epic 5: User Profile ✅

#### US-010: View & Edit Profile 🔶
**As a** user
**I want to** view and update my profile
**So that** my information is up to date

**Acceptance Criteria:**
- [x] Hiển thị thông tin: Avatar (chữ cái đầu), Họ tên, Email, Ngày tạo tài khoản *(Avatar component size="xl")*
- [x] Email chỉ hiển thị, không cho edit *(render as `<span>`, không phải input)*
- [x] Nút "Chỉnh sửa" → enable edit mode cho Họ tên *(local state: isEditing + editedName)*
- [ ] Save thành công → hiển thị toast "Cập nhật thành công" ❌ *`handleSaveName()` chỉ `setIsEditing(false)` — comment "In real scenario, call API". Toast component tồn tại trong shared-ui nhưng không import/dùng*
- [x] Section đổi mật khẩu riêng với fields: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận *(3 fields + visibility toggles)*
- [ ] Mật khẩu mới phải khác mật khẩu hiện tại ❌ *Không có validation, chỉ check all fields filled*
- [ ] Đổi mật khẩu thành công → hiển thị toast, clear form ❌ *`handleChangePassword()` chỉ reset state — comment "In real scenario, call API"*

> **Note:** UI hoàn chỉnh nhưng hoàn toàn UI-only. Cần: import Toast, kết nối API `PUT /api/users/profile` + `POST /api/users/change-password`, thêm validation new !== current password

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Profile.tsx` |
| API GET | `GET /api/users/profile` |
| API PUT | `PUT /api/users/profile` với body `{ name }` |
| API PUT | `PUT /api/users/password` với body `{ currentPassword, newPassword }` |
| Components | `Input`, `Button`, `Avatar`, `Card`, `Alert` |

---

### Epic 6: Micro-frontend Remotes ✅

#### US-011: Dashboard Remote Module 🔶
**As a** developer
**I want to** separate Dashboard into remote module
**So that** it can be deployed independently

**Acceptance Criteria:**
- [x] Tạo `apps/dashboard/` với Rspack + Module Federation config *(port 3001)*
- [ ] Expose components: `DashboardPage`, `DashboardWidget` ⚠️ *Chỉ expose `./DashboardPage`, không có Widget*
- [ ] `DashboardWidget`: compact version hiển thị total balance + quick actions ❌ *Không tồn tại*
- [x] Shell app load Dashboard remote dynamically *(React.lazy + Suspense)*
- [x] Fallback UI khi remote chưa load xong *(Suspense fallback)*
- [ ] Error boundary khi remote load fail ❌ *Không có ErrorBoundary component*
- [x] Shared dependencies: React, react-router, zustand *(singleton mode)*

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/dashboard/rspack.config.ts`, `apps/dashboard/src/index.tsx` |
| Port | 3001 |
| Remote Entry | `dashboard@http://localhost:3001/remoteEntry.js` |
| Shell Config | Update `apps/shell/rspack.config.ts` remotes |

---

#### US-012: Accounts Remote Module ✅
**As a** developer
**I want to** separate Accounts into remote module
**So that** it can be deployed independently

**Acceptance Criteria:**
- [x] Tạo `apps/accounts/` với Rspack + Module Federation config
- [x] Expose: `AccountsPage`, `AccountDetailPage` *(TransferPage tách thành remote riêng `apps/transfer/`)*
- [x] Shell app consume via dynamic import với React.lazy
- [x] Routing vẫn hoạt động khi navigate giữa các pages
- [x] Auth state được share từ shell (không duplicate)
- [x] Loading fallback cho mỗi lazy component

> **Note:** Ngoài backlog gốc, đã thêm 2 remote modules:
> - `apps/transfer/` (port 3003) - Transfer remote
> - `apps/admin/` (port 3004) - Admin remote (Dashboard + Users management)

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/accounts/rspack.config.ts` |
| Port | 3002 |
| Remote Entry | `accounts@http://localhost:3002/remoteEntry.js` |
| Shared State | Props drilling hoặc shared Zustand store |

---

### Epic 7: Testing ⬜

#### US-013: Unit Tests - Shared UI Components ⬜
**As a** developer
**I want to** unit test shared components
**So that** they work correctly across apps

**Acceptance Criteria:**
- [ ] **Button**: render đúng variant, click handler được gọi, disabled state, loading state
- [ ] **Input**: render với label, onChange handler, error state, disabled state
- [ ] **AccountCard**: render với props, format số tiền đúng, click handler
- [ ] **TransactionItem**: render đúng icon theo type, format ngày giờ, amount color
- [ ] **Alert**: render đúng variant, close button handler
- [ ] Coverage >= 80% cho shared-ui package

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `packages/shared-ui/src/components/**/*.test.tsx` |
| Commands | `pnpm --filter @nab/shared-ui test` |
| Tools | Jest, React Testing Library |

---

#### US-014: Integration Tests - Auth Flow ⬜
**As a** developer
**I want to** integration test auth flow
**So that** login/register works end-to-end

**Acceptance Criteria:**
- [ ] Test Login: render form → enter credentials → submit → verify redirect
- [ ] Test Login Error: invalid credentials → verify error message
- [ ] Test Register: fill form → submit → verify auto login + redirect
- [ ] Test Logout: click logout → verify redirect + state cleared
- [ ] Test Protected Route: access protected page without auth → verify redirect to login
- [ ] Mock API calls với MSW hoặc jest.mock

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/shell/src/__tests__/auth.integration.test.tsx` |
| Tools | Jest, RTL, MSW (Mock Service Worker) |

---

#### US-015: E2E Tests ⬜
**As a** QA
**I want to** E2E test critical user journeys
**So that** app works correctly in real browser

**Acceptance Criteria:**
- [ ] Setup Playwright với config cho multiple browsers
- [ ] **Auth E2E**: Register → Login → Verify dashboard → Logout
- [ ] **Transfer E2E**: Login → Go to transfer → Fill form → Submit → Verify success
- [ ] **Account E2E**: Login → View accounts → Click account → Verify transactions
- [ ] Tests chạy được trên CI (headless mode)
- [ ] Screenshot on failure

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/e2e/playwright.config.ts`, `apps/e2e/tests/*.spec.ts` |
| Commands | `pnpm --filter e2e test` |
| Base URL | `http://localhost:3000` |

---

### Epic 8: DevOps & Infrastructure 🔶

#### US-016: Nx Migration ✅
**As a** developer
**I want to** migrate to Nx monorepo
**So that** builds are faster with caching

**Acceptance Criteria:**
- [x] Install và init Nx trong existing monorepo
- [x] Configure project.json cho shell, shared-ui, bff
- [x] `nx build shell` hoạt động với cache
- [x] `nx affected:build` chỉ build packages thay đổi
- [x] `nx graph` hiển thị dependency graph
- [ ] CI sử dụng Nx Cloud cache (optional)

**Technical Notes:**
| Item | Detail |
|------|--------|
| Commands | `pnpm add -D nx @nx/js`, `nx init` |
| Files | `nx.json`, `apps/*/project.json` |

---

#### US-017: CI/CD Pipeline ⬜
**As a** developer
**I want to** automate build and test
**So that** code quality is ensured

**Acceptance Criteria:**
- [ ] GitHub Actions workflow trigger on PR và push to main
- [ ] Steps: Install → Lint → Test → Build
- [ ] Cache node_modules và Nx cache
- [ ] Fail PR nếu tests fail
- [ ] Deploy preview cho PR (Vercel/Netlify)
- [ ] Deploy production khi merge to main

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `.github/workflows/ci.yml` |
| Secrets | `VERCEL_TOKEN`, `NX_CLOUD_ACCESS_TOKEN` (optional) |

---

## Interview Topics Mapping

| Topic | User Story liên quan | Concepts cần nắm |
|-------|---------------------|------------------|
| **JavaScript Fundamentals** | | |
| Closures | US-003 Auth Store | Lexical scope, private variables, memory |
| Promises/Async | US-005 Refresh Token | Promise chain, async/await, error handling |
| Event Loop | US-006 Dashboard | Call stack, task queue, microtasks |
| Array Methods | US-007 Accounts List | map, filter, reduce, sort |
| **React** | | |
| useState/useEffect | US-001 Login | State updates, dependency array, cleanup |
| useContext | US-003 Auth Store | Provider pattern, context optimization |
| useMemo/useCallback | US-007 Accounts List | Referential equality, dependency tracking |
| Custom Hooks | US-005, US-009 | Logic reuse, hook rules, composition |
| React.lazy/Suspense | US-011, US-012 | Code splitting, loading states |
| Error Boundary | US-011 Remote | componentDidCatch, fallback UI |
| **TypeScript** | | |
| Interfaces | US-001, US-006 | Props typing, API responses |
| Generics | US-003 Store | Reusable type patterns |
| Utility Types | US-010 Profile | Partial, Omit, Pick, Required |
| Type Guards | US-005 API Client | Runtime type checking |
| **CSS** | | |
| Flexbox | US-006 Dashboard | Main axis, cross axis, flex properties |
| Grid | US-007 Accounts | Grid template, gap, responsive |
| CSS Modules | All UI tasks | Scoping, composition, variables |
| BEM | Shared UI | Block, Element, Modifier naming |
| **Module Federation** | | |
| Host/Remote | US-011, US-012 | Container, remote entry, shared scope |
| Shared Dependencies | US-011 | Singleton, version matching |
| Bootstrap Pattern | US-011 | Async boundary, dynamic imports |
| **State Management** | | |
| Zustand | US-003, US-009 | Store creation, selectors, middleware |
| Persist | US-003 | localStorage, migration, partial |
| **Testing** | | |
| Jest | US-013 | Matchers, mocking, async tests |
| RTL | US-013, US-014 | Queries, user events, waitFor |
| Playwright | US-015 | Locators, actions, assertions |
| **BFF/Backend** | | |
| Layered Architecture | All APIs | Separation of concerns, dependency injection |
| JWT | US-001, US-005 | Token structure, signing, verification |
| REST Design | All APIs | Resources, HTTP methods, status codes |
| **Accessibility** | | |
| Semantic HTML | US-006, US-007 | Landmarks, headings, lists |
| ARIA | US-001 Forms | Labels, live regions, roles |
| Keyboard | US-009 Transfer | Focus management, tab order |

---

## Remaining Work / Known Gaps

### 🐛 Bugs

| Item | Severity | File | Notes |
|------|----------|------|-------|
| Token refresh gửi body rỗng | **CRITICAL** | `packages/shared-utils/src/apiClient.ts` | BFF expect `req.body.refreshToken` nhưng client gửi POST rỗng → luôn 400. Cần lấy token từ authStore |
| Refresh không lưu token mới | **CRITICAL** | `packages/shared-utils/src/apiClient.ts` | Response mới không được parse/lưu vào authStore |
| Hard redirect thay vì logout | High | `packages/shared-utils/src/apiClient.ts` | `window.location.href` thay vì `authStore.logout()` |
| Login không đọc returnUrl | Medium | `apps/shell/src/pages/Auth/Login/Login.tsx` | ProtectedRoute truyền `returnUrl` nhưng Login page không dùng |

### ⚠️ Missing Features

| Item | Priority | Notes |
|------|----------|-------|
| Kết nối API thật (thay mock data) | High | Dashboard, Accounts, Transfer, Admin đang dùng mock |
| Profile API integration | High | `handleSaveName()` + `handleChangePassword()` chỉ là stub |
| Profile: import Toast component | Medium | Toast tồn tại trong shared-ui nhưng không import |
| Accounts sort by balance | Medium | Mock data không sorted, cần `.sort((a,b) => b.balance - a.balance)` |
| ErrorBoundary cho remote modules | Medium | Không có fallback UI khi remote fail |
| Dashboard error state | Medium | Không có Alert + "Thử lại" button |
| Password strength indicator | Low | Register page thiếu Weak/Medium/Strong indicator |
| DashboardWidget compact | Low | Chỉ có full page, không có widget |
| Auto login sau register | Low | Redirect về `/auth/login` thay vì auto login |
| Transfer: check recipient ≠ source | Low | Validate format OK nhưng không check trùng |
| Transfer: recipient name lookup | Low | Spec có auto-lookup tên + ngân hàng nhưng chưa implement |
| Loading spinner cho ProtectedRoute | Low | Chỉ render `<div>Loading...</div>` |
| Profile: validate new ≠ current password | Low | Không check mật khẩu mới khác cũ |

### ⬜ Not Started

| Item | Priority | Notes |
|------|----------|-------|
| Unit Tests (US-013) | High | shared-ui components chưa có test nào |
| Integration Tests (US-014) | High | Auth flow chưa có test |
| E2E Tests (US-015) | Medium | Playwright chưa setup |
| CI/CD Pipeline (US-017) | Low | GitHub Actions chưa có |

## Definition of Done (DoD)

Mỗi User Story được coi là DONE khi:
- [ ] Code được implement đầy đủ theo Acceptance Criteria
- [ ] TypeScript không có errors (`tsc --noEmit`)
- [ ] Unit tests passed với coverage >= 80%
- [ ] Code review approved
- [ ] Responsive trên mobile (320px) và desktop (1440px)
- [ ] Accessibility: có thể navigate bằng keyboard
- [ ] Loading và error states được handle
- [ ] Commit message theo conventional commits
