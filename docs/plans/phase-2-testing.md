# Phase 2: Testing Plan

> Xây dựng test suite đầy đủ theo test pyramid: Unit → Integration → E2E.

## Test Pyramid

```
            /\
           /  \
          / E2E\           P2-11, P2-12
         /  (2) \          Playwright - core user flows
        /--------\
       /          \
      /Integration \       P2-08, P2-09, P2-10
     /    (3)       \      Multi-component, API mocking
    /----------------\
   /                  \
  /    Unit Tests      \   P2-01 → P2-07
 /       (7)           \  Utils, Components, Hooks
/________________________\
```

## Execution Order

```
P2-01 (Format Utils) ──┐
                        ├──→ P2-03 (Button)     ──┐
P2-02 (Validation)   ──┘    P2-04 (Input)         │
                             P2-05 (Card)          ├──→ P2-08 (Auth Flow)      ──┐
                             P2-06 (Modal)         │    P2-09 (Token Refresh)    ├──→ P2-11 (Playwright Setup)
                             P2-07 (DataTable)   ──┘    P2-10 (Role Routing)   ──┘    P2-12 (E2E Flows)

Layer 1: Unit Utils (P2-01, P2-02)
Layer 2: Unit UI Components (P2-03 → P2-07)
Layer 3: Integration Tests (P2-08 → P2-10)
Layer 4: E2E Tests (P2-11 → P2-12)
```

## Prerequisite: Jest Config cho shared-ui

Trước khi bắt đầu P2-03, cần setup Jest config cho `packages/shared-ui`:

```
packages/shared-ui/
├── jest.config.ts          # Jest config với ts-jest
├── tsconfig.spec.json      # TS config cho tests
└── src/
    └── __mocks__/
        └── styleMock.ts    # Mock CSS modules
```

Cần cài thêm:
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `ts-jest`, `jest-environment-jsdom`
- `identity-obj-proxy` (CSS modules mock)

---

## P2-01: Formatting Utils Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-01 |
| **Mô tả** | Unit tests cho tất cả formatting utility functions trong shared-utils. |
| **Files cần tạo/sửa** | `packages/shared-utils/src/formatters/__tests__/formatCurrency.test.ts`, `packages/shared-utils/src/formatters/__tests__/formatDate.test.ts`, `packages/shared-utils/src/formatters/__tests__/formatAccountNumber.test.ts` |
| **Dependencies** | Không |

### Test Cases

| Function | Test Case | Input | Expected Output |
|---|---|---|---|
| `formatCurrency` | Số dương | `1234567.89` | `"1,234,567.89 VND"` |
| `formatCurrency` | Số âm | `-500000` | `"-500,000.00 VND"` |
| `formatCurrency` | Số 0 | `0` | `"0.00 VND"` |
| `formatCurrency` | USD format | `1000, 'USD'` | `"$1,000.00"` |
| `formatCurrency` | Large number | `999999999999` | `"999,999,999,999.00 VND"` |
| `formatDate` | ISO string | `"2024-03-15T10:30:00Z"` | `"15/03/2024"` |
| `formatDate` | With time | `"2024-03-15T10:30:00Z", true` | `"15/03/2024 10:30"` |
| `formatDate` | Invalid date | `"invalid"` | `"--"` |
| `formatDate` | Null input | `null` | `"--"` |
| `formatAccountNumber` | Full mask | `"1234567890"` | `"******7890"` |
| `formatAccountNumber` | Show last 4 | `"9876543210"` | `"******3210"` |
| `formatAccountNumber` | Short number | `"1234"` | `"1234"` |

**Acceptance Criteria:**
- [ ] 100% coverage cho formatting functions
- [ ] Edge cases: null, undefined, empty string, NaN
- [ ] Locale handling chính xác (VND vs USD)
- [ ] Tất cả tests pass

---

## P2-02: Validation Utils Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-02 |
| **Mô tả** | Unit tests cho validation functions: email, phone, amount, required fields. |
| **Files cần tạo/sửa** | `packages/shared-utils/src/validators/__tests__/validateEmail.test.ts`, `packages/shared-utils/src/validators/__tests__/validatePhone.test.ts`, `packages/shared-utils/src/validators/__tests__/validateAmount.test.ts` |
| **Dependencies** | Không |

### Test Cases

| Function | Test Case | Input | Expected |
|---|---|---|---|
| `validateEmail` | Valid email | `"user@nab.com"` | `{ valid: true }` |
| `validateEmail` | Missing @ | `"usernab.com"` | `{ valid: false, error: "..." }` |
| `validateEmail` | Empty string | `""` | `{ valid: false, error: "..." }` |
| `validateEmail` | Special chars | `"user+tag@nab.com"` | `{ valid: true }` |
| `validatePhone` | VN format | `"0901234567"` | `{ valid: true }` |
| `validatePhone` | With country code | `"+84901234567"` | `{ valid: true }` |
| `validatePhone` | Too short | `"090123"` | `{ valid: false }` |
| `validatePhone` | Letters | `"abcdefghij"` | `{ valid: false }` |
| `validateAmount` | Positive | `1000` | `{ valid: true }` |
| `validateAmount` | Zero | `0` | `{ valid: false }` |
| `validateAmount` | Negative | `-100` | `{ valid: false }` |
| `validateAmount` | Exceeds max | `1000000000` | `{ valid: false }` |
| `validateAmount` | Decimal | `100.50` | `{ valid: true }` |

**Acceptance Criteria:**
- [ ] 100% coverage cho validation functions
- [ ] Error messages rõ ràng, có thể hiển thị trực tiếp cho user
- [ ] Boundary testing cho amount limits
- [ ] Tất cả tests pass

---

## P2-03: Button Component Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-03 |
| **Mô tả** | Unit tests cho Button component trong shared-ui. Test rendering, variants, states, accessibility. |
| **Files cần tạo/sửa** | `packages/shared-ui/src/components/Button/__tests__/Button.test.tsx` |
| **Dependencies** | P2-01, P2-02 (Jest config cần sẵn sàng) |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Render default button | Render với text, role="button" |
| Primary variant | Class `btn--primary` applied |
| Secondary variant | Class `btn--secondary` applied |
| Disabled state | `disabled` attribute, không fire onClick |
| Loading state | Spinner hiển thị, text ẩn, disabled |
| Click handler | onClick được gọi 1 lần |
| Custom className | Merge className với base classes |
| Icon button | Render icon + text |
| Full width | Class `btn--full-width` |
| Keyboard: Enter | Fire onClick khi nhấn Enter |
| Keyboard: Space | Fire onClick khi nhấn Space |
| aria-label | Accessible name chính xác |

**Acceptance Criteria:**
- [ ] Test tất cả variants: primary, secondary, outline, ghost, danger
- [ ] Test tất cả sizes: sm, md, lg
- [ ] Accessibility: role, aria-label, aria-disabled
- [ ] Keyboard interaction
- [ ] Snapshot test cho mỗi variant

---

## P2-04: Input Component Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-04 |
| **Mô tả** | Unit tests cho Input component. Test rendering, validation states, accessibility. |
| **Files cần tạo/sửa** | `packages/shared-ui/src/components/Input/__tests__/Input.test.tsx` |
| **Dependencies** | P2-01, P2-02 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Render with label | Label linked to input via `htmlFor` |
| Placeholder | Placeholder text hiển thị |
| Value change | onChange fired với new value |
| Error state | Error message hiển thị, `aria-invalid="true"` |
| Helper text | Helper text hiển thị khi không có error |
| Disabled | Input disabled, visual state |
| Required | Required indicator (*), `aria-required="true"` |
| Password toggle | Type toggle password/text |
| Max length | Hiển thị character count |
| Focus/Blur | onFocus, onBlur events |
| aria-describedby | Link error/helper to input |

**Acceptance Criteria:**
- [ ] Label-input association chính xác
- [ ] Error state accessible (aria-invalid, aria-describedby)
- [ ] Keyboard navigation: Tab focus
- [ ] Controlled vs uncontrolled modes
- [ ] Tất cả tests pass

---

## P2-05: Card Component Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-05 |
| **Mô tả** | Unit tests cho Card component. Test rendering, variants, click handling. |
| **Files cần tạo/sửa** | `packages/shared-ui/src/components/Card/__tests__/Card.test.tsx` |
| **Dependencies** | P2-01, P2-02 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Render children | Children content hiển thị |
| Default variant | Base card styles |
| Elevated variant | Shadow class applied |
| Outlined variant | Border class applied |
| Clickable card | role="button", tabIndex=0, onClick |
| Hover state | Hover class khi clickable |
| Header slot | Card header render |
| Footer slot | Card footer render |
| Custom className | Merge classes |

**Acceptance Criteria:**
- [ ] Tất cả variants render chính xác
- [ ] Clickable card có keyboard support (Enter/Space)
- [ ] Semantic HTML (article hoặc div tùy context)
- [ ] Tất cả tests pass

---

## P2-06: Modal Component Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-06 |
| **Mô tả** | Unit tests cho Modal/Dialog component. Focus trap, close behaviors, accessibility. |
| **Files cần tạo/sửa** | `packages/shared-ui/src/components/Modal/__tests__/Modal.test.tsx` |
| **Dependencies** | P2-01, P2-02 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Open modal | Content hiển thị khi isOpen=true |
| Close modal | Content ẩn khi isOpen=false |
| Close on overlay click | onClose called |
| Close on Escape | onClose called khi nhấn Esc |
| Focus trap | Tab cycle trong modal |
| Initial focus | Focus vào first focusable element |
| Return focus | Focus trở về trigger khi close |
| role="dialog" | ARIA role chính xác |
| aria-modal | `aria-modal="true"` |
| aria-labelledby | Title linked qua aria-labelledby |
| Portal rendering | Render vào document.body |
| Prevent body scroll | Body overflow hidden khi open |

**Acceptance Criteria:**
- [ ] Focus trap hoạt động chính xác
- [ ] ARIA attributes đầy đủ
- [ ] Body scroll lock
- [ ] Portal rendering
- [ ] Cleanup khi unmount (remove scroll lock, portal)

---

## P2-07: DataTable Component Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-07 |
| **Mô tả** | Unit tests cho DataTable component. Sorting, pagination, empty state, loading. |
| **Files cần tạo/sửa** | `packages/shared-ui/src/components/DataTable/__tests__/DataTable.test.tsx` |
| **Dependencies** | P2-01, P2-02 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Render rows | Data rows hiển thị chính xác |
| Column headers | Headers render từ config |
| Sort ascending | Click header → sort asc |
| Sort descending | Click lại → sort desc |
| Sort indicator | Arrow icon hiển thị direction |
| Pagination | Navigate between pages |
| Page size change | Rows per page thay đổi |
| Empty state | Empty message khi no data |
| Loading state | Skeleton rows |
| Row click | onRowClick handler |
| Responsive | Horizontal scroll trên mobile |
| aria-sort | Sort direction announced |
| caption | Table caption cho screen readers |

**Acceptance Criteria:**
- [ ] Sort functionality hoạt động với string, number, date columns
- [ ] Pagination state management
- [ ] Accessible table markup (caption, scope, aria-sort)
- [ ] Loading skeleton rows
- [ ] Tất cả tests pass

---

## P2-08: Auth Flow Integration Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-08 |
| **Mô tả** | Integration test cho login flow end-to-end trong component tree. Mock BFF API, test full auth cycle. |
| **Files cần tạo/sửa** | `apps/shell/src/__tests__/integration/authFlow.test.tsx` |
| **Dependencies** | P2-03, P2-04 (Button, Input components tested) |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Successful login | Submit form → API call → redirect to dashboard |
| Invalid credentials | API 401 → error message hiển thị |
| Validation errors | Empty fields → client-side errors |
| Loading state | Submit → button disabled + spinner |
| Token storage | Tokens saved sau login thành công |
| Auto-redirect | Authenticated user → redirect khỏi login |
| Logout flow | Logout → clear tokens → redirect to login |
| Session expired | 401 trên protected route → redirect to login |

**Acceptance Criteria:**
- [ ] Mock BFF API responses (MSW hoặc jest.mock)
- [ ] Test toàn bộ flow: form fill → submit → API → state update → navigation
- [ ] Verify token storage/cleanup
- [ ] Error scenarios covered
- [ ] Không có memory leaks (cleanup after each test)

---

## P2-09: Token Refresh & Mutex Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-09 |
| **Mô tả** | Integration tests cho token refresh mechanism. Test concurrent requests, mutex lock, retry logic. |
| **Files cần tạo/sửa** | `apps/shell/src/__tests__/integration/tokenRefresh.test.ts` |
| **Dependencies** | P2-08 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| Auto refresh | 401 → refresh token → retry original request |
| Mutex lock | Multiple 401s → chỉ 1 refresh call |
| Queue requests | Pending requests đợi refresh xong → retry tất cả |
| Refresh failed | Refresh 401 → logout user |
| Refresh token expired | Clear tokens → redirect login |
| Race condition | 2 tabs refresh cùng lúc → handle gracefully |
| Network error during refresh | Retry refresh hoặc logout |

**Acceptance Criteria:**
- [ ] Mutex lock prevent duplicate refresh calls
- [ ] Request queue hoạt động chính xác
- [ ] Failed refresh → clean logout
- [ ] Timing tests cho concurrent scenarios
- [ ] Tất cả tests pass consistently (no flaky)

---

## P2-10: Role-Based Routing Tests

| Field | Detail |
|---|---|
| **Task ID** | P2-10 |
| **Mô tả** | Integration tests cho route guards. Test access control dựa trên user role. |
| **Files cần tạo/sửa** | `apps/shell/src/__tests__/integration/roleRouting.test.tsx` |
| **Dependencies** | P2-08 |

### Test Cases

| Test Case | Kiểm tra |
|---|---|
| User access dashboard | role="user" → /dashboard accessible |
| User blocked from admin | role="user" → /admin → redirect |
| Admin access admin | role="admin" → /admin accessible |
| Admin access user pages | role="admin" → /dashboard accessible |
| Unauthenticated redirect | No token → any protected route → /login |
| Deep link after login | /accounts → login → redirect back to /accounts |
| Role change | Role update → route access update |

**Acceptance Criteria:**
- [ ] ProtectedRoute component tested
- [ ] AdminRoute component tested
- [ ] Redirect logic chính xác
- [ ] Deep link preservation
- [ ] Memory router cho test (không dùng BrowserRouter)

---

## P2-11: Playwright Setup

| Field | Detail |
|---|---|
| **Task ID** | P2-11 |
| **Mô tả** | Setup Playwright cho E2E testing. Config, fixtures, helpers, page objects. |
| **Files cần tạo/sửa** | `apps/e2e/playwright.config.ts` (tạo mới), `apps/e2e/fixtures/auth.fixture.ts` (tạo mới), `apps/e2e/pages/LoginPage.ts` (tạo mới), `apps/e2e/pages/DashboardPage.ts` (tạo mới), `apps/e2e/helpers/api.helper.ts` (tạo mới) |
| **Dependencies** | P2-08, P2-09, P2-10 (integration tests pass trước) |

**Acceptance Criteria:**
- [ ] Playwright config: Chrome + Firefox, viewport 1280x720
- [ ] Base URL configurable qua env
- [ ] Auth fixture: login trước test, reuse state
- [ ] Page Object pattern cho main pages
- [ ] API helper cho seed/cleanup test data
- [ ] Screenshot on failure
- [ ] HTML report generation
- [ ] `pnpm test:e2e` command hoạt động

---

## P2-12: E2E Core Flows

| Field | Detail |
|---|---|
| **Task ID** | P2-12 |
| **Mô tả** | E2E tests cho core user journeys. Test trên real browser với BFF server. |
| **Files cần tạo/sửa** | `apps/e2e/tests/auth.spec.ts`, `apps/e2e/tests/dashboard.spec.ts`, `apps/e2e/tests/accounts.spec.ts`, `apps/e2e/tests/transfer.spec.ts`, `apps/e2e/tests/admin.spec.ts` |
| **Dependencies** | P2-11 |

### Test Flows

| Flow | Steps |
|---|---|
| **Login → Dashboard** | Open app → Login form → Submit → Dashboard hiển thị |
| **View Accounts** | Dashboard → Click "Accounts" → List hiển thị → Click account → Detail |
| **View Transactions** | Account Detail → Transactions tab → Filter by date → Verify results |
| **Make Transfer** | Dashboard → Transfer → Fill form → Confirm → Success |
| **Admin Flow** | Login as admin → Admin Dashboard → Users list → Toggle user status |
| **Logout** | Any page → Click logout → Redirect to login → Cannot access protected routes |
| **Session Expiry** | Login → Wait for token expire → Action → Auto-refresh or re-login |

**Acceptance Criteria:**
- [ ] Tất cả core flows pass trên Chrome và Firefox
- [ ] Tests independent (không depend vào order)
- [ ] Test data seed trước mỗi test, cleanup sau
- [ ] Stable selectors (data-testid, role, label)
- [ ] CI-ready (headless mode)
- [ ] Max 5 phút cho toàn bộ E2E suite

---

## Technical Notes

### 1. ICU Locale cho Intl APIs
Jest mặc định dùng limited ICU data. Để test `Intl.NumberFormat`, `Intl.DateTimeFormat` chính xác:
```bash
# Chạy Jest với full ICU
NODE_ICU_DATA=$(node -p 'require("full-icu")') npx jest
```
Hoặc config trong `jest.config.ts`:
```typescript
// Cài full-icu package
// Thêm vào jest.config.ts
globals: {
  NODE_ICU_DATA: require('full-icu'),
}
```

### 2. Module Federation Mock Patterns
Khi test components từ remote apps:
```typescript
// Mock remote module
jest.mock('dashboard/Widget', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-widget">Dashboard Widget</div>,
}));

// Mock shared scope
jest.mock('@nab/shared-ui', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Input: ({ label, ...props }) => (
    <label>
      {label}
      <input {...props} />
    </label>
  ),
}));
```

### 3. window.location Mocking
```typescript
// Dùng jest-location-mock hoặc manual mock
const mockLocation = new URL('http://localhost:3000/login');
delete (window as any).location;
window.location = mockLocation as any;

// Hoặc dùng MemoryRouter cho navigation tests
import { MemoryRouter } from 'react-router-dom';
render(
  <MemoryRouter initialEntries={['/dashboard']}>
    <App />
  </MemoryRouter>
);
```

### 4. MSW cho API Mocking (Integration Tests)
```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: { accessToken: 'mock-token', refreshToken: 'mock-refresh' },
    });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 5. Test Coverage Targets

| Layer | Target | Thực tế minimum |
|---|---|---|
| Unit (utils) | 100% | 95% |
| Unit (components) | 90% | 80% |
| Integration | 80% | 70% |
| E2E | Core flows | 5-7 flows |
