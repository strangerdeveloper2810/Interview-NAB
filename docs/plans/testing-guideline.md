# Testing Guideline — NAB Banking Portal

## Test Pyramid

```
         /\
        /  \       E2E (Playwright)
       / ít \      Test full user flow trên browser thật
      /  nhất \    Chậm, tốn resource, chỉ test happy path + critical path
     /----------\
    /            \    Integration Tests (Jest + RTL)
   /   vừa phải  \   Test nhiều components/modules phối hợp
  /               \   Mock API, test flow (login → redirect → dashboard)
 /------------------\
|                    |  Unit Tests (Jest / Jest + RTL)
|     nhiều nhất     |  Test 1 function hoặc 1 component độc lập
|                    |  Nhanh, dễ debug, cover edge cases
\____________________/
```

---

## 1. Unit Test — Pure Functions

**Dùng khi:** Test utility functions không có side effects (formatting, validation, helpers).

**Tools:** Jest + ts-jest

**Pattern:**

```ts
// formatting.test.ts
import { formatCurrency } from './formatting'

describe('formatCurrency', () => {
  // Test case rõ ràng: input → expected output
  it('formats VND amount with dot separators and dong symbol', () => {
    const result = formatCurrency(25000000, 'VND')
    expect(result).toContain('25.000.000')
    expect(result).toContain('₫')
  })

  // Edge cases
  it('defaults to VND and formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats negative amounts', () => {
    const result = formatCurrency(-500000)
    expect(result).toContain('500.000')
  })
})
```

**Tips:**
- Mỗi `it()` chỉ test 1 behavior
- Tên test đọc như câu tiếng Anh: `it('formats VND amount...')`
- `toContain` thay vì `toBe` khi output phụ thuộc locale (Intl format khác nhau giữa Node versions)
- `toMatch(/^\+/)` cho regex patterns
- Dùng `describe` group theo function name

**Chạy:** `pnpm --filter @nab/shared-utils test`

---

## 2. Unit Test — React Components

**Dùng khi:** Test 1 component render đúng, handle events đúng, accessibility đúng.

**Tools:** Jest + React Testing Library (RTL) + userEvent

**Setup (đã có sẵn):**
```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '\\.(scss|css)$': 'identity-obj-proxy' },
  transform: { '^.+\\.tsx?$': 'ts-jest' },
}

// jest.setup.ts
import '@testing-library/jest-dom'  // thêm matchers: toBeInTheDocument, toBeDisabled...
```

**Pattern:**

```tsx
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './index'

describe('Button', () => {
  // 1. RENDER — component hiển thị đúng
  it('renders with children text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  // 2. VARIANTS — CSS class đúng
  it('renders primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('primary')
  })

  // 3. EVENTS — user interaction
  it('fires click handler', async () => {
    const user = userEvent.setup()       // setup trước
    const handleClick = jest.fn()         // mock function
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole('button'))  // simulate click
    expect(handleClick).toHaveBeenCalledTimes(1)   // verify
  })

  // 4. DISABLED STATE
  it('does not fire click when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()                  // HTML attribute check
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()     // verify NOT called
  })

  // 5. LOADING STATE
  it('shows spinner when loading', () => {
    render(<Button loading>Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.queryByText('Submit')).not.toBeInTheDocument()  // children hidden
    expect(button.querySelector('.spinner')).toBeInTheDocument()  // spinner visible
  })
})
```

**Query Priority (RTL best practice):**
```
getByRole       ← ưu tiên nhất (accessible, như user thật tìm)
getByLabelText  ← cho form fields
getByText       ← cho static text
getByTestId     ← cuối cùng (khi không có cách nào khác)
```

**userEvent vs fireEvent:**
```tsx
// ❌ fireEvent — synthetic event, không realistic
fireEvent.click(button)

// ✅ userEvent — simulate user thật (hover → focus → click)
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'hello')  // type từng ký tự
```

**Test Form Input:**
```tsx
it('renders with label and getByLabelText works', () => {
  render(<Input label="Email" />)
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})

it('shows error message with role="alert"', () => {
  render(<Input label="Email" error="Required" />)
  expect(screen.getByRole('alert')).toHaveTextContent('Required')
})

it('sets aria-invalid when error', () => {
  render(<Input label="Email" error="Bad" />)
  expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
})
```

**Chạy:** `pnpm --filter @nab/shared-ui test`

---

## 3. Integration Test — apiClient (Async + Mocking)

**Dùng khi:** Test module có side effects: API calls, token refresh, redirect.

**Tools:** Jest + mock fetch + jest.resetModules

**Pattern:**

```ts
/**
 * @jest-environment jsdom    ← cần cho window.location
 */

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Helper tạo mock response
const mockResponse = (status: number, body: any) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  })

// Reset giữa mỗi test — quan trọng vì apiClient có module-level state (refreshPromise)
beforeEach(() => {
  mockFetch.mockReset()
  jest.resetModules()     // ← reset module cache → refreshPromise = null
})

describe('apiClient', () => {
  // Dynamic import vì cần fresh module mỗi test
  const loadModule = async () => {
    const mod = await import('./apiClient')
    return mod
  }

  // Test basic request
  it('GET success returns parsed JSON', async () => {
    const { apiClient } = await loadModule()
    mockFetch.mockReturnValueOnce(mockResponse(200, { id: 1 }))

    const result = await apiClient.get('/users')
    expect(result).toEqual({ id: 1 })
  })

  // Test 401 → refresh → retry (3 fetch calls)
  it('401 triggers refresh then retries', async () => {
    const { apiClient } = await loadModule()
    mockFetch
      .mockReturnValueOnce(mockResponse(401, {}))    // 1. original → 401
      .mockReturnValueOnce(mockResponse(200, {}))     // 2. refresh → OK
      .mockReturnValueOnce(mockResponse(200, { id: 1 }))  // 3. retry → OK

    const result = await apiClient.get('/accounts')
    expect(result).toEqual({ id: 1 })
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  // Test mutex — 2 concurrent 401s, chỉ 1 refresh
  it('only calls refresh once for concurrent 401s', async () => {
    const { apiClient } = await loadModule()
    mockFetch
      .mockReturnValueOnce(mockResponse(401, {}))     // req A → 401
      .mockReturnValueOnce(mockResponse(401, {}))     // req B → 401
      .mockReturnValueOnce(mockResponse(200, {}))     // refresh (chỉ 1 lần)
      .mockReturnValueOnce(mockResponse(200, { a: 1 })) // req A retry
      .mockReturnValueOnce(mockResponse(200, { b: 2 })) // req B retry

    const [a, b] = await Promise.all([
      apiClient.get('/accounts'),
      apiClient.get('/transfers'),
    ])

    // Verify chỉ 1 refresh call
    const refreshCalls = mockFetch.mock.calls.filter(
      ([url]: [string]) => url === '/api/auth/refresh'
    )
    expect(refreshCalls).toHaveLength(1)
  })

  // Test auth endpoints skip refresh
  it('auth/login 401 throws directly without refresh', async () => {
    const { apiClient } = await loadModule()
    mockFetch.mockReturnValueOnce(
      mockResponse(401, { message: 'Invalid credentials' })
    )

    await expect(
      apiClient.post('auth/login', { email: 'x' })
    ).rejects.toThrow(
      expect.objectContaining({ status: 401, message: 'Invalid credentials' })
    )

    expect(mockFetch).toHaveBeenCalledTimes(1)  // NO refresh call
  })
})
```

**Key Concepts:**
- `jest.resetModules()` — reset module cache, module-level variables (`refreshPromise`) được reset
- `await import('./apiClient')` — dynamic import sau resetModules để lấy fresh module
- `mockReturnValueOnce` — chain nhiều responses theo thứ tự
- `Promise.all` — test concurrent behavior
- `mockFetch.mock.calls.filter()` — đếm specific calls

---

## 4. Integration Test — React Component Flow

**Dùng khi:** Test nhiều components phối hợp: form submit → API call → state change → redirect.

**Tools:** Jest + RTL + MemoryRouter + mock stores/API

**Pattern:**

```tsx
// auth-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

// Mock dependencies
jest.mock('@nab/shared-utils', () => ({
  apiClient: { post: jest.fn() },
  ApiError: class extends Error {
    status: number
    constructor(status: number, message: string) {
      super(message); this.status = status
    }
  },
}))

jest.mock('../stores/authStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setAuth: jest.fn(),
    isAuthenticated: false,
  })),
}))

// Mock remote modules (Module Federation)
jest.mock('dashboard/DashboardPage', () => ({
  __esModule: true,
  default: () => <div>Dashboard</div>,
}))

import LoginPage from '../pages/Auth/Login'
import { apiClient } from '@nab/shared-utils'

describe('Login Flow', () => {
  const user = userEvent.setup()

  const renderLogin = () =>
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <LoginPage />
      </MemoryRouter>
    )

  it('login success → calls setAuth → navigates', async () => {
    const mockSetAuth = jest.fn()
    const useAuthStore = require('../stores/authStore').default
    useAuthStore.mockReturnValue({ setAuth: mockSetAuth, isAuthenticated: false })

    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: { user: { id: 1, name: 'Test' }, tokens: { accessToken: 'x' } },
    })

    renderLogin()

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@nab.com')
    await user.type(screen.getByLabelText(/mật khẩu/i), '123456')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    // Verify
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@nab.com',
        password: '123456',
      })
      expect(mockSetAuth).toHaveBeenCalled()
    })
  })

  it('login fail → shows error alert', async () => {
    const { ApiError } = require('@nab/shared-utils')
    ;(apiClient.post as jest.Mock).mockRejectedValue(
      new ApiError(401, 'Invalid credentials')
    )

    renderLogin()

    await user.type(screen.getByLabelText(/email/i), 'wrong@nab.com')
    await user.type(screen.getByLabelText(/mật khẩu/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /đăng nhập/i }))

    // Error alert visible
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
```

**Key Concepts:**
- `MemoryRouter` — test routing không cần browser
- `jest.mock()` — mock external modules (API, stores)
- `waitFor()` — đợi async state updates (API call → re-render)
- `jest.fn()` → verify function được gọi đúng args
- Mock Module Federation remotes: `jest.mock('dashboard/DashboardPage', ...)`

---

## 5. E2E Test — Playwright

**Dùng khi:** Test full user flow trên browser thật. App phải running.

**Tools:** Playwright

**Setup:**
```bash
# Install
pnpm add -D @playwright/test
npx playwright install chromium

# Config
# playwright.config.ts
```

**Pattern:**

```ts
// auth.spec.ts
import { test, expect } from '@playwright/test'

// Helper — dùng lại across tests
async function login(page, email: string, password: string) {
  await page.goto('/auth/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Mật khẩu').fill(password)
  await page.getByRole('button', { name: /đăng nhập/i }).click()
}

test.describe('Authentication', () => {
  test('login success redirects to dashboard', async ({ page }) => {
    await login(page, 'john@nab.com', '123456')

    // Verify redirect
    await expect(page).toHaveURL(/dashboard/)

    // Verify user name visible in header
    await expect(page.getByText('John Nguyen')).toBeVisible()
  })

  test('login fail shows error', async ({ page }) => {
    await login(page, 'wrong@nab.com', 'wrongpass')

    // Verify still on login page
    await expect(page).toHaveURL(/login/)

    // Verify error visible
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('logout redirects to login', async ({ page }) => {
    await login(page, 'john@nab.com', '123456')
    await expect(page).toHaveURL(/dashboard/)

    // Click user menu → logout
    await page.getByLabel('User menu').click()
    await page.getByRole('menuitem', { name: /logout/i }).click()

    await expect(page).toHaveURL(/login/)
  })

  test('admin login redirects to admin dashboard', async ({ page }) => {
    await login(page, 'admin@nab.com', '123456')
    await expect(page).toHaveURL(/admin/)
  })

  test('user cannot access admin page', async ({ page }) => {
    await login(page, 'john@nab.com', '123456')
    await page.goto('/admin')
    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/)
  })
})
```

**Playwright vs RTL:**

| | RTL (Unit/Integration) | Playwright (E2E) |
|---|---|---|
| Environment | jsdom (fake browser) | Real browser (Chromium) |
| Speed | Nhanh (ms) | Chậm (seconds) |
| API | Mock | Real (BFF running) |
| Scope | 1 component / 1 flow | Full app flow |
| Query | `screen.getByRole()` | `page.getByRole()` |
| Assert | `expect(el).toBeInTheDocument()` | `await expect(el).toBeVisible()` |
| Async | `waitFor(() => ...)` | Auto-wait (built-in) |

**Playwright Tips:**
- `page.getByRole()`, `page.getByLabel()`, `page.getByText()` — giống RTL queries
- `await expect(page).toHaveURL()` — wait cho navigation
- `await expect(locator).toBeVisible()` — auto-retry cho đến khi visible
- `test.describe.serial` — khi tests phải chạy theo thứ tự
- `page.waitForResponse()` — đợi API response cụ thể

**Chạy:** `npx playwright test`

---

## Tổng kết — Khi nào dùng gì

| Tình huống | Loại test | Ví dụ |
|---|---|---|
| Test 1 function | Unit (Jest) | `formatCurrency()`, `isValidEmail()` |
| Test 1 component render | Unit (Jest + RTL) | Button variants, Input error state |
| Test async module | Integration (Jest + mock) | apiClient refresh, mutex |
| Test form submit flow | Integration (Jest + RTL + mock) | Login → API → redirect |
| Test full user flow | E2E (Playwright) | Login → dashboard → transfer |

**Interview khi được hỏi "Testing strategy":**
1. Unit tests cho pure functions + components (coverage 80%+)
2. Integration tests cho critical flows (auth, token refresh)
3. E2E cho happy path + critical business flows (transfer money)
4. Không test implementation details, test behavior (user perspective)
