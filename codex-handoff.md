# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：后台 MVP 壳已接入 `miniapp-backend` 开发态登录接口
- 最近完成：Vue 3 工程、后台布局、登录占位、菜单、工作区切换、占位页面、API 登录、token 本地保存、测试和构建验证
- 未完成：生产级鉴权、数据库管理员、权限模型、数据导入真实流程

## 关键文件

- `docs/admin-mvp-design.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `docs/变更日志.md`
- `README.md`
- `AGENTS.md`
- `package.json`
- `src/router/index.ts`
- `src/layouts/AdminLayout.vue`
- `src/api/http.ts`
- `src/api/adminAuth.ts`
- `src/stores/auth.ts`

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`

## 最近验证

- `npm.cmd test`：通过，3 个 Vitest 测试通过。
- `npm.cmd run quality`：通过，3 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- `miniapp-backend` 联调：`POST /api/admin/auth/login` 通过，返回 `dev-admin-token`。

## 注意事项

- 当前只接入后台开发态登录接口，账号为 `admin/123456`，生产阶段必须替换。
- Vite 开发环境通过 `/api` 代理到 `http://127.0.0.1:8080`，需要先启动 `miniapp-backend`。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- `.superpowers/` 是 brainstorming 静态预览目录，已加入 `.gitignore`。

## 下一步建议

1. 将后台开发态登录替换为生产级鉴权。
2. 接入工作区菜单接口，替换前端固定工作区配置。
3. 将用户管理、律师认证审核、黑名单等占位页逐步替换为真实 API 页面。
