# NAB Banking Portal - Documentation

## Cấu trúc thư mục

```
docs/
├── README.md                      # File này
├── backlog/                       # Product Backlog & User Stories
│   └── product-backlog.md         # Sprint backlog với UI specs
└── notes/                         # Ghi chú học tập cho interview
    └── nx-and-monorepo.md         # Nx & pnpm workspaces
```

## Quick Links

### Product Backlog
- [Product Backlog](./backlog/product-backlog.md) - User stories, acceptance criteria, UI specifications

### Learning Notes
- [Nx & Monorepo](./notes/nx-and-monorepo.md) - Nx, pnpm workspaces, interview questions

## Interview Topics Coverage

| Topic | Documentation | Code Reference |
|-------|---------------|----------------|
| Micro-frontend | [Backlog](./backlog/product-backlog.md#epic-6-micro-frontend-remotes) | `apps/shell/rspack.config.ts` |
| Module Federation | [Notes](./notes/nx-and-monorepo.md) | Bootstrap pattern |
| React Hooks | [Backlog](./backlog/product-backlog.md#interview-topics-mapping) | `apps/shell/src/` |
| TypeScript | [Backlog](./backlog/product-backlog.md#interview-topics-mapping) | `packages/shared-ui/src/` |
| Testing | [Backlog](./backlog/product-backlog.md#epic-7-testing) | `*.test.tsx` files |
| BFF Pattern | [Backlog](./backlog/product-backlog.md#api-endpoints-reference) | `bff/src/` |
| Monorepo | [Nx Notes](./notes/nx-and-monorepo.md) | `nx.json`, `pnpm-workspace.yaml` |
| CSS/Styling | [Backlog](./backlog/product-backlog.md) | `*.module.scss` |
| Accessibility | [Backlog](./backlog/product-backlog.md#epic-4-money-transfer) | ARIA, keyboard nav |

## Cách sử dụng

1. **Bắt đầu task mới**: Xem [Product Backlog](./backlog/product-backlog.md), chọn User Story
2. **Học concepts**: Đọc files trong `notes/`
3. **Ôn interview**: Review Interview Topics Mapping trong backlog
