# Nx & pnpm Workspaces - Notes for Interview

## 1. pnpm Workspaces

### Là gì?
pnpm workspaces cho phép quản lý nhiều packages trong 1 repository (monorepo). Mỗi package có `package.json` riêng nhưng share `node_modules`.

### Cấu hình
```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"      # Tất cả folders trong apps/
  - "packages/*"  # Tất cả folders trong packages/
```

### Cách hoạt động
```
nab-banking-portal/
├── node_modules/          # Shared dependencies
├── pnpm-workspace.yaml    # Định nghĩa workspaces
├── package.json           # Root package.json
├── apps/
│   ├── shell/
│   │   └── package.json   # name: "shell"
│   └── bff/
│       └── package.json   # name: "bff"
└── packages/
    └── shared-ui/
        └── package.json   # name: "@nab/shared-ui"
```

### Internal Dependencies
```json
// apps/shell/package.json
{
  "dependencies": {
    "@nab/shared-ui": "workspace:*"  // Link đến package local
  }
}
```

- `workspace:*` = luôn dùng version mới nhất từ local
- `workspace:^1.0.0` = dùng version compatible với 1.0.0

### Commands hữu ích
```bash
# Install tất cả dependencies
pnpm install

# Run script trong 1 package cụ thể
pnpm --filter shell dev
pnpm --filter @nab/shared-ui build

# Run script trong tất cả packages
pnpm -r build              # Recursive
pnpm -r --parallel dev     # Parallel (không cần thứ tự)

# Add dependency vào package cụ thể
pnpm --filter shell add axios
pnpm --filter shell add -D jest

# Add dependency vào root (dev tools)
pnpm add -D typescript -w  # -w = workspace root
```

### Ưu điểm pnpm vs npm/yarn
| Feature | pnpm | npm/yarn |
|---------|------|----------|
| Disk space | Dùng hard links, tiết kiệm disk | Duplicate mỗi project |
| Install speed | Nhanh hơn 2-3x | Chậm hơn |
| Strictness | Strict, không access phantom deps | Có thể access phantom deps |
| Monorepo | Native workspaces support | Cần config thêm |

### Phantom Dependencies
```javascript
// ❌ Phantom dependency (không declare trong package.json)
// npm/yarn cho phép, pnpm không cho
import lodash from 'lodash'; // lodash được install bởi package khác

// ✅ Correct - declare trong package.json
// pnpm bắt buộc phải khai báo
```

---

## 2. Nx

### Là gì?
Nx là build system cho monorepo, cung cấp:
- **Task caching** - Không rebuild nếu code không đổi
- **Affected commands** - Chỉ build/test packages bị ảnh hưởng
- **Dependency graph** - Visualize project dependencies
- **Code generators** - Scaffold code nhanh
- **Plugins** - Tích hợp với React, Jest, Storybook, etc.

### Cấu hình chính

#### nx.json
```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies trước
      "cache": true,
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "cache": true
    }
  },
  "defaultBase": "main"
}
```

#### project.json (hoặc inferred từ package.json)
```json
{
  "name": "shell",
  "root": "apps/shell",
  "targets": {
    "build": {
      "executor": "@nx/rspack:build",
      "options": {
        "outputPath": "dist/apps/shell"
      }
    }
  }
}
```

### Commands quan trọng

```bash
# Build 1 project
pnpm nx build shell

# Build nhiều projects
pnpm nx run-many -t build -p shell,bff

# Build tất cả
pnpm nx run-many -t build

# Build những gì bị ảnh hưởng bởi changes
pnpm nx affected -t build

# Test affected
pnpm nx affected -t test

# Xem dependency graph (mở browser)
pnpm nx graph

# Xem project info
pnpm nx show project shell

# List tất cả projects
pnpm nx show projects

# Reset cache
pnpm nx reset
```

### Task Caching

```bash
# Lần đầu build - chạy thật
$ pnpm nx build shell
> Executing build...
> Done in 5.2s

# Lần 2 build (không đổi code) - lấy từ cache
$ pnpm nx build shell
> Nx read the output from the cache instead of running the command for 1 task.
> Done in 0.3s
```

**Cache được lưu ở đâu?**
- Local: `.nx/cache/`
- Remote: Nx Cloud (optional)

**Khi nào cache bị invalidate?**
- Source files thay đổi
- Dependencies thay đổi
- Config thay đổi (nx.json, project.json)
- Environment variables thay đổi

### Affected Commands

```bash
# Giả sử bạn sửa file trong shared-ui
$ git diff
> packages/shared-ui/src/Button.tsx

# Nx biết shell phụ thuộc vào shared-ui
$ pnpm nx affected -t build
> Building: @nab/shared-ui, shell  # Chỉ 2 projects bị ảnh hưởng
> Skipping: bff                     # bff không phụ thuộc shared-ui
```

**Cách Nx biết affected?**
1. Phân tích dependency graph từ imports
2. So sánh với `defaultBase` (main branch)
3. Tìm projects bị ảnh hưởng bởi changed files

### Dependency Graph

```
┌─────────────────────────────────────────────┐
│                                             │
│   shell ──────────► @nab/shared-ui         │
│                                             │
│   bff (độc lập, không connect)             │
│                                             │
└─────────────────────────────────────────────┘

- shell depends on @nab/shared-ui
- Khi shared-ui thay đổi → shell cần rebuild
- bff độc lập → không bị ảnh hưởng
```

### Nx Plugins

| Plugin | Chức năng |
|--------|-----------|
| @nx/rspack | Build với Rspack |
| @nx/jest | Testing với Jest |
| @nx/storybook | Storybook integration |
| @nx/react | React generators |
| @nx/node | Node.js apps |

### Generators

```bash
# Tạo React component
pnpm nx g @nx/react:component Button --project=shared-ui

# Tạo React app
pnpm nx g @nx/react:app dashboard

# Tạo library
pnpm nx g @nx/js:lib utils
```

---

## 3. So sánh: pnpm Workspaces vs Nx

| Aspect | pnpm Workspaces | pnpm + Nx |
|--------|-----------------|-----------|
| Package management | ✅ Yes | ✅ Yes (pnpm underneath) |
| Task caching | ❌ No | ✅ Yes |
| Affected commands | ❌ No | ✅ Yes |
| Dependency graph | ❌ No | ✅ Yes |
| Remote caching | ❌ No | ✅ Yes (Nx Cloud) |
| Code generators | ❌ No | ✅ Yes |
| Learning curve | Low | Medium |
| Setup complexity | Simple | Medium |

**Khi nào dùng gì?**
- **pnpm workspaces alone**: Project nhỏ, team nhỏ, đơn giản
- **pnpm + Nx**: Project lớn, team lớn, cần CI/CD optimization

---

## 4. Interview Questions

### Q: Monorepo là gì? Ưu/nhược điểm?
**A:** Monorepo là pattern lưu nhiều projects trong 1 Git repository.

**Ưu điểm:**
- Shared code dễ dàng (shared-ui)
- Atomic changes (sửa API + FE cùng 1 commit)
- Consistent tooling (ESLint, TypeScript config)
- Dễ refactor across projects

**Nhược điểm:**
- Git history lớn
- CI/CD phức tạp hơn
- Permission khó quản lý (ai được sửa gì)
- Build time có thể lâu (cần cache)

### Q: Nx cải thiện monorepo như thế nào?
**A:**
1. **Caching** - Không rebuild code không đổi
2. **Affected** - Chỉ build/test phần bị ảnh hưởng
3. **Parallelization** - Chạy tasks song song
4. **Remote caching** - Share cache giữa team members và CI

### Q: `workspace:*` trong pnpm là gì?
**A:** Protocol để link internal packages. pnpm sẽ symlink thay vì download từ npm. `*` = dùng bất kỳ version nào (luôn mới nhất local).

### Q: Phantom dependency là gì?
**A:** Dependency không declare trong package.json nhưng vẫn access được (vì package khác đã install). pnpm strict mode ngăn chặn điều này, giúp dependencies explicit và reliable.

### Q: Nx affected hoạt động như thế nào?
**A:**
1. Tính dependency graph từ imports
2. Lấy list files changed (git diff với base branch)
3. Map files → projects chứa files đó
4. Tìm tất cả projects phụ thuộc vào projects đó
5. Chỉ run task trên affected projects

---

## 5. Project Setup Recap

```bash
# 1. Init pnpm workspace
pnpm init
# Tạo pnpm-workspace.yaml

# 2. Tạo packages
mkdir -p apps/shell apps/bff packages/shared-ui
# Mỗi folder có package.json riêng

# 3. Install dependencies
pnpm install

# 4. Add Nx (optional, recommended)
pnpm add -D nx @nx/js -w
pnpm nx init

# 5. Add Nx plugins
pnpm add -D @nx/rspack @nx/jest @nx/storybook -w
```

**Files quan trọng:**
```
├── pnpm-workspace.yaml   # Định nghĩa workspaces
├── nx.json               # Nx configuration
├── package.json          # Root dependencies
└── apps/shell/
    ├── package.json      # App dependencies
    └── project.json      # Nx project config (optional)
```
