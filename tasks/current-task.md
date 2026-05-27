# Current Task

## 当前任务

- 名称：后台服务请求合同模板类型同步
- OpenSpec 变更：无
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：LMA-FB-009
- 来源文档：无
- 本地台账：无
- 当前状态：实施中；本地后端服务请求 API 闭环已完成，已补后台页面真实浏览器联调前置诊断，页面仍待真实浏览器操作联调和生产级权限账号复核

## 当前状态

- 后台 MVP+ 已提交已推送；本轮服务请求类型契约同步完成，本地后端 API 已验证 `contract_template`、409、脱敏、`contact-view` 和审计日志链路；已新增 `npm.cmd run admin:check` 做后台真实浏览器联调前置诊断，后台页面仍待真实浏览器操作联调。

## 已完成

- 完成代码分析：服务请求管理页应复用生成记录/法律表单事件页的列表筛选模式，复用用户页的权限判断和详情操作模式；只通过 `miniapp-backend` 受控 API，不直连数据库、不控制 crawler。
- 新增 `src/api/legalServiceRequests.ts`，封装分页、详情和状态更新接口。
- 新增 `/legal-service-requests` 菜单和路由，标题“服务请求”，权限码 `admin:legal-service-request:view`。
- 新增 `src/pages/legal-service-requests/LegalServiceRequestsPage.vue`，支持关键词、用户 ID、手机号、服务类型、状态、小程序筛选；空筛选传 `undefined`，用户 ID 仅正整数且 `Number.isSafeInteger` 时下发。
- 页面表格展示请求 ID、用户 ID、小程序、服务类型、联系人、脱敏手机号、状态、处理人、创建/更新时间和查看详情操作。
- 详情抽屉展示请求基础信息、用户/来源记录、脱敏手机号、用户备注、内部备注和处理状态；支持跳转 `/users?userId=...` 与 `/generation-records?userId=...`。
- 服务请求详情页已适配联系方式审计查看：普通详情和状态更新响应不直接展示完整手机号，点击“查看完整手机号”后调用 `POST /api/admin/legal/service-requests/{requestId}/contact-view` 获取完整手机号，失败时展示错误。
- 新增后台“操作审计”页面 `/user-operation-logs`，作为服务请求联系方式审计后的查询入口，支持按用户 ID 和操作类型查询 `legal_service_request_contact_view` 等审计日志。
- 操作审计页查询显式携带 `orderBy=createdAt`，联系方式查看日志 Before/After 值做前端二次脱敏，避免历史或异常完整手机号在审计页直出。
- 新增菜单和路由，标题“操作审计”，权限码 `admin:user-operation-log:view`。
- 新增 `src/pages/user-operation-logs/UserOperationLogsPage.test.ts`，覆盖初始查询、筛选查询、非法用户 ID 和表格字段展示。
- 具备 `admin:legal-service-request:manage` 时显示处理状态和内部备注更新入口，并调用状态更新 API。
- 新增 API、页面和路由测试，覆盖契约请求、筛选归一化、非法用户 ID、查看用户跳转和管理权限。
- 更新 `docs/变更日志.md`、`codex-handoff.md`、`tasks/current-task.md` 和 `codex-decisions.md`。
- 同步 `AGENTS.md`、`tasks/current-task.md` 和 `codex-handoff.md` 的项目阶段状态：后台已从占位初始化进入 MVP+，当前为已提交已推送，等待真实后端联调和下一阶段业务页。
- 用户管理页空 `keywords`、`status`、`appCode` 筛选归一化为 `undefined` 后下发，继续保留合法 `userId` 精确筛选和 JS 安全整数边界。
- [反馈编号：LMA-FB-009] 服务请求页服务类型筛选新增“合同模板”，选择后下发 `serviceType: "contract_template"`；不引入订单、支付、收款等无关表达。
- [反馈编号：LMA-FB-009] 本地后端 API 已用默认 `admin` 跑通服务请求分页、详情脱敏、`contact-view`、状态处理和 `legal_service_request_contact_view` 审计日志；后台前端 `npm.cmd run quality` 仍通过 81 个 Vitest 测试和生产构建。
- [反馈编号：LMA-FB-009] 新增后台联调准备诊断 `npm.cmd run admin:check`，只读检查后端健康、Vite `/api` 代理、服务请求/操作审计/生成记录/用户关键路由和关键 API/页面模块；当前报告 PASS 11 / WARN 0 / FAIL 0。

## 未完成

- 需后续用后台真实浏览器页面联调服务请求分页、详情脱敏手机号、联系方式审计查看、操作审计查询入口、状态更新和后端 403 行为。
- 需后续用生产级真实权限账号复核服务请求和操作审计权限边界。
- 继续按业务优先级补齐权限配置、数据导入真实上传/批次/审计流程等下一阶段业务页。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts`：服务请求 API/页面模块缺失，菜单和路由未声明 `/legal-service-requests`。
- GREEN：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts`：3 个测试文件、22 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：17 个测试文件、66 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- RED：`npm.cmd run test -- --run src/pages/users/UsersPage.test.ts src/api/adminUsers.test.ts`：失败于用户管理页仍把空 `keywords/status/appCode` 下发为空字符串。
- RED：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts`：2 个测试文件失败，新增 `viewLegalServiceRequestContact` 未实现，详情页缺少“查看完整手机号”按钮和点击查看逻辑。
- GREEN：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts`：2 个测试文件、17 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：17 个测试文件、71 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- RED：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts`：页面组件不存在，菜单和路由未声明 `/user-operation-logs`。
- GREEN：`npm.cmd run test -- --run src/pages/user-operation-logs/UserOperationLogsPage.test.ts src/router/router.test.ts`：2 个测试文件、18 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：18 个测试文件、80 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- RED（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts`：14 个页面测试中 1 个失败，失败于服务类型筛选缺少“合同模板” -> `contract_template` 选项。
- GREEN（LMA-FB-009）：`npm.cmd run test -- --run src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts`：1 个测试文件、14 个 Vitest 测试通过。
- 全量质量（LMA-FB-009）：`npm.cmd run quality`：18 个测试文件、81 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 本地后端 API 联调（LMA-FB-009）：`miniapp-backend` 当前仓库 `p15` profile 已在 `localhost:8080` 跑通 `contract_template` 服务请求创建、重复提交 409、后台分页、详情脱敏、`contact-view`、状态处理和 `legal_service_request_contact_view` 审计日志；本仓随后执行 `npm.cmd run quality` 通过，18 个测试文件、81 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- RED（LMA-FB-009）：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`：失败于 `scripts/check-admin-integration-ready.mjs` 诊断脚本缺失。
- GREEN（LMA-FB-009）：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`：1 个测试文件、3 个 Vitest 测试通过。
- 联调准备诊断（LMA-FB-009）：`npm.cmd run admin:check`：PASS 11 / WARN 0 / FAIL 0，后端健康、Vite 代理、关键路由和关键模块均通过。
- 全量质量（LMA-FB-009）：`npm.cmd run quality`：19 个测试文件、84 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 下一步

1. 启动后台前端，用真实浏览器页面联调服务请求分页、详情脱敏手机号、显式联系方式审计查看、操作审计查询入口和状态更新。
2. 用生产级真实权限账号复核后端 403 和菜单/按钮权限边界。
3. 继续推进权限配置、数据导入真实上传/批次/审计流程等下一阶段业务页。
