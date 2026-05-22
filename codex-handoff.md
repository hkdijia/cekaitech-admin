# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：后台 MVP 壳已接入 `miniapp-backend` 数据库管理员登录、工作区、工作区菜单、用户分页/详情、开发态演示数据、用户限制管理、用户主状态调整接口和用户操作日志查询；已适配后端 `/api/admin/**` 全局鉴权、细粒度权限码、登录失效处理和当前管理员改密。
- 最近完成：全局菜单按 `permissionCode` 过滤，路由按 `meta.permissionCode` 拦截，工作区菜单按后端权限码过滤，用户管理和限制管理的高风险按钮按权限显示。
- 未完成：权限配置页面、数据导入真实流程、Redis/JWT 等生产级 session 机制

## 关键文件

- `docs/admin-mvp-design.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `docs/变更日志.md`
- `docs/production-runbook.md`
- `.env.production.example`
- `README.md`
- `AGENTS.md`
- `package.json`
- `src/router/index.ts`
- `src/router/menu.ts`
- `src/layouts/AdminLayout.vue`
- `src/api/http.ts`
- `src/api/http.test.ts`
- `src/main.ts`
- `src/api/adminAuth.ts`
- `src/api/adminAuth.test.ts`
- `src/api/adminWorkspace.ts`
- `src/api/adminUsers.ts`
- `src/api/adminUserRestrictions.ts`
- `src/api/adminUserOperationLogs.ts`
- `src/stores/auth.ts`
- `src/stores/workspace.ts`
- `src/pages/users/UsersPage.vue`
- `src/pages/restrictions/RestrictionsPage.vue`
- `src/pages/settings/SettingsPage.vue`
- `src/pages/workspace-menu/WorkspaceMenuPage.vue`

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`

## 最近验证

- `npm.cmd test`：通过，16 个 Vitest 测试通过。
- `npm.cmd run quality`：通过，16 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- 登录失效 API 单测：`src/api/http.test.ts` 通过，覆盖受保护接口 401 清 token 和登录接口 401 不触发全局失效。
- 用户限制 API 单测：`src/api/adminUserRestrictions.test.ts` 通过，覆盖分页、创建和取消接口。
- `miniapp-backend` 联调：`POST /api/admin/auth/login` 通过，返回 `dev-admin-token`。
- `miniapp-backend` 联调：`GET /api/admin/workspaces` 和 `GET /api/admin/workspaces/1/menus` 通过。
- 用户管理 API 单测：`src/api/adminUsers.test.ts` 通过，覆盖分页、详情、演示数据生成和状态调整接口。
- 用户状态调整请求已覆盖 Authorization 头自动注入。
- 用户操作日志 API 单测：`src/api/adminUserOperationLogs.test.ts` 通过，覆盖分页接口。
- 管理员认证 API 单测：`src/api/adminAuth.test.ts` 通过，覆盖改密请求携带 Bearer token。
- `npm.cmd run quality`：通过，21 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。

## 注意事项

- 当前接入后台数据库管理员登录接口，默认账号仍为 `admin/123456`，生产前必须改密或建立正式管理员。
- Vite 开发环境通过 `/api` 代理到 `http://127.0.0.1:8080`，需要先启动 `miniapp-backend`。
- 若 8080 被旧后端占用，可用 `VITE_API_BASE_URL=http://127.0.0.1:8081` 启动前端，并让后端运行在 8081。
- “生成演示数据”按钮仅用于本地开发 profile 的空库联调。
- 用户管理页可调整用户主状态；后端会联动账号级全局限制，前端不直接操作限制表。
- 通用请求会自动读取 `cekaitech-admin-token` 并附加 Bearer token；登录接口本身不附加旧 token。
- 非登录接口收到 HTTP 401 时会清理本地 token，并通过全局事件跳转登录页。
- 生产构建时 `VITE_API_BASE_URL` 应指向 `https://api.cekaitech.cn`，前端环境变量不能保存 secret。
- `admin.cekaitech.cn` 上线早期建议增加 Nginx Basic Auth 或 IP 白名单。
- 系统设置页改密成功后会清理本地 token 并跳转登录页；当前轻量 token 没有服务端主动失效能力。
- 当前权限控制以登录返回的 `operator.permissions` 为准；前端只负责隐藏入口和路由拦截，后端仍负责最终 403 校验。
- 用户详情抽屉会加载最近操作记录；当前主要展示状态调整审计。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- `.superpowers/` 是 brainstorming 静态预览目录，已加入 `.gitignore`。

## 下一步建议

1. 将动态工作区菜单占位页逐步替换为真实业务页面。
2. 后续补权限配置页面、黑名单等级和生产级操作者身份来源。
3. 上线前继续评估 Nginx Basic Auth 或 IP 白名单。
