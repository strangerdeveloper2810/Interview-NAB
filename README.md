# NAB Banking Portal

Dự án demo Micro-frontend Banking Portal phục vụ phỏng vấn vị trí Frontend Engineer tại NAB Vietnam.

## Tổng quan

NAB Banking Portal là một ứng dụng ngân hàng số được xây dựng theo kiến trúc Micro-frontend, sử dụng Module Federation để chia sẻ components và modules giữa các ứng dụng. Dự án bao gồm Shell app (Host), Shared UI package, và BFF (Backend for Frontend) với đầy đủ các tính năng authentication, quản lý tài khoản, giao dịch và chuyển tiền.

## Tech Stack

### Frontend
- **React 18** + **TypeScript** - UI framework và type safety
- **Rspack** - Build tool hiệu năng cao (Rust-based)
- **Module Federation** - Chia sẻ modules giữa các micro-frontends
- **CSS Modules / SCSS** - Styling với scoped CSS
- **Jest** + **React Testing Library** - Unit testing

### Backend (BFF)
- **Express.js** - Node.js web framework
- **PostgreSQL** - Relational database
- **Redis** - Caching và session management
- **JWT** - Authentication với access + refresh tokens

### DevOps & Tooling
- **pnpm workspaces** - Monorepo management
- **Docker Compose** - Container orchestration
- **Storybook 8.x** - Component documentation và development

## Cấu trúc dự án

```
nab-banking-portal/
├── apps/
│   └── shell/                    # Host app với Module Federation
│       ├── src/
│       │   ├── components/       # Shell-specific components
│       │   ├── pages/            # Page components
│       │   ├── hooks/            # Custom React hooks
│       │   ├── services/         # API services
│       │   ├── store/            # State management
│       │   └── bootstrap.tsx     # Module Federation bootstrap
│       └── rspack.config.ts      # Rspack + Module Federation config
│
├── packages/
│   └── shared-ui/                # Shared UI components
│       ├── src/
│       │   ├── components/       # Reusable components
│       │   │   ├── Button/
│       │   │   ├── Card/
│       │   │   ├── Input/
│       │   │   ├── AccountCard/
│       │   │   ├── TransactionItem/
│       │   │   ├── AmountDisplay/
│       │   │   ├── Badge/
│       │   │   ├── Avatar/
│       │   │   ├── Alert/
│       │   │   └── Skeleton/
│       │   └── index.ts          # Public exports
│       └── .storybook/           # Storybook configuration
│
├── bff/                          # Backend for Frontend
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── repositories/         # Data access layer
│   │   ├── middlewares/          # Auth, validation, error handling
│   │   ├── routes/               # API routes
│   │   └── utils/                # Helpers và utilities
│   └── prisma/                   # Database schema và migrations
│
├── docker-compose.yml            # Docker services configuration
├── pnpm-workspace.yaml           # pnpm workspaces config
└── package.json                  # Root package.json
```

## Bắt đầu

### Yêu cầu hệ thống

- Node.js >= 18.x
- pnpm >= 8.x
- Docker và Docker Compose

### Cài đặt

1. **Clone repository và cài đặt dependencies:**

```bash
cd nab-banking-portal
pnpm install
```

2. **Khởi động Docker services (PostgreSQL, Redis):**

```bash
docker-compose up -d
```

3. **Cấu hình environment variables:**

```bash
# Tạo file .env trong thư mục bff/
cp bff/.env.example bff/.env
```

4. **Chạy database migrations (nếu có Prisma):**

```bash
cd bff
pnpm prisma migrate dev
```

5. **Khởi động development servers:**

```bash
# Từ root directory
pnpm dev
```

### Truy cập ứng dụng

- **Shell App:** http://localhost:3000
- **BFF API:** http://localhost:4000
- **Storybook:** http://localhost:6006
- **Adminer (DB Admin):** http://localhost:8080

## Scripts

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Khởi động tất cả apps (shell, bff, storybook) |
| `pnpm dev:shell` | Chỉ khởi động Shell app (port 3000) |
| `pnpm dev:bff` | Chỉ khởi động BFF server (port 4000) |
| `pnpm dev:storybook` | Khởi động Storybook (port 6006) |
| `pnpm build` | Build tất cả packages và apps |
| `pnpm test` | Chạy test suites |
| `pnpm lint` | Chạy ESLint |
| `pnpm typecheck` | Kiểm tra TypeScript types |

## API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập, trả về access + refresh tokens |
| POST | `/api/auth/refresh` | Làm mới access token |
| POST | `/api/auth/logout` | Đăng xuất, invalidate tokens |

### User Profile

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/user/profile` | Lấy thông tin user hiện tại |
| PUT | `/api/user/profile` | Cập nhật thông tin user |

### Accounts

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/accounts` | Danh sách tài khoản của user |
| GET | `/api/accounts/:id` | Chi tiết một tài khoản |

### Transactions

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/transactions` | Lịch sử giao dịch (có pagination) |
| GET | `/api/transactions/:id` | Chi tiết một giao dịch |

### Transfers

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/transfers` | Tạo lệnh chuyển tiền mới |
| GET | `/api/transfers/:id` | Trạng thái chuyển tiền |

### Dashboard

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/dashboard` | Dữ liệu tổng hợp cho dashboard |

## Docker Services

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: nab
      POSTGRES_PASSWORD: nab123
      POSTGRES_DB: nab_banking

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  adminer:
    image: adminer
    ports:
      - "8080:8080"
```

### Kết nối Database

- **PostgreSQL:** `postgresql://nab:nab123@localhost:5432/nab_banking`
- **Redis:** `redis://localhost:6379`
- **Adminer:** http://localhost:8080 (Server: postgres, User: nab, Password: nab123)

## Interview Topics Coverage

Dự án này được thiết kế để demonstrate kiến thức về các chủ đề phỏng vấn Frontend Engineer:

### 1. Micro-frontend Architecture
- Module Federation configuration và bootstrap pattern
- Shared dependencies management
- Remote/Host application communication

### 2. React & TypeScript
- React 18 features (Suspense, Concurrent rendering)
- TypeScript strict mode và type safety
- Custom hooks pattern
- Component composition

### 3. State Management
- Context API / Zustand / Redux Toolkit
- Server state với React Query/SWR
- Authentication state handling

### 4. Styling Architecture
- CSS Modules với SCSS
- Design tokens và theming
- Responsive design
- Modern UI (gradients, glassmorphism)

### 5. Testing
- Unit testing với Jest
- Component testing với React Testing Library
- Test coverage và best practices

### 6. Build Tools & Performance
- Rspack configuration
- Code splitting và lazy loading
- Bundle optimization

### 7. Backend Integration
- RESTful API design
- JWT authentication flow (access + refresh tokens)
- BFF pattern (Controller → Service → Repository)
- Database design với PostgreSQL
- Caching strategy với Redis

### 8. DevOps & Tooling
- Monorepo với pnpm workspaces
- Docker containerization
- Environment configuration

### 9. Component Library
- Storybook documentation
- Reusable component design
- Props và variants pattern
- Accessibility (a11y)

## Tài liệu tham khảo

- [Module Federation Documentation](https://module-federation.io/)
- [Rspack Documentation](https://rspack.dev/)
- [React 18 Documentation](https://react.dev/)
- [Storybook Documentation](https://storybook.js.org/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

**Note:** Dự án này được xây dựng cho mục đích học tập và phỏng vấn. Không sử dụng trong môi trường production.
