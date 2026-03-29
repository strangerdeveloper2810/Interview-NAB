# Phase 3: DevOps & Optimization Plan

> CI/CD pipeline, performance optimization, accessibility compliance, và production deployment.

## Timeline (5 Weeks)

| Week | Focus | Tasks |
|---|---|---|
| Week 1 | CI/CD Foundation | P3-01, P3-02 |
| Week 2 | CI/CD + Bundle | P3-03, P3-04 |
| Week 3 | Performance | P3-05, P3-06 |
| Week 4 | Accessibility | P3-07, P3-08, P3-09 |
| Week 5 | A11y + Docker | P3-10, P3-11 |

## Priority Table

| Task | Priority | Effort | Impact |
|---|---|---|---|
| P3-01 GitHub Actions CI | High | Medium | High |
| P3-02 Matrix Build | High | Medium | High |
| P3-03 E2E in CI | Medium | High | Medium |
| P3-04 Bundle Analysis | High | Low | High |
| P3-05 Code Splitting | High | Medium | High |
| P3-06 Shared Deps | Medium | Medium | Medium |
| P3-07 Lighthouse CI | Medium | Low | Medium |
| P3-08 axe-core | High | Medium | High |
| P3-09 Keyboard Nav | High | Medium | High |
| P3-10 Screen Reader | Medium | High | Medium |
| P3-11 Docker Production | Medium | High | Medium |

## Dependency Graph

```
P3-01 (Basic CI) ──→ P3-02 (Matrix Build) ──→ P3-03 (E2E in CI)
                                               │
P3-04 (Bundle Analysis) ──→ P3-05 (Code Splitting) ──→ P3-06 (Shared Deps)
                                                        │
P3-07 (Lighthouse CI) ←────────────────────────────────┘
                                               │
P3-08 (axe-core) ──→ P3-09 (Keyboard Nav) ──→ P3-10 (Screen Reader)

P3-11 (Docker) ← độc lập, có thể chạy song song với P3-04→P3-10
```

---

## P3-01: GitHub Actions - Basic CI

| Field | Detail |
|---|---|
| **Task ID** | P3-01 |
| **Mô tả** | Setup GitHub Actions workflow cơ bản: lint, type-check, unit tests trên mỗi PR và push to main. |
| **Files cần tạo/sửa** | `.github/workflows/ci.yml` (tạo mới), `.github/workflows/pr-check.yml` (tạo mới) |
| **Dependencies** | Không |

### Steps

1. Tạo `ci.yml` workflow:
   - Trigger: push to `main`, PR to `main`
   - Node.js 20, pnpm setup
   - Cache: pnpm store, Nx cache
   - Jobs: `lint`, `type-check`, `unit-test`
2. Tạo `pr-check.yml`:
   - Chạy `pnpm nx affected:lint`
   - Chạy `pnpm nx affected:test`
   - Chạy `pnpm nx affected:build`
3. Setup Nx caching trong CI

**Acceptance Criteria:**
- [ ] CI chạy tự động trên PR
- [ ] CI chạy trên push to main
- [ ] Nx affected chỉ chạy tasks cho changed projects
- [ ] pnpm store cached giữa các runs
- [ ] Nx computation cache hoạt động
- [ ] CI pass trong < 5 phút cho affected tasks
- [ ] Status checks visible trên PR

---

## P3-02: Matrix Build per App

| Field | Detail |
|---|---|
| **Task ID** | P3-02 |
| **Mô tả** | Build song song mỗi app (shell, dashboard, accounts) trong CI. Matrix strategy cho parallel builds. |
| **Files cần tạo/sửa** | `.github/workflows/ci.yml` (sửa - thêm build matrix), `.github/workflows/build-app.yml` (tạo mới - reusable workflow) |
| **Dependencies** | P3-01 |

### Steps

1. Thêm matrix strategy cho build job:
   ```yaml
   strategy:
     matrix:
       app: [shell, dashboard, accounts]
   ```
2. Mỗi app build song song
3. Upload build artifacts
4. Reusable workflow cho build step

**Acceptance Criteria:**
- [ ] 3 apps build song song trong CI
- [ ] Build artifacts uploaded và downloadable
- [ ] Build failure cho 1 app không block các app khác
- [ ] Total build time < 8 phút
- [ ] Build cache hoạt động (subsequent builds nhanh hơn)

---

## P3-03: E2E Tests in CI

| Field | Detail |
|---|---|
| **Task ID** | P3-03 |
| **Mô tả** | Chạy Playwright E2E tests trong CI. Setup BFF + all apps, run tests, upload reports. |
| **Files cần tạo/sửa** | `.github/workflows/e2e.yml` (tạo mới), `apps/e2e/playwright.config.ci.ts` (tạo mới), `docker-compose.ci.yml` (tạo mới) |
| **Dependencies** | P3-02 |

### Steps

1. Tạo `e2e.yml` workflow:
   - Trigger: push to main, nightly schedule
   - Setup: PostgreSQL service container, BFF server, all frontend apps
   - Run Playwright tests
   - Upload HTML report as artifact
   - Upload failure screenshots
2. CI-specific Playwright config:
   - Headless mode
   - 2 retries cho flaky tests
   - 3 workers parallel
3. Docker Compose cho CI environment

**Acceptance Criteria:**
- [ ] E2E tests chạy trong CI
- [ ] PostgreSQL service container hoạt động
- [ ] BFF + frontend apps start trước tests
- [ ] HTML report uploaded as artifact
- [ ] Screenshots on failure
- [ ] Total E2E time < 10 phút
- [ ] Nightly schedule chạy full suite

---

## P3-04: Bundle Analysis

| Field | Detail |
|---|---|
| **Task ID** | P3-04 |
| **Mô tả** | Setup rspack-bundle-analyzer để visualize bundle size. Identify large dependencies và optimization opportunities. |
| **Files cần tạo/sửa** | `apps/shell/rspack.config.ts` (sửa), `apps/dashboard/rspack.config.ts` (sửa), `apps/accounts/rspack.config.ts` (sửa), `scripts/analyze-bundle.sh` (tạo mới) |
| **Dependencies** | Không |

### Steps

1. Install `rspack-bundle-analyzer`:
   ```bash
   pnpm add -D @rspack/plugin-bundle-analyzer
   ```
2. Thêm analyzer plugin vào rspack config (chỉ khi `ANALYZE=true`):
   ```typescript
   if (process.env.ANALYZE) {
     config.plugins.push(new BundleAnalyzerPlugin({
       analyzerMode: 'static',
       reportFilename: `bundle-report-${appName}.html`,
     }));
   }
   ```
3. Script `analyze-bundle.sh`:
   - Build tất cả apps với `ANALYZE=true`
   - Open reports trong browser
4. Document baseline bundle sizes

**Acceptance Criteria:**
- [ ] `pnpm analyze` command hoạt động
- [ ] Report HTML cho mỗi app
- [ ] Baseline sizes documented
- [ ] Top 5 largest dependencies identified
- [ ] Bundle size budget defined (shell < 200KB gzipped, remotes < 100KB)

---

## P3-05: Code Splitting Audit

| Field | Detail |
|---|---|
| **Task ID** | P3-05 |
| **Mô tả** | Audit và optimize code splitting. Lazy load routes, heavy components, và third-party libs. |
| **Files cần tạo/sửa** | `apps/shell/src/routes/index.tsx` (sửa), `apps/shell/src/App.tsx` (sửa), `apps/dashboard/src/App.tsx` (sửa), `apps/accounts/src/App.tsx` (sửa) |
| **Dependencies** | P3-04 |

### Steps

1. Audit current bundle report từ P3-04
2. Implement React.lazy cho route-level code splitting:
   ```typescript
   const Dashboard = React.lazy(() => import('./pages/Dashboard'));
   const Accounts = React.lazy(() => import('./pages/Accounts'));
   const Transfer = React.lazy(() => import('./pages/Transfer'));
   const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
   ```
3. Suspense boundaries với loading fallbacks
4. Preload critical routes (dashboard) trên hover
5. Dynamic import cho heavy libraries (chart libs, date pickers)

**Acceptance Criteria:**
- [ ] Route-level code splitting cho tất cả pages
- [ ] Suspense fallback UI (skeleton/spinner)
- [ ] Chart library lazy loaded
- [ ] Initial bundle giảm >= 30% so với baseline
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] No flash of unstyled content

---

## P3-06: Shared Dependencies Optimization

| Field | Detail |
|---|---|
| **Task ID** | P3-06 |
| **Mô tả** | Optimize Module Federation shared dependencies. Ensure React, React DOM, và shared libs loaded 1 lần duy nhất. |
| **Files cần tạo/sửa** | `apps/shell/rspack.config.ts` (sửa), `apps/dashboard/rspack.config.ts` (sửa), `apps/accounts/rspack.config.ts` (sửa), `packages/shared-ui/package.json` (sửa) |
| **Dependencies** | P3-05 |

### Steps

1. Audit shared dependencies trong Module Federation config:
   ```typescript
   shared: {
     react: { singleton: true, requiredVersion: '^18.0.0' },
     'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
     'react-router-dom': { singleton: true },
     zustand: { singleton: true },
   }
   ```
2. Verify singleton enforcement (no duplicate React)
3. Optimize eager vs lazy loading cho shared deps
4. Version alignment giữa tất cả apps
5. Tree-shaking verification cho shared-ui

**Acceptance Criteria:**
- [ ] React loaded 1 lần duy nhất (verify trong network tab)
- [ ] Không có duplicate packages trong bundle
- [ ] Shared deps version aligned
- [ ] shared-ui tree-shakeable
- [ ] Total shared chunk < 150KB gzipped
- [ ] No runtime errors từ version mismatch

---

## P3-07: Lighthouse CI

| Field | Detail |
|---|---|
| **Task ID** | P3-07 |
| **Mô tả** | Integrate Lighthouse CI vào pipeline. Track performance, accessibility, best practices scores theo thời gian. |
| **Files cần tạo/sửa** | `.github/workflows/lighthouse.yml` (tạo mới), `lighthouserc.js` (tạo mới) |
| **Dependencies** | P3-06 |

### Steps

1. Install `@lhci/cli`:
   ```bash
   pnpm add -D @lhci/cli
   ```
2. Tạo `lighthouserc.js`:
   ```javascript
   module.exports = {
     ci: {
       collect: {
         url: ['http://localhost:3000/', 'http://localhost:3000/accounts'],
         startServerCommand: 'pnpm dev',
         numberOfRuns: 3,
       },
       assert: {
         assertions: {
           'categories:performance': ['warn', { minScore: 0.8 }],
           'categories:accessibility': ['error', { minScore: 0.9 }],
           'categories:best-practices': ['warn', { minScore: 0.9 }],
         },
       },
       upload: {
         target: 'temporary-public-storage',
       },
     },
   };
   ```
3. GitHub Actions workflow cho Lighthouse
4. PR comment với score changes

**Acceptance Criteria:**
- [ ] Lighthouse chạy trên mỗi PR
- [ ] Performance score >= 80
- [ ] Accessibility score >= 90
- [ ] Best practices score >= 90
- [ ] Report link trong PR comment
- [ ] Score regression triggers warning

---

## P3-08: axe-core Integration

| Field | Detail |
|---|---|
| **Task ID** | P3-08 |
| **Mô tả** | Integrate axe-core cho automated accessibility testing. Scan tất cả pages cho WCAG violations. |
| **Files cần tạo/sửa** | `apps/e2e/tests/accessibility.spec.ts` (tạo mới), `apps/e2e/helpers/axe.helper.ts` (tạo mới), `packages/shared-ui/src/test-utils/axe.ts` (tạo mới) |
| **Dependencies** | Không |

### Steps

1. Install dependencies:
   ```bash
   pnpm add -D @axe-core/playwright axe-core jest-axe
   ```
2. Playwright axe helper:
   ```typescript
   import AxeBuilder from '@axe-core/playwright';

   export async function checkA11y(page: Page) {
     const results = await new AxeBuilder({ page })
       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
       .analyze();
     expect(results.violations).toEqual([]);
   }
   ```
3. Jest axe helper cho component tests:
   ```typescript
   import { axe, toHaveNoViolations } from 'jest-axe';
   expect.extend(toHaveNoViolations);
   ```
4. E2E accessibility tests cho mỗi page
5. Component-level axe tests trong unit tests

**Acceptance Criteria:**
- [ ] axe-core scan tất cả main pages
- [ ] Zero WCAG 2.1 AA violations
- [ ] Component-level a11y tests cho shared-ui
- [ ] CI fails nếu có critical a11y violations
- [ ] Report violations rõ ràng với fix suggestions

---

## P3-09: Keyboard Navigation Audit

| Field | Detail |
|---|---|
| **Task ID** | P3-09 |
| **Mô tả** | Audit và fix keyboard navigation cho toàn bộ app. Ensure tất cả interactive elements accessible via keyboard. |
| **Files cần tạo/sửa** | `apps/shell/src/components/Navigation.tsx` (sửa), `apps/shell/src/components/SkipLink.tsx` (tạo mới), `packages/shared-ui/src/components/*/` (sửa nếu cần), `apps/e2e/tests/keyboard-nav.spec.ts` (tạo mới) |
| **Dependencies** | P3-08 |

### Steps

1. Thêm Skip to main content link
2. Audit tab order cho tất cả pages:
   - Login page
   - Dashboard
   - Accounts list + detail
   - Transfer form
   - Admin pages
3. Fix focus management:
   - Focus visible styles (`:focus-visible`)
   - Focus trap cho modals/dialogs
   - Focus restore sau modal close
4. Keyboard shortcuts:
   - `Esc` close modals
   - Arrow keys cho dropdown menus
   - `Enter`/`Space` cho buttons
5. E2E keyboard navigation tests

**Acceptance Criteria:**
- [ ] Skip link hoạt động
- [ ] Tab order logical trên tất cả pages
- [ ] Focus visible rõ ràng (contrast ratio >= 3:1)
- [ ] Modal focus trap
- [ ] Dropdown keyboard navigation
- [ ] E2E tests cho keyboard flows
- [ ] No keyboard traps

---

## P3-10: Screen Reader Testing

| Field | Detail |
|---|---|
| **Task ID** | P3-10 |
| **Mô tả** | Manual + automated testing với screen readers. Ensure meaningful experience cho blind/low-vision users. |
| **Files cần tạo/sửa** | `apps/shell/src/components/LiveRegion.tsx` (tạo mới), `docs/accessibility-checklist.md` (tạo mới), various component files (sửa ARIA attributes) |
| **Dependencies** | P3-09 |

### Steps

1. Tạo LiveRegion component cho dynamic announcements:
   ```typescript
   // aria-live="polite" cho non-urgent updates
   // aria-live="assertive" cho errors
   ```
2. Audit ARIA landmarks:
   - `<header>` / `role="banner"`
   - `<nav>` / `role="navigation"`
   - `<main>` / `role="main"`
   - `<footer>` / `role="contentinfo"`
3. Audit dynamic content:
   - Form validation errors announced
   - Loading states announced
   - Route changes announced
   - Toast notifications announced
4. Manual testing với VoiceOver (macOS):
   - Navigate tất cả pages
   - Complete transfer flow
   - Login/logout flow
5. Document accessibility checklist

**Acceptance Criteria:**
- [ ] ARIA landmarks đúng trên tất cả pages
- [ ] Dynamic content announced qua aria-live
- [ ] Form errors linked via aria-describedby
- [ ] Images có alt text
- [ ] Decorative images có `aria-hidden="true"` hoặc `alt=""`
- [ ] Route change announcements
- [ ] VoiceOver walkthrough documented
- [ ] Accessibility checklist complete

---

## P3-11: Docker Production Setup

| Field | Detail |
|---|---|
| **Task ID** | P3-11 |
| **Mô tả** | Docker production setup với multi-stage builds, nginx reverse proxy, và docker-compose cho deployment. |
| **Files cần tạo/sửa** | `Dockerfile.shell` (tạo mới), `Dockerfile.bff` (tạo mới), `nginx/nginx.conf` (tạo mới), `nginx/default.conf` (tạo mới), `docker-compose.prod.yml` (tạo mới), `.dockerignore` (tạo mới) |
| **Dependencies** | Không (có thể chạy song song với P3-04→P3-10) |

### Steps

1. **Multi-stage Dockerfile cho Frontend (shell)**:
   ```dockerfile
   # Stage 1: Build
   FROM node:20-alpine AS builder
   RUN corepack enable
   WORKDIR /app
   COPY pnpm-lock.yaml package.json ./
   RUN pnpm fetch
   COPY . .
   RUN pnpm install --frozen-lockfile
   RUN pnpm nx build shell

   # Stage 2: Serve
   FROM nginx:alpine
   COPY --from=builder /app/dist/apps/shell /usr/share/nginx/html
   COPY nginx/default.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   ```

2. **Multi-stage Dockerfile cho BFF**:
   ```dockerfile
   FROM node:20-alpine AS builder
   RUN corepack enable
   WORKDIR /app
   COPY pnpm-lock.yaml package.json ./
   RUN pnpm fetch
   COPY . .
   RUN pnpm install --frozen-lockfile
   RUN pnpm nx build bff

   FROM node:20-alpine
   WORKDIR /app
   COPY --from=builder /app/dist/apps/bff .
   COPY --from=builder /app/node_modules ./node_modules
   EXPOSE 4000
   CMD ["node", "main.js"]
   ```

3. **Nginx config**:
   - Reverse proxy `/api/*` to BFF
   - Serve static files cho frontend
   - Gzip compression
   - Cache headers cho static assets
   - SPA fallback (try_files)
   - Security headers (X-Frame-Options, CSP, etc.)

4. **docker-compose.prod.yml**:
   ```yaml
   services:
     nginx:
       build:
         context: .
         dockerfile: Dockerfile.shell
       ports:
         - "80:80"
       depends_on:
         - bff
     bff:
       build:
         context: .
         dockerfile: Dockerfile.bff
       environment:
         - DATABASE_URL=postgresql://...
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - postgres
     postgres:
       image: postgres:16-alpine
       volumes:
         - pgdata:/var/lib/postgresql/data
         - ./bff/scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
       environment:
         - POSTGRES_DB=nab_banking
         - POSTGRES_USER=${DB_USER}
         - POSTGRES_PASSWORD=${DB_PASSWORD}
   volumes:
     pgdata:
   ```

5. **.dockerignore**:
   ```
   node_modules
   dist
   .git
   .env
   *.md
   .nx
   ```

**Acceptance Criteria:**
- [ ] `docker-compose -f docker-compose.prod.yml up` chạy thành công
- [ ] Frontend accessible tại port 80
- [ ] API requests proxy qua nginx đến BFF
- [ ] PostgreSQL data persistent qua restarts
- [ ] Multi-stage build giữ image size nhỏ (< 100MB cho frontend, < 200MB cho BFF)
- [ ] Gzip compression enabled
- [ ] Security headers configured
- [ ] Environment variables qua `.env` file (không hardcode secrets)
- [ ] Health check endpoints
- [ ] Graceful shutdown handling
