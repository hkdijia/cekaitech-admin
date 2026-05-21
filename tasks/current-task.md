# Current Task

## 当前任务

- 名称：cekaitech-admin 工作区菜单联调
- OpenSpec 变更：无

## 当前状态

- 已完成未提交。

## 已完成

- 用户确认 `docs/admin-mvp-design.md`。
- 新增 `docs/superpowers/plans/2026-05-21-admin-mvp-shell.md`。
- 实现计划覆盖 Vue 3 工程脚手架、路由、mock 登录、工作区切换、后台布局、占位页面、测试、构建和文档更新。
- 初始化 Vue 3 + Vite + TypeScript + Element Plus 工程。
- 实现 mock 登录、路由、工作区切换、后台主布局、首页工作台和首批占位页面。
- 新增 auth store 和 route/menu 基础测试。
- 新增后台 API 请求封装。
- 登录从纯 mock store 改为调用 `POST /api/admin/auth/login`。
- 登录成功后保存本地 token，登出时清理 token。
- Vite 开发代理 `/api` 到 `http://127.0.0.1:8080`。
- 工作区选择改为调用 `GET /api/admin/workspaces`。
- 工作区菜单改为调用 `GET /api/admin/workspaces/{workspaceId}/menus`。
- 侧边栏新增工作区菜单展示区，当前仅展示菜单项，不跳转未实现业务路由。

## 未完成

- 生产级鉴权。
- 工作区菜单真实路由页面。
- 权限模型。
- 数据导入真实流程。

## 最近验证

- `npm.cmd test`：通过，6 个 Vitest 测试通过。
- `npm.cmd run quality`：通过，6 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- `POST /api/admin/auth/login`：通过，后端返回 `dev-admin-token`。
- `GET /api/admin/workspaces`：通过，后端返回工作区列表。
- `GET /api/admin/workspaces/1/menus`：通过，后端返回法律工作区菜单。

## 下一步

1. 提交并推送本次工作区菜单联调改造。
2. 后续将工作区菜单项绑定到真实业务路由和页面。
