# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：以 Git log 为准。
- 当前阶段：后台 MVP+ 已提交已推送；已接入 `miniapp-backend` 数据库管理员登录、刷新后 operator/permissions 恢复、工作区、工作区菜单、用户分页/详情、开发态演示数据、用户限制管理、用户主状态调整、用户操作日志、独立操作审计页、法律表单事件、生成记录查询和服务请求管理；已适配后端 `/api/admin/**` 全局鉴权、细粒度权限码、登录失效处理、当前管理员改密、数据导入本地预检工作台、userId 跨页入口、后台用户 ID 精确筛选契约、服务请求联系方式审计查看契约和 LMA-FB-009 服务类型契约。
- 最近完成：反馈编号 LMA-FB-009，服务请求页服务类型筛选新增“合同模板”并下发 `serviceType: "contract_template"`；同步 `docs/变更日志.md`、`tasks/current-task.md` 和 `codex-handoff.md`，修正 checkpoint 中“已完成未提交”的陈旧状态为已提交已推送、等待真实后端联调。
- 未完成：服务请求管理页真实后端联调、后端生成记录接口真实账号联调、法律表单事件用户 ID/事件类型筛选联调、用户 ID 精确筛选真实数据联调、权限配置页面、数据导入真实上传/批次/审计流程、生产级 session 机制仍待后续评估。

## 关键文件

- `AGENTS.md`
- `README.md`
- `docs/admin-mvp-design.md`
- `docs/production-runbook.md`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `package.json`
- `src/router/index.ts`
- `src/router/menu.ts`
- `src/router/router.test.ts`
- `src/api/http.ts`
- `src/api/adminAuth.ts`
- `src/api/generationRecords.ts`
- `src/api/generationRecords.test.ts`
- `src/api/legalServiceRequests.ts`
- `src/api/legalServiceRequests.test.ts`
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

## 最近验证

- TDD 红灯：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts` 失败，页面组件不存在，菜单和路由未声明 `/user-operation-logs`。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts` 通过，2 个测试文件、18 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，18 个测试文件、80 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- TDD 红灯（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 失败，14 个页面测试中 1 个失败，服务类型筛选缺少“合同模板” -> `contract_template` 选项。
- TDD 绿灯（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts` 通过，1 个测试文件、14 个 Vitest 测试通过。
- 最终质量检查（LMA-FB-009）：`npm.cmd run quality` 通过，18 个测试文件、81 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
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
- 数据导入页当前只做浏览器本地 JSON 预检，不上传、不调用后端导入接口、不读取或控制 crawler。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。

## 下一步建议

1. 用真实数据联调 `/users?userId=...`，确认后端 `userId` 精确筛选命中单个统一用户。
2. 用具备 `admin:legal-form-event:view` 权限的账号联调 `/legal-form-events` 的用户 ID 和事件类型筛选。
3. 用具备 `admin:legal-service-request:view/manage` 和 `admin:user-operation-log:view` 权限的账号联调服务请求联系方式审计查看及 `/user-operation-logs` 查询入口。
4. 将动态工作区菜单占位页逐步替换为真实业务页面，并补权限配置页面、数据导入字段映射/批次确认/API 审计等后续能力。
