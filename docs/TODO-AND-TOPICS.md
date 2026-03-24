# NAB Banking Portal - Product Backlog & Interview Topics

## Sprint Backlog

---

### Epic 1: Authentication

#### US-001: User Login
**As a** user
**I want to** login with email and password
**So that** I can access my banking account

**Acceptance Criteria:**
- [ ] Hiển thị form login với 2 fields: Email, Password
- [ ] Email validation: required, format email hợp lệ (regex)
- [ ] Password validation: required, minimum 6 ký tự
- [ ] Khi submit form invalid → hiển thị error message dưới mỗi field
- [ ] Khi submit form valid → call API, hiển thị loading spinner trên button
- [ ] Login thành công → lưu tokens, redirect về `/dashboard`
- [ ] Login thất bại → hiển thị error message "Email hoặc mật khẩu không đúng"
- [ ] Có link "Chưa có tài khoản? Đăng ký" → navigate đến `/register`

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

#### US-002: User Registration
**As a** new user
**I want to** create an account
**So that** I can use the banking portal

**Acceptance Criteria:**
- [ ] Form với 4 fields: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
- [ ] Họ tên: required, minimum 2 ký tự
- [ ] Email: required, format hợp lệ, chưa được đăng ký
- [ ] Mật khẩu: required, minimum 6 ký tự
- [ ] Xác nhận mật khẩu: phải khớp với Mật khẩu
- [ ] Submit thành công → auto login, redirect về `/dashboard`
- [ ] Email đã tồn tại → hiển thị "Email đã được đăng ký"
- [ ] Có link "Đã có tài khoản? Đăng nhập" → navigate đến `/login`

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

#### US-003: Auth State Management
**As a** developer
**I want to** centralized auth state
**So that** all components can access user info and auth status

**Acceptance Criteria:**
- [ ] Zustand store với state: `{ user, tokens, isAuthenticated, isLoading }`
- [ ] Actions: `login(tokens, user)`, `logout()`, `setUser(user)`
- [ ] Tokens được persist vào localStorage
- [ ] Khi app load → check localStorage, restore auth state
- [ ] `logout()` → clear localStorage, reset state, redirect `/login`
- [ ] Export hook `useAuth()` để components sử dụng

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/store/authStore.ts` |
| Library | Zustand với `persist` middleware |
| Storage Key | `nab-auth` |

---

#### US-004: Protected Routes
**As a** user
**I want to** secure pages require login
**So that** unauthorized users cannot access my data

**Acceptance Criteria:**
- [ ] Component `ProtectedRoute` wrap các routes cần auth
- [ ] Nếu `isAuthenticated = false` → redirect về `/login`
- [ ] Nếu đang loading auth state → hiển thị loading spinner
- [ ] Sau login thành công → redirect về trang user muốn truy cập ban đầu
- [ ] Routes public: `/login`, `/register`
- [ ] Routes protected: `/dashboard`, `/accounts`, `/accounts/:id`, `/transfer`, `/profile`

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/components/ProtectedRoute.tsx` |
| Pattern | HOC hoặc wrapper component |
| Redirect state | Lưu `returnUrl` để redirect sau login |

---

#### US-005: Auto Refresh Token
**As a** user
**I want to** stay logged in
**So that** I don't have to login repeatedly

**Acceptance Criteria:**
- [ ] Access token hết hạn sau 15 phút
- [ ] Trước khi access token hết hạn 1 phút → auto call refresh
- [ ] Refresh thành công → update tokens trong store
- [ ] Refresh thất bại (refresh token hết hạn) → logout, redirect `/login`
- [ ] Khi API trả về 401 → thử refresh token 1 lần, nếu fail → logout

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/utils/apiClient.ts` |
| API | `POST /api/auth/refresh` với body `{ refreshToken }` |
| Pattern | Axios interceptor hoặc fetch wrapper |

---

### Epic 2: Dashboard

#### US-006: Dashboard Overview
**As a** user
**I want to** see overview of my accounts
**So that** I can quickly check my financial status

**Acceptance Criteria:**
- [ ] Hiển thị tổng số dư tất cả tài khoản (format: 25.000.000 VND)
- [ ] Hiển thị số lượng tài khoản đang có
- [ ] Hiển thị 5 giao dịch gần nhất
- [ ] Mỗi giao dịch hiển thị: loại (deposit/withdraw/transfer), số tiền, mô tả, ngày giờ
- [ ] Loading state: hiển thị Skeleton cho từng section
- [ ] Error state: hiển thị Alert với nút "Thử lại"
- [ ] Click vào tài khoản → navigate đến `/accounts/:id`
- [ ] Click "Xem tất cả giao dịch" → navigate đến `/accounts`

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

### Epic 3: Accounts Management

#### US-007: Accounts List
**As a** user
**I want to** see all my accounts
**So that** I can manage my money

**Acceptance Criteria:**
- [ ] Hiển thị danh sách tất cả tài khoản của user
- [ ] Mỗi tài khoản hiển thị: tên, loại (savings/checking), số tài khoản, số dư
- [ ] Số tài khoản được mask: `****7890`
- [ ] Sort theo số dư giảm dần (mặc định)
- [ ] Loading: hiển thị 3 Skeleton cards
- [ ] Empty state: "Bạn chưa có tài khoản nào"
- [ ] Click vào account → navigate đến `/accounts/:id`

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

#### US-008: Account Detail & Transactions
**As a** user
**I want to** see account detail and transaction history
**So that** I can track my spending

**Acceptance Criteria:**
- [ ] Hiển thị thông tin tài khoản: tên, loại, số tài khoản đầy đủ, số dư
- [ ] Hiển thị danh sách giao dịch của tài khoản
- [ ] Mỗi giao dịch: icon theo loại, mô tả, ngày giờ, số tiền (+/- với màu xanh/đỏ)
- [ ] Pagination: 10 transactions/page, có nút "Xem thêm"
- [ ] Filter theo loại giao dịch: Tất cả, Nạp tiền, Rút tiền, Chuyển khoản
- [ ] Filter theo khoảng thời gian: 7 ngày, 30 ngày, 90 ngày, Tùy chọn
- [ ] Empty state: "Chưa có giao dịch nào"
- [ ] Nút "Chuyển khoản" → navigate đến `/transfer?from=:accountId`

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

### Epic 4: Money Transfer

#### US-009: Transfer Money
**As a** user
**I want to** transfer money between accounts
**So that** I can pay or send money to others

**Acceptance Criteria:**
- [ ] Form với fields: Từ tài khoản (dropdown), Số tài khoản đích, Số tiền, Nội dung
- [ ] Dropdown "Từ tài khoản" hiển thị tên + số dư
- [ ] Nếu URL có `?from=:accountId` → pre-select tài khoản đó
- [ ] Số tiền: required, > 0, <= số dư tài khoản nguồn
- [ ] Số tài khoản đích: required, 10-20 ký tự số, khác tài khoản nguồn
- [ ] Nội dung: optional, max 100 ký tự
- [ ] Hiển thị preview trước khi submit: từ, đến, số tiền, phí (nếu có)
- [ ] Xác nhận chuyển khoản bằng modal confirm
- [ ] Thành công → hiển thị thông báo + mã giao dịch, nút "Về Dashboard"
- [ ] Thất bại → hiển thị error message cụ thể
- [ ] Số dư không đủ → "Số dư không đủ để thực hiện giao dịch"

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

### Epic 5: User Profile

#### US-010: View & Edit Profile
**As a** user
**I want to** view and update my profile
**So that** my information is up to date

**Acceptance Criteria:**
- [ ] Hiển thị thông tin: Avatar (chữ cái đầu), Họ tên, Email, Ngày tạo tài khoản
- [ ] Email chỉ hiển thị, không cho edit
- [ ] Nút "Chỉnh sửa" → enable edit mode cho Họ tên
- [ ] Save thành công → hiển thị toast "Cập nhật thành công"
- [ ] Section đổi mật khẩu riêng với fields: Mật khẩu hiện tại, Mật khẩu mới, Xác nhận
- [ ] Mật khẩu mới phải khác mật khẩu hiện tại
- [ ] Đổi mật khẩu thành công → hiển thị toast, clear form

**Technical Notes:**
| Item | Detail |
|------|--------|
| File | `apps/shell/src/pages/Profile.tsx` |
| API GET | `GET /api/users/profile` |
| API PUT | `PUT /api/users/profile` với body `{ name }` |
| API PUT | `PUT /api/users/password` với body `{ currentPassword, newPassword }` |
| Components | `Input`, `Button`, `Avatar`, `Card`, `Alert` |

---

### Epic 6: Micro-frontend Remotes

#### US-011: Dashboard Remote Module
**As a** developer
**I want to** separate Dashboard into remote module
**So that** it can be deployed independently

**Acceptance Criteria:**
- [ ] Tạo `apps/dashboard/` với Rspack + Module Federation config
- [ ] Expose components: `DashboardPage`, `DashboardWidget`
- [ ] `DashboardWidget`: compact version hiển thị total balance + quick actions
- [ ] Shell app load Dashboard remote dynamically
- [ ] Fallback UI khi remote chưa load xong
- [ ] Error boundary khi remote load fail
- [ ] Shared dependencies: React, react-router, @nab/shared-ui

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/dashboard/rspack.config.ts`, `apps/dashboard/src/index.tsx` |
| Port | 3001 |
| Remote Entry | `dashboard@http://localhost:3001/remoteEntry.js` |
| Shell Config | Update `apps/shell/rspack.config.ts` remotes |

---

#### US-012: Accounts Remote Module
**As a** developer
**I want to** separate Accounts into remote module
**So that** it can be deployed independently

**Acceptance Criteria:**
- [ ] Tạo `apps/accounts/` với Rspack + Module Federation config
- [ ] Expose: `AccountsPage`, `AccountDetailPage`, `TransferPage`
- [ ] Shell app consume via dynamic import với React.lazy
- [ ] Routing vẫn hoạt động khi navigate giữa các pages
- [ ] Auth state được share từ shell (không duplicate)
- [ ] Loading fallback cho mỗi lazy component

**Technical Notes:**
| Item | Detail |
|------|--------|
| Files | `apps/accounts/rspack.config.ts` |
| Port | 3002 |
| Remote Entry | `accounts@http://localhost:3002/remoteEntry.js` |
| Shared State | Props drilling hoặc shared Zustand store |

---

### Epic 7: Testing

#### US-013: Unit Tests - Shared UI Components
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

#### US-014: Integration Tests - Auth Flow
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

#### US-015: E2E Tests
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

### Epic 8: DevOps & Infrastructure

#### US-016: Nx Migration
**As a** developer
**I want to** migrate to Nx monorepo
**So that** builds are faster with caching

**Acceptance Criteria:**
- [ ] Install và init Nx trong existing monorepo
- [ ] Configure project.json cho shell, shared-ui, bff
- [ ] `nx build shell` hoạt động với cache
- [ ] `nx affected:build` chỉ build packages thay đổi
- [ ] `nx graph` hiển thị dependency graph
- [ ] CI sử dụng Nx Cloud cache (optional)

**Technical Notes:**
| Item | Detail |
|------|--------|
| Commands | `pnpm add -D nx @nx/js`, `nx init` |
| Files | `nx.json`, `apps/*/project.json` |

---

#### US-017: CI/CD Pipeline
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
