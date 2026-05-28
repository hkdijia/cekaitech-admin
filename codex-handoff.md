# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：以 Git log 为准。
- 当前阶段：LMA-FB-013 首页菜单与 Banner 公告后台动态配置管理页；管理端页面已验证、已提交、已推送、已回写，真实后端账号联调和小程序真实接口复验均已通过，待发布前真机抽检。
- 最近完成：新增 `miniappHomeConfig` API 封装和 `/miniapp-home-config` 页面，按模块配置、功能入口、Banner 公告三块维护首页配置；菜单与路由权限为 `admin:miniapp-home-config:view`，写操作按 `admin:miniapp-home-config:manage` 控制。
- 未完成：发布前实体手机抽检首页配置读取、Banner 点击和公告详情。

## 关键文件

- `AGENTS.md`
- `README.md`
- `docs/admin-mvp-design.md`
- `docs/production-runbook.md`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `package.json`
- `scripts/check-admin-integration-ready.mjs`
- `scripts/check-admin-integration-ready.test.mjs`
- `src/router/index.ts`
- `src/router/menu.ts`
- `src/router/router.test.ts`
- `src/api/http.ts`
- `src/api/adminAuth.ts`
- `src/api/generationRecords.ts`
- `src/api/generationRecords.test.ts`
- `src/api/legalServiceRequests.ts`
- `src/api/legalServiceRequests.test.ts`
- `src/api/miniappHomeConfig.ts`
- `src/api/miniappHomeConfig.test.ts`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.vue`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts`
- `src/pages/generation-records/generationRecordOptions.ts`
- `src/pages/generation-records/generationRecordOptions.test.ts`
- `src/pages/generation-records/GenerationRecordsPage.test.ts`
- `src/pages/legal-service-requests/LegalServiceRequestsPage.vue`
- `src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts`
- `src/api/legalFormEvents.ts`
- `src/pages/legal-form-events/LegalFormEventsPage.test.ts`
- `src/api/adminUsers.ts`
- `src/pages/users/UsersPage.test.ts`
- `src/api/adminUserRestrictions.ts`
- `src/api/adminUserOperationLogs.ts`
- `src/pages/user-operation-logs/UserOperationLogsPage.vue`
- `src/pages/user-operation-logs/UserOperationLogsPage.test.ts`
- `src/stores/auth.ts`
- `src/stores/workspace.ts`
- `src/pages/generation-records/GenerationRecordsPage.vue`
- `src/pages/legal-form-events/LegalFormEventsPage.vue`
- `src/pages/users/UsersPage.vue`
- `src/pages/restrictions/RestrictionsPage.vue`
- `src/pages/data-import/DataImportPage.vue`
- `src/pages/settings/SettingsPage.vue`
- `src/pages/workspace-menu/WorkspaceMenuPage.vue`

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`
- `npm.cmd run admin:check`

## 最近验证

- TDD 红灯（LMA-FB-013）：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts` 失败，`miniappHomeConfig` API 模块缺失、页面组件缺失、菜单和路由未声明 `/miniapp-home-config`。
- TDD 绿灯（LMA-FB-013）：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts` 通过，3 个测试文件、17 个 Vitest 测试通过。
- 全量质量（LMA-FB-013）：`npm.cmd run quality` 通过，21 个测试文件、91 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 推送记录（LMA-FB-013）：`git push origin master` 已推送 `fcd220c feat: add miniapp home config admin page`。
- 阶段回写（LMA-FB-013）：企业微信智能表格 `XRhKT7` 已回写为“已验证（小程序真实接口复验通过，发布前真机抽检）”。
- 真实联调（LMA-FB-013）：重启 8080 后端后，`admin/123456` 登录返回 `admin:miniapp-home-config:view/manage`；浏览器页面可见“首页配置”，并完成模块、功能入口、Banner 的新增、编辑、禁用。
- 公开接口复核（LMA-FB-013）：`GET /api/miniapps/lawsuit-material-assistant/home-config` 不包含已禁用的 `codex_test_*` 联调记录。
- 小程序真实接口自动化复验（LMA-FB-013）：清空缓存并使用本地后端后，首页加载远程 `launch_notice` Banner 和模块，点击 Banner 进入公告详情。
- TDD 红灯：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts` 失败，页面组件不存在，菜单和路由未声明 `/user-operation-logs`。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts` 通过，2 个测试文件、18 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，18 个测试文件、80 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- TDD 红灯（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 失败，14 个页面测试中 1 个失败，服务类型筛选缺少“合同模板” -> `contract_template` 选项。
- TDD 绿灯（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 通过，1 个测试文件、14 个 Vitest 测试通过。
- 最终质量检查（LMA-FB-009）：`npm.cmd run quality` 通过，18 个测试文件、81 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 本地后端 API 联调（LMA-FB-009）：`miniapp-backend` 当前仓库 `p15` profile 已在 `localhost:8080` 跑通 `contract_template` 服务请求创建、重复提交 409、后台分页、详情脱敏、`contact-view`、状态处理和 `legal_service_request_contact_view` 审计日志；本仓随后执行 `npm.cmd run quality` 通过，18 个测试文件、81 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- TDD 红灯（LMA-FB-009）：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs` 失败，诊断脚本缺失。
- TDD 绿灯（LMA-FB-009）：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs` 通过，1 个测试文件、3 个 Vitest 测试通过。
- 联调准备诊断（LMA-FB-009）：`npm.cmd run admin:check` 通过，PASS 11 / WARN 0 / FAIL 0；后端健康、Vite `/api` 代理、关键路由和关键模块均通过。
- 最终质量检查（LMA-FB-009）：`npm.cmd run quality` 通过，19 个测试文件、84 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- TDD 红灯：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 失败，新增 `viewLegalServiceRequestContact` 未实现，详情页缺少“查看完整手机号”按钮和点击查看逻辑。
- TDD 绿灯：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 通过，2 个测试文件、17 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，17 个测试文件、71 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- TDD 红灯：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts` 失败，服务请求 API/页面模块缺失，菜单和路由未声明 `/legal-service-requests`。
- TDD 绿灯：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts` 通过，3 个测试文件、22 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，17 个测试文件、66 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- TDD 红灯：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts` 失败，用户管理页仍把 `/users?userId=123` 下发为 `keywords: "123"`，没有 `userId: 123`。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts` 通过，2 个测试文件、13 个 Vitest 测试通过。
- 相关定向验证：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts` 通过，4 个测试文件、23 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，15 个测试文件、52 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- TDD 红灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts` 失败，生成记录页/法律表单事件页缺少“查看用户”跳转，用户管理页未把 `userId` query 填入关键词。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts` 通过，3 个测试文件、11 个 Vitest 测试通过；追加 `UsersPage` query 边界后，同范围定向验证通过，3 个测试文件、18 个 Vitest 测试通过。
- 相关定向验证：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts src/router/router.test.ts src/api/adminUsers.test.ts` 通过，5 个测试文件、23 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，15 个测试文件、51 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- TDD 红灯：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts` 失败，用户管理页仍把空 `keywords/status/appCode` 下发为空字符串。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts` 通过，2 个测试文件、14 个 Vitest 测试通过。

## 注意事项

- 当前接入后台数据库管理员登录接口，默认账号仍为 `admin/123456`，生产前必须改密或建立正式管理员。
- Vite 开发环境通过 `/api` 代理到 `http://127.0.0.1:8080`，需要先启动 `miniapp-backend`。
- 若 8080 被旧后端占用，可用 `VITE_API_BASE_URL=http://127.0.0.1:8081` 启动前端，并让后端运行在 8081。
- 通用请求会自动读取 `cekaitech-admin-token` 并附加 Bearer token；登录接口本身不附加旧 token。
- 非登录接口收到 HTTP 401 时会清理本地 token，并通过全局事件跳转登录页。
- 刷新页面后若本地 token 存在但 `operator` 缺失，路由守卫会调用 `/api/admin/auth/current-operator` 恢复 operator/permissions；恢复失败会清理本地 token 并回登录页。
- 当前权限控制以登录返回或 current-operator 恢复的 `operator.permissions` 为准；前端只负责隐藏入口和路由拦截，后端仍负责最终 403 校验。
- `/users?userId=123` 当前是精确筛选入口：用户管理页会把合法正整数且不超过 JS 安全整数范围的 `userId` 填入独立用户 ID 条件，并调用 `POST /api/admin/users/page` 下发 `userId`；空 `keywords/status/appCode` 统一传 `undefined`，不会再写入空字符串。
- 法律表单事件页只调用 `POST /api/admin/legal/form-events/page`，权限码为 `admin:legal-form-event:view`；空关键词、小程序、表单类型、质量状态和事件类型会传 `undefined`，用户 ID 仅正整数下发。
- 生成记录页只调用 `POST /api/admin/generation-records/page`，权限码为 `admin:generation-record:view`，状态筛选仅使用 `draft/generated/expired`，记录类型按法律助手小程序本机 `caseType` 口径维护：`private_lending/divorce_agreement/divorce/labor/contract/tort/contract_template`；空筛选会传 `undefined`，用户 ID 仅正整数下发，不直连数据库、不接 crawler。
- 服务请求页调用 `POST /api/admin/legal/service-requests/page`、`GET /api/admin/legal/service-requests/{requestId}`、`POST /api/admin/legal/service-requests/{requestId}/contact-view` 和 `POST /api/admin/legal/service-requests/{requestId}/status`；普通详情和状态更新响应默认展示脱敏手机号，完整手机号必须点击“查看完整手机号”后显式获取并由后端审计；权限码为 `admin:legal-service-request:view`，管理入口按 `admin:legal-service-request:manage` 显示；空筛选会传 `undefined`，用户 ID 仅正整数且不超过 JS 安全整数范围时下发。
- 服务请求服务类型筛选已包含 LMA-FB-009 的“合同模板” -> `contract_template`；当前后台页面未引入订单、支付、收款等无关表达。
- 操作审计页调用 `POST /api/admin/user-operation-logs/page`，路由 `/user-operation-logs`，权限码 `admin:user-operation-log:view`；用于追踪用户状态变更、服务请求状态变更和服务请求联系方式查看 `legal_service_request_contact_view`，空筛选传 `undefined`，用户 ID 仅正整数且不超过 JS 安全整数范围时下发，排序固定携带 `orderBy=createdAt`；联系方式查看日志 Before/After 值在前端做二次脱敏，防止历史或异常完整手机号直出。
- 首页配置页调用 `POST /api/admin/miniapp-home-config/**`，路由 `/miniapp-home-config`，权限码 `admin:miniapp-home-config:view`；模块、功能入口、Banner 公告的新增/编辑/禁用按钮按 `admin:miniapp-home-config:manage` 显示。真实后端账号联调已通过三类配置新增、编辑和禁用；后端仍负责路径、图片、action/status/tone/fontWeight 白名单和最终 403。
- 数据导入页当前只做浏览器本地 JSON 预检，不上传、不调用后端导入接口、不读取或控制 crawler。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。
- 远程状态下可先运行 `npm.cmd run admin:check` 做服务请求后台联调准备；该命令为只读诊断，后端不可达会记为 WARN，配置或模块缺失才记为 FAIL。

## 下一步建议

1. 发布前用实体手机抽检首页配置读取、Banner 点击和公告详情。
2. 确认无误后关闭 `LMA-FB-013`。
