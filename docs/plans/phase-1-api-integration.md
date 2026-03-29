# Phase 1: API Integration Plan

> Tích hợp BFF API vào frontend, kết nối dữ liệu thực cho toàn bộ modules.

## Dependency Graph

```
P1-01 (Zustand Store) ──┐
                         ├──→ P1-03 (Dashboard API)
                         ├──→ P1-04 (Accounts List)
                         ├──→ P1-05 (Account Detail)
P1-02 (useApi Hook) ────┤    P1-06 (Account Transactions)
                         ├──→ P1-07 (Transfer API)
                         ├──→ P1-08 (Admin Dashboard API)
                         ├──→ P1-09 (Admin Users API)
                         └──→ P1-10 (Profile API)

Thứ tự: P1-01 + P1-02 hoàn thành trước → P1-03 đến P1-10 chạy song song
```

---

## P1-01: Shared Zustand Store

| Field | Detail |
|---|---|
| **Task ID** | P1-01 |
| **Mô tả** | Tạo Zustand store dùng chung cho server state management. Cung cấp caching, loading states, error handling chuẩn cho toàn bộ API calls. |
| **Files cần tạo/sửa** | `packages/shared-utils/src/stores/apiStore.ts` (tạo mới), `packages/shared-utils/src/stores/index.ts` (tạo mới), `packages/shared-utils/src/index.ts` (sửa - export stores) |
| **API endpoint** | N/A - infrastructure layer |
| **Dependencies** | Không |

**Acceptance Criteria:**
- [ ] Zustand store khởi tạo với generic type cho data, loading, error
- [ ] Hỗ trợ `setData`, `setLoading`, `setError`, `reset` actions
- [ ] Cache layer với TTL configurable (default 5 phút)
- [ ] Devtools middleware enabled trong development
- [ ] Unit test cho store actions và cache invalidation
- [ ] Export từ `shared-utils` package

---

## P1-02: useApi Hook

| Field | Detail |
|---|---|
| **Task ID** | P1-02 |
| **Mô tả** | Custom hook bọc apiClient, tự động quản lý loading/error state, tích hợp với Zustand store. Hỗ trợ GET/POST/PUT/PATCH/DELETE. |
| **Files cần tạo/sửa** | `packages/shared-utils/src/hooks/useApi.ts` (tạo mới), `packages/shared-utils/src/hooks/index.ts` (tạo mới), `packages/shared-utils/src/api/apiClient.ts` (sửa - thêm patch method) |
| **API endpoint** | N/A - infrastructure layer |
| **Dependencies** | P1-01 |

**Acceptance Criteria:**
- [ ] Hook trả về `{ data, loading, error, refetch, mutate }`
- [ ] Auto-cancel request khi component unmount (AbortController)
- [ ] Retry logic với exponential backoff (configurable, default 3 lần)
- [ ] Tích hợp Zustand store cho caching
- [ ] Generic TypeScript types: `useApi<TResponse, TPayload>`
- [ ] `apiClient` có đầy đủ methods: `get`, `post`, `put`, `patch`, `delete`
- [ ] Unit test cho hook với mock API responses

---

## P1-03: Dashboard API

| Field | Detail |
|---|---|
| **Task ID** | P1-03 |
| **Mô tả** | Kết nối Dashboard module với BFF API. Hiển thị tổng quan tài khoản, giao dịch gần đây, biểu đồ chi tiêu. |
| **Files cần tạo/sửa** | `apps/shell/src/stores/dashboardStore.ts` (tạo mới), `apps/shell/src/pages/Dashboard.tsx` (sửa), `apps/shell/src/hooks/useDashboard.ts` (tạo mới) |
| **API endpoint** | `GET /api/dashboard/summary` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Fetch dashboard summary data từ BFF
- [ ] Hiển thị total balance, số tài khoản active
- [ ] Hiển thị 5 giao dịch gần nhất
- [ ] Loading skeleton khi đang fetch
- [ ] Error boundary với retry button
- [ ] Data tự refresh mỗi 30 giây (configurable)
- [ ] Cache data trong Zustand store

---

## P1-04: Accounts List API

| Field | Detail |
|---|---|
| **Task ID** | P1-04 |
| **Mô tả** | Kết nối danh sách tài khoản với BFF. Hiển thị tất cả accounts của user với balance, type, status. |
| **Files cần tạo/sửa** | `apps/shell/src/stores/accountsStore.ts` (tạo mới), `apps/shell/src/pages/Accounts.tsx` (sửa), `apps/shell/src/hooks/useAccounts.ts` (tạo mới) |
| **API endpoint** | `GET /api/accounts` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Fetch danh sách accounts từ BFF
- [ ] Hiển thị account card với: tên, số tài khoản (masked), balance, type, status
- [ ] Filter theo account type (savings, checking, credit)
- [ ] Sort theo balance hoặc tên
- [ ] Loading skeleton cho list
- [ ] Empty state khi không có accounts
- [ ] Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)

---

## P1-05: Account Detail API

| Field | Detail |
|---|---|
| **Task ID** | P1-05 |
| **Mô tả** | Hiển thị chi tiết một tài khoản, bao gồm thông tin đầy đủ và overview giao dịch. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/AccountDetail.tsx` (tạo mới), `apps/shell/src/hooks/useAccountDetail.ts` (tạo mới) |
| **API endpoint** | `GET /api/accounts/:id` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Fetch account detail theo ID từ URL params
- [ ] Hiển thị: tên TK, số TK đầy đủ, balance, type, status, ngày mở
- [ ] Link đến transactions (P1-06)
- [ ] Link đến transfer (P1-07)
- [ ] 404 page khi account không tồn tại
- [ ] Loading state
- [ ] Breadcrumb navigation: Home > Accounts > [Account Name]

---

## P1-06: Account Transactions API (Filters + Pagination)

| Field | Detail |
|---|---|
| **Task ID** | P1-06 |
| **Mô tả** | Hiển thị lịch sử giao dịch của một tài khoản. Hỗ trợ filter theo loại, ngày, số tiền và pagination. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/Transactions.tsx` (tạo mới), `apps/shell/src/hooks/useTransactions.ts` (tạo mới), `apps/shell/src/components/TransactionFilters.tsx` (tạo mới), `apps/shell/src/components/Pagination.tsx` (tạo mới) |
| **API endpoint** | `GET /api/accounts/:id/transactions?type=&from=&to=&minAmount=&maxAmount=&page=&limit=` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Fetch transactions với query params từ BFF
- [ ] Filter theo: transaction type (credit/debit), date range, amount range
- [ ] Pagination: page size selector (10/20/50), page navigation
- [ ] Hiển thị: ngày, mô tả, số tiền (color-coded credit/debit), balance sau GD
- [ ] URL sync với filter state (dùng search params)
- [ ] Loading state cho table rows
- [ ] Empty state khi không có transactions phù hợp filter
- [ ] Debounce 300ms cho amount filter inputs

---

## P1-07: Transfer API

| Field | Detail |
|---|---|
| **Task ID** | P1-07 |
| **Mô tả** | Form chuyển tiền giữa các tài khoản. Bao gồm validation, confirmation step, và success/error handling. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/Transfer.tsx` (tạo mới), `apps/shell/src/hooks/useTransfer.ts` (tạo mới), `apps/shell/src/components/TransferForm.tsx` (tạo mới), `apps/shell/src/components/TransferConfirmation.tsx` (tạo mới) |
| **API endpoint** | `POST /api/transfers` |
| **Dependencies** | P1-01, P1-02, P1-04 (cần accounts list cho dropdown) |

**Acceptance Criteria:**
- [ ] Form fields: from account (dropdown), to account (input/dropdown), amount, description
- [ ] Client-side validation: required fields, amount > 0, amount <= balance, to != from
- [ ] Confirmation step trước khi submit (review transfer details)
- [ ] Submit transfer qua BFF API
- [ ] Success screen với transaction reference number
- [ ] Error handling: insufficient balance, invalid account, server error
- [ ] Disable submit button khi đang processing
- [ ] Accessibility: form labels, error messages linked to inputs

---

## P1-08: Admin Dashboard API

| Field | Detail |
|---|---|
| **Task ID** | P1-08 |
| **Mô tả** | Dashboard cho admin role. Hiển thị thống kê hệ thống: tổng users, tổng transactions, system health. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/admin/AdminDashboard.tsx` (tạo mới), `apps/shell/src/hooks/useAdminDashboard.ts` (tạo mới), `apps/shell/src/stores/adminStore.ts` (tạo mới) |
| **API endpoint** | `GET /api/admin/dashboard` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Chỉ accessible với role `admin`
- [ ] Hiển thị: tổng số users, users active, tổng transactions hôm nay, tổng giá trị GD
- [ ] Chart hiển thị transactions theo ngày (7 ngày gần nhất)
- [ ] Loading skeleton
- [ ] Auto-refresh mỗi 60 giây
- [ ] Redirect về home nếu không phải admin

---

## P1-09: Admin Users API

| Field | Detail |
|---|---|
| **Task ID** | P1-09 |
| **Mô tả** | Quản lý danh sách users cho admin. Bao gồm list, search, toggle status. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/admin/AdminUsers.tsx` (tạo mới), `apps/shell/src/hooks/useAdminUsers.ts` (tạo mới) |
| **API endpoint** | `GET /api/admin/users`, `PATCH /api/admin/users/:id/status` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Chỉ accessible với role `admin`
- [ ] Table hiển thị: username, email, role, status, ngày tạo
- [ ] Search theo username hoặc email (debounce 300ms)
- [ ] Toggle user status (active/inactive) với confirmation dialog
- [ ] Pagination
- [ ] Optimistic update cho status toggle
- [ ] Error rollback nếu API fail

---

## P1-10: Profile API

| Field | Detail |
|---|---|
| **Task ID** | P1-10 |
| **Mô tả** | Trang profile cho user. Hiển thị thông tin cá nhân và cho phép cập nhật. |
| **Files cần tạo/sửa** | `apps/shell/src/pages/Profile.tsx` (tạo mới), `apps/shell/src/hooks/useProfile.ts` (tạo mới) |
| **API endpoint** | `GET /api/profile`, `PUT /api/profile` |
| **Dependencies** | P1-01, P1-02 |

**Acceptance Criteria:**
- [ ] Hiển thị: username, email, full name, phone, role (readonly)
- [ ] Form edit: full name, phone, email
- [ ] Client-side validation: email format, phone format, required fields
- [ ] Submit update qua BFF API
- [ ] Success toast notification
- [ ] Optimistic update cho UX
- [ ] Disable form khi đang submit

---

## Lưu ý chung

### 1. apiClient cần thêm `patch` method
Hiện tại `apiClient` chỉ có `get`, `post`, `put`, `delete`. Cần bổ sung `patch` cho:
- P1-09: Toggle user status (`PATCH /api/admin/users/:id/status`)
- Các update partial data trong tương lai

### 2. BFF Response Wrapping
BFF wrap tất cả response trong format chuẩn:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    details?: string;
  };
}
```
`useApi` hook cần unwrap `.data` tự động để component nhận data trực tiếp.

### 3. Type Alignment
Cần đảm bảo types giữa BFF và frontend khớp nhau:
- Sử dụng `packages/shared-types` cho common types
- BFF response types define trong `bff/src/types/`
- Frontend types import từ `shared-types` package
- Chú ý: một số fields BFF trả snake_case, frontend dùng camelCase -> cần transform layer

### 4. Error Handling Pattern
```
API Error → useApi catches → set error state → Component shows error UI
         → nếu 401 → auto refresh token → retry request
         → nếu 403 → redirect to unauthorized page
         → nếu 5xx → show generic error + retry button
```

### 5. Token Refresh
- Access token TTL: 15 phút
- Refresh token TTL: 7 ngày
- Khi access token hết hạn, `apiClient` interceptor tự động gọi `/api/auth/refresh`
- Mutex lock để tránh multiple refresh calls đồng thời
