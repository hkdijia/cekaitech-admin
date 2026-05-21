# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：后台 MVP 壳已实现，待后续接入真实 API
- 最近完成：Vue 3 工程、后台布局、登录占位、菜单、工作区切换、占位页面、测试和构建验证
- 未完成：生产级鉴权、真实 API、权限模型、数据导入真实流程

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

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`

## 最近验证

- `npm.cmd run quality`：通过，2 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。

## 注意事项

- 首版只搭后台壳和占位页面，不接真实接口。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- `.superpowers/` 是 brainstorming 静态预览目录，已加入 `.gitignore`。

## 下一步建议

1. 接入 `miniapp-backend` 的后台登录与鉴权接口。
2. 设计后台权限模型和菜单权限。
3. 将用户管理、律师认证审核、黑名单等占位页逐步替换为真实 API 页面。
