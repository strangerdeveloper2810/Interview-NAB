# NAB Banking Portal - BFF (Backend for Frontend)

## Tổng quan

BFF layer được thiết kế theo **Layered Architecture** pattern, tách biệt rõ ràng giữa các tầng xử lý:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Shell App)                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MIDDLEWARE LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   CORS      │  │   Helmet    │  │   Logger    │  │   Auth Middleware   │ │
│  │  (cors)     │  │  (security) │  │ (requests)  │  │  (JWT verify)       │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROUTES LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ /api/auth   │  │ /api/users  │  │/api/accounts│  │  /api/transfers     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CONTROLLER LAYER                                 │
│                     (Handle HTTP request/response)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    Auth     │  │    User     │  │   Account   │  │     Transfer        │ │
│  │ Controller  │  │ Controller  │  │ Controller  │  │    Controller       │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                                             │
│  Responsibilities:                                                          │
│  - Parse request body, params, query                                        │
│  - Validate input                                                           │
│  - Call service layer                                                       │
│  - Format HTTP response                                                     │
│  - Handle errors với next(error)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVICE LAYER                                   │
│                         (Business Logic)                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    Auth     │  │    User     │  │   Account   │  │     Dashboard       │ │
│  │   Service   │  │   Service   │  │   Service   │  │      Service        │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                                             │
│  Responsibilities:                                                          │
│  - Business rules và validation                                             │
│  - Orchestrate multiple repositories                                        │
│  - Transform data                                                           │
│  - Throw AppError khi có lỗi business                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REPOSITORY LAYER                                  │
│                          (Data Access)                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ UserRepository  │  │AccountRepository│  │   TransactionRepository     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                             │
│  Responsibilities:                                                          │
│  - SQL queries                                                              │
│  - CRUD operations                                                          │
│  - Return raw data                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE                                       │
│  ┌───────────────────────────────┐  ┌─────────────────────────────────────┐ │
│  │         PostgreSQL            │  │              Redis                  │ │
│  │  - users                      │  │  - Session cache                    │ │
│  │  - accounts                   │  │  - Rate limiting                    │ │
│  │  - transactions               │  │                                     │ │
│  └───────────────────────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Cấu trúc thư mục

```
bff/
├── src/
│   ├── index.ts                 # Entry point, Express app setup
│   ├── config/
│   │   └── database.ts          # PostgreSQL connection config
│   ├── middleware/
│   │   ├── authMiddleware.ts    # JWT verification
│   │   ├── errorHandler.ts      # Global error handling
│   │   └── requestLogger.ts     # Request/Response logging
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── authRoutes.ts        # /api/auth/*
│   │   ├── userRoutes.ts        # /api/users/*
│   │   ├── accountRoutes.ts     # /api/accounts/*
│   │   ├── transferRoutes.ts    # /api/transfers/*
│   │   └── dashboardRoutes.ts   # /api/dashboard/*
│   ├── controllers/
│   │   ├── authController.ts    # Auth request handlers
│   │   ├── userController.ts    # User request handlers
│   │   ├── accountController.ts # Account request handlers
│   │   ├── transferController.ts# Transfer request handlers
│   │   └── dashboardController.ts
│   ├── services/
│   │   ├── authService.ts       # Auth business logic
│   │   ├── userService.ts       # User business logic
│   │   ├── accountService.ts    # Account business logic
│   │   └── dashboardService.ts  # Dashboard aggregation
│   ├── repositories/
│   │   ├── userRepository.ts    # User data access
│   │   ├── accountRepository.ts # Account data access
│   │   └── transactionRepository.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── utils/
│       └── jwt.ts               # JWT utilities
├── scripts/
│   └── init.sql                 # Database initialization
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
└── nodemon.json                 # Dev server config
```

## Authentication Flow

### Register Flow
```
┌────────┐          ┌────────────┐          ┌─────────────┐          ┌──────────────┐
│ Client │          │ Controller │          │   Service   │          │  Repository  │
└───┬────┘          └─────┬──────┘          └──────┬──────┘          └──────┬───────┘
    │                     │                        │                        │
    │ POST /auth/register │                        │                        │
    │ {email,password,name}                        │                        │
    │────────────────────>│                        │                        │
    │                     │                        │                        │
    │                     │ authService.register() │                        │
    │                     │───────────────────────>│                        │
    │                     │                        │                        │
    │                     │                        │ findByEmail(email)     │
    │                     │                        │───────────────────────>│
    │                     │                        │                        │
    │                     │                        │      null (not exist)  │
    │                     │                        │<───────────────────────│
    │                     │                        │                        │
    │                     │                        │ bcrypt.hash(password)  │
    │                     │                        │─────────┐              │
    │                     │                        │         │              │
    │                     │                        │<────────┘              │
    │                     │                        │                        │
    │                     │                        │ create(email,name,hash)│
    │                     │                        │───────────────────────>│
    │                     │                        │                        │
    │                     │                        │         user           │
    │                     │                        │<───────────────────────│
    │                     │                        │                        │
    │                     │                        │ jwtUtils.generateTokenPair()
    │                     │                        │─────────┐              │
    │                     │                        │         │              │
    │                     │                        │<────────┘              │
    │                     │                        │                        │
    │                     │    {user, tokens}      │                        │
    │                     │<───────────────────────│                        │
    │                     │                        │                        │
    │   201 {user, tokens}│                        │                        │
    │<────────────────────│                        │                        │
    │                     │                        │                        │
```

### Login Flow
```
┌────────┐          ┌────────────┐          ┌─────────────┐          ┌──────────────┐
│ Client │          │ Controller │          │   Service   │          │  Repository  │
└───┬────┘          └─────┬──────┘          └──────┬──────┘          └──────┬───────┘
    │                     │                        │                        │
    │ POST /auth/login    │                        │                        │
    │ {email, password}   │                        │                        │
    │────────────────────>│                        │                        │
    │                     │                        │                        │
    │                     │ authService.login()    │                        │
    │                     │───────────────────────>│                        │
    │                     │                        │                        │
    │                     │                        │ findByEmail(email)     │
    │                     │                        │───────────────────────>│
    │                     │                        │                        │
    │                     │                        │         user           │
    │                     │                        │<───────────────────────│
    │                     │                        │                        │
    │                     │                        │ bcrypt.compare()       │
    │                     │                        │─────────┐              │
    │                     │                        │         │              │
    │                     │                        │<────────┘ true         │
    │                     │                        │                        │
    │                     │                        │ generateTokenPair()    │
    │                     │                        │─────────┐              │
    │                     │                        │         │              │
    │                     │                        │<────────┘              │
    │                     │                        │                        │
    │                     │    {user, tokens}      │                        │
    │                     │<───────────────────────│                        │
    │                     │                        │                        │
    │   200 {user, tokens}│                        │                        │
    │<────────────────────│                        │                        │
```

### Protected Route Flow
```
┌────────┐       ┌──────────────┐       ┌────────────┐       ┌─────────────┐
│ Client │       │ AuthMiddleware│       │ Controller │       │   Service   │
└───┬────┘       └──────┬───────┘       └─────┬──────┘       └──────┬──────┘
    │                   │                     │                     │
    │ GET /api/accounts │                     │                     │
    │ Authorization:    │                     │                     │
    │ Bearer <token>    │                     │                     │
    │──────────────────>│                     │                     │
    │                   │                     │                     │
    │                   │ jwtUtils.verify()   │                     │
    │                   │────────┐            │                     │
    │                   │        │            │                     │
    │                   │<───────┘            │                     │
    │                   │                     │                     │
    │                   │ req.user = payload  │                     │
    │                   │─────────────────────>                     │
    │                   │                     │                     │
    │                   │                     │ getAccounts(userId) │
    │                   │                     │────────────────────>│
    │                   │                     │                     │
    │                   │                     │      accounts       │
    │                   │                     │<────────────────────│
    │                   │                     │                     │
    │           200 {accounts}                │                     │
    │<────────────────────────────────────────│                     │
```

## JWT Token Strategy

### Token Pair
```typescript
interface TokenPair {
  accessToken: string;   // Expire: 15 minutes
  refreshToken: string;  // Expire: 7 days
}
```

### Access Token
- **Dùng để**: Authenticate API requests
- **Expire**: 15 phút (ngắn để giảm risk nếu bị lộ)
- **Lưu ở client**: Memory (không localStorage vì XSS risk)

### Refresh Token
- **Dùng để**: Lấy access token mới khi hết hạn
- **Expire**: 7 ngày
- **Lưu ở client**: HttpOnly cookie (recommended) hoặc localStorage

### Refresh Flow
```
┌────────┐                    ┌────────────┐
│ Client │                    │    BFF     │
└───┬────┘                    └─────┬──────┘
    │                               │
    │ API request với expired token │
    │──────────────────────────────>│
    │                               │
    │         401 Unauthorized      │
    │<──────────────────────────────│
    │                               │
    │ POST /auth/refresh            │
    │ {refreshToken}                │
    │──────────────────────────────>│
    │                               │
    │    {accessToken, refreshToken}│
    │<──────────────────────────────│
    │                               │
    │ Retry original request        │
    │ với new accessToken           │
    │──────────────────────────────>│
    │                               │
    │           200 OK              │
    │<──────────────────────────────│
```

## Error Handling

### AppError Class
```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

// Usage
throw new AppError(404, 'Account not found', 'ACCOUNT_NOT_FOUND');
throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
throw new AppError(400, 'Insufficient balance', 'INSUFFICIENT_BALANCE');
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Success Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

## Environment Variables

```bash
# .env
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://nab_user:nab_password@localhost:5432/nab_banking

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

## Scripts

```bash
# Development với hot reload
pnpm dev

# Build TypeScript
pnpm build

# Start production server
pnpm start
```

## Testing với cURL

### Register
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Get Accounts (Protected)
```bash
curl http://localhost:4000/api/accounts \
  -H "Authorization: Bearer <your-access-token>"
```

### Transfer Money
```bash
curl -X POST http://localhost:4000/api/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-access-token>" \
  -d '{"fromAccountId":1,"toAccountId":2,"amount":100000,"description":"Test transfer"}'
```

## Interview Topics từ BFF

### 1. Layered Architecture
- **Tại sao tách layers?** Separation of concerns, testability, maintainability
- **Controller vs Service?** Controller handle HTTP, Service handle business logic
- **Repository pattern?** Abstract data access, dễ thay đổi database

### 2. JWT Authentication
- **Tại sao dùng 2 tokens?** Access token ngắn hạn (security), refresh token dài hạn (UX)
- **Lưu token ở đâu?** Access: memory, Refresh: HttpOnly cookie
- **Refresh flow?** Khi access expired, dùng refresh để lấy token mới

### 3. Error Handling
- **Centralized error handler** - Một chỗ xử lý tất cả errors
- **Custom AppError** - Consistent error format
- **Error codes** - Frontend có thể handle specific errors

### 4. Security
- **Helmet** - HTTP security headers
- **CORS** - Control allowed origins
- **bcrypt** - Password hashing (không lưu plain text)
- **Input validation** - Prevent injection attacks
