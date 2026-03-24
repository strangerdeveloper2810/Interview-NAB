# CLAUDE.md - Project Guidelines

## Project Overview
NAB Vietnam Frontend Interview Preparation Project - Banking dashboard demo với Micro-frontend architecture.

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Rspack (Module Federation)
- **Styling**: CSS Modules / SCSS (BEM naming)
- **State Management**: Context + useReducer (auth), Zustand (server state)
- **Testing**: Jest + RTL (unit/integration), Playwright (E2E)
- **BFF**: Express.js

## Working Style

### User codes 80%, Claude reviews 20%
- User tự code phần lớn - Claude chỉ review khi được yêu cầu
- Khi user cần "vibecode" - Claude có thể suggest code snippets ngắn
- Không tự động refactor hoặc thêm code nếu không được hỏi

### Review Guidelines
Khi review code, focus vào:
1. **Bugs/Logic errors** - Lỗi logic, edge cases
2. **Performance** - Unnecessary re-renders, missing memoization
3. **Accessibility** - Missing ARIA, keyboard navigation
4. **TypeScript** - Type safety, proper typing
5. **Security** - XSS, injection vulnerabilities

### Response Style
- Ngắn gọn, đi thẳng vào vấn đề
- Không giải thích dài dòng nếu user không hỏi
- Code suggestions dạng snippet, không full file
- Tiếng Việt là chính, technical terms giữ nguyên

## Project Structure
```
interview-nab/
├── apps/
│   ├── shell/          # Host app (Module Federation)
│   ├── dashboard/      # Remote: Dashboard module
│   ├── accounts/       # Remote: Accounts module
│   └── bff/            # Express BFF server
├── packages/
│   └── shared-ui/      # Shared components
└── docs/
    └── plans/          # Q&A cheat sheets
```

## Code Conventions

### Naming
- Components: PascalCase (`AccountCard.tsx`)
- Hooks: camelCase với "use" prefix (`useAccounts.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- CSS: BEM (`.card__title--large`)

### File Organization
```tsx
// 1. Imports (external → internal → types → styles)
// 2. Types/Interfaces
// 3. Component
// 4. Export
```

### Testing
- Unit tests: `*.test.ts` cùng folder với source
- E2E tests: `apps/e2e/tests/`
- Query priority: getByRole > getByLabelText > getByText > getByTestId

## Commands
```bash
# Development
pnpm dev              # Start all apps
pnpm dev:shell        # Start shell only
pnpm dev:bff          # Start BFF server

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run Playwright tests

# Build
pnpm build            # Build all apps
```

## Interview Focus Areas
1. JavaScript fundamentals (closures, event loop, promises)
2. React hooks & performance optimization
3. CSS (flexbox, grid, positioning, BEM)
4. Accessibility (WCAG, ARIA, keyboard nav)
5. Testing pyramid (Jest, RTL, Playwright)
6. Micro-frontend & Module Federation
7. BFF pattern
