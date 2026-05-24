# Current Task

## 当前任务

- 名称：用户管理 userId 精确筛选契约适配
- OpenSpec 变更：无
- 当前 HEAD：以 Git log 为准

## 当前状态

- 已完成；提交和推送状态以当前 Git log 与远程分支为准。

## 已完成

- 完成代码分析：后端 `miniapp-backend` 已补齐 `POST /api/admin/users/page` 的 `userId` 精确筛选字段，管理后台不应再把 `/users?userId=...` 塞进 `keywords` 做模糊排查。
- `src/api/adminUsers.ts` 的 `AdminUserPageQuery` 增加 `userId?: number`。
- `src/pages/users/UsersPage.vue` 新增独立“用户ID”筛选项，合法正整数且不超过 JS 安全整数范围时下发 `userId`，关键词保持独立。
- `/users?userId=...` 进入用户管理页时会初始化用户 ID 筛选框并展示“精确筛选”提示；非法、空白、小数、负数、数组首项非法和超出 JS 安全整数范围的 query 不下发 `userId`。
- `src/api/adminUsers.test.ts` 覆盖用户分页请求体携带 `userId`。
- `src/pages/users/UsersPage.test.ts` 覆盖合法 query、数组 query、非法 query、超出 JS 安全整数范围 query、关键词不污染和页面提示文案。
- 更新 `docs/变更日志.md` 和 `codex-handoff.md`。

## 未完成

- 需后续用真实后端数据联调 `/users?userId=...`，确认后端精确筛选返回单个统一用户。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts`：旧代码仍把 `/users?userId=123` 下发为 `keywords: "123"`，没有 `userId: 123`。
- REVIEW RED：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts`：新增超出 JS 安全整数范围用例后失败，旧代码把 `9007199254740993` 静默转换为 `9007199254740992` 下发。
- GREEN：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts`：1 个测试文件、9 个 Vitest 测试通过。
- GREEN：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts`：2 个测试文件、13 个 Vitest 测试通过。
- 相关定向：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts`：4 个测试文件、23 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：15 个测试文件、52 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 下一步

1. 用真实数据联调 `/users?userId=...`，确认后端 `userId` 精确筛选命中单个统一用户。
2. 后端服务请求 MVP API 就绪后，新增服务请求管理页和对应权限入口。
