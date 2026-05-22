# Current Task

## 当前任务

- 名称：管理后台当前管理员改密
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
- 新增动态工作区菜单路由 `/workspace-menu/:workspaceCode/:menuCode`。
- 新增通用工作区功能占位页，展示菜单元数据和权限码。
- 新增后台用户分页 API 封装：`src/api/adminUsers.ts`。
- 用户管理页接入 `POST /api/admin/users/page`，展示统一用户、小程序身份和手机号授权摘要。
- 用户管理页支持关键词、状态和来源小程序筛选。
- 用户管理页新增“生成演示数据”按钮，便于本地空库联调。
- 用户管理页新增详情抽屉，展示用户基础信息、小程序身份和手机号记录。
- 新增 `src/api/adminUsers.test.ts`。
- 新增用户限制 API 封装：`src/api/adminUserRestrictions.ts`。
- 限制与黑名单页面接入 `POST /api/admin/user-restrictions/page`。
- 限制与黑名单页面支持按用户ID、小程序、限制类型和状态筛选。
- 限制与黑名单页面支持新增限制和取消生效中限制。
- 新增 `src/api/adminUserRestrictions.test.ts`。
- 新增用户状态调整 API 封装：`updateAdminUserStatus`。
- 用户管理列表和详情抽屉支持打开“调整状态”弹窗。
- 状态调整支持设为正常、受限、黑名单，并要求填写原因。
- 状态调整成功后刷新用户列表和当前详情。
- 新增用户操作日志 API 封装：`fetchAdminUserOperationLogs`。
- 用户详情抽屉新增操作记录表，展示最近状态调整的变更前后状态、原因、操作者和时间。
- 状态调整成功后同步刷新详情抽屉内的操作记录。
- 新增 `src/api/adminUserOperationLogs.test.ts`。
- 通用请求封装自动从 `cekaitech-admin-token` 读取 token，并对非登录接口附加 `Authorization: Bearer <token>`。
- 用户状态调整 API 测试覆盖 Authorization 头，确保后端可以写入真实后台操作者。
- 通用请求封装在非登录接口收到 HTTP 401 时清理 `cekaitech-admin-token`。
- 应用入口监听 `cekaitech-admin:unauthorized` 事件，并在非登录页跳转 `/login`。
- 新增 `src/api/http.test.ts`，覆盖受保护接口登录失效和登录接口凭证错误的边界。
- 新增 `.env.production.example`，生产构建默认指向 `https://api.cekaitech.cn`。
- 新增 `docs/production-runbook.md`，记录 `admin.cekaitech.cn` 静态部署、Nginx、验证、回滚和安全边界。
- README 补充生产部署入口。
- 新增 `changeAdminPassword` API 封装，调用 `POST /api/admin/auth/change-password`。
- 新增 `src/api/adminAuth.test.ts`，覆盖改密请求携带 Bearer token。
- 系统设置页新增当前管理员改密表单，包含旧密码、新密码、确认密码校验。
- 改密成功后清理本地 token 并跳转登录页。
- 更新 `codex-decisions.md` 和 `docs/变更日志.md`。

## 未完成

- 全局权限模型。
- 工作区菜单真实业务页面。
- 黑名单等级。
- 数据导入真实流程。
- `admin.cekaitech.cn` 尚未部署到云服务器。
- 上线前需决定是否启用 Nginx Basic Auth 或 IP 白名单。

## 最近验证

- `npm.cmd test`：通过，14 个 Vitest 测试通过。
- `npm.cmd run quality`：通过，16 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- `src/api/http.test.ts`：2 个测试通过。
- `src/api/adminUsers.test.ts`：4 个测试通过。
- `src/api/adminUserRestrictions.test.ts`：2 个测试通过。
- `src/api/adminUserOperationLogs.test.ts`：1 个测试通过。
- `src/api/adminAuth.test.ts`：1 个测试通过。
- `npm.cmd run quality`：通过，17 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- `POST /api/admin/auth/login`：通过，后端返回 `dev-admin-token`。
- `GET /api/admin/workspaces`：通过，后端返回工作区列表。
- `GET /api/admin/workspaces/1/menus`：通过，后端返回法律工作区菜单。

## 下一步

1. 执行 `npm.cmd run quality` 全量验证。
2. 提交并推送 `cekaitech-admin`。
3. 后续补黑名单等级、更细的后台权限控制和生产级操作者身份来源。
