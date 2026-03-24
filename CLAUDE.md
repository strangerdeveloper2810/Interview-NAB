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

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
