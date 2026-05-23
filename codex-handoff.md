# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：`765f41d test: cover generation records page filters`。
- 当前阶段：后台 MVP 壳已接入 `miniapp-backend` 数据库管理员登录、刷新后 operator/permissions 恢复、工作区、工作区菜单、用户分页/详情、开发态演示数据、用户限制管理、用户主状态调整、用户操作日志、法律表单事件和生成记录查询；已适配后端 `/api/admin/**` 全局鉴权、细粒度权限码、登录失效处理、当前管理员改密和数据导入本地预检工作台。
- 最近完成：补齐后台刷新 session/operator 恢复；法律表单事件页查询参数对齐生成记录页做空筛选归一化，并新增用户 ID、事件类型筛选；相关定向测试和 `npm.cmd run quality` 已通过。
- 未完成：后端生成记录接口真实账号联调、法律表单事件用户 ID/事件类型筛选联调、权限配置页面、数据导入真实上传/批次/审计流程、生产级 session 机制仍待后续评估。

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
- `src/pages/generation-records/generationRecordOptions.ts`
- `src/pages/generation-records/generationRecordOptions.test.ts`
- `src/pages/generation-records/GenerationRecordsPage.test.ts`
- `src/api/legalFormEvents.ts`
- `src/pages/legal-form-events/LegalFormEventsPage.test.ts`
- `src/api/adminUsers.ts`
- `src/api/adminUserRestrictions.ts`
- `src/api/adminUserOperationLogs.ts`
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

- TDD 红灯：`npm.cmd run test -- --run src/router/router.test.ts` 失败，刷新后仅有本地 token 时未调用 `/api/admin/auth/current-operator`，过期 token 也未被清理。
- TDD 红灯：`npm.cmd run test -- --run src/pages/legal-form-events/LegalFormEventsPage.test.ts` 失败，初始加载仍下发空字符串，且缺少用户 ID 筛选输入。
- TDD 绿灯：`npm.cmd run test -- --run src/router/router.test.ts` 通过，1 个测试文件、8 个 Vitest 测试通过。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/legal-form-events/LegalFormEventsPage.test.ts` 通过，1 个测试文件、3 个 Vitest 测试通过。
- 相关定向验证：`npm.cmd run test -- --run src/stores/auth.test.ts src/api/adminAuth.test.ts src/api/http.test.ts src/api/legalFormEvents.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/router/router.test.ts` 通过，6 个测试文件、18 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，14 个测试文件、41 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 注意事项

- 当前接入后台数据库管理员登录接口，默认账号仍为 `admin/123456`，生产前必须改密或建立正式管理员。
- Vite 开发环境通过 `/api` 代理到 `http://127.0.0.1:8080`，需要先启动 `miniapp-backend`。
- 若 8080 被旧后端占用，可用 `VITE_API_BASE_URL=http://127.0.0.1:8081` 启动前端，并让后端运行在 8081。
- 通用请求会自动读取 `cekaitech-admin-token` 并附加 Bearer token；登录接口本身不附加旧 token。
- 非登录接口收到 HTTP 401 时会清理本地 token，并通过全局事件跳转登录页。
- 刷新页面后若本地 token 存在但 `operator` 缺失，路由守卫会调用 `/api/admin/auth/current-operator` 恢复 operator/permissions；恢复失败会清理本地 token 并回登录页。
- 当前权限控制以登录返回或 current-operator 恢复的 `operator.permissions` 为准；前端只负责隐藏入口和路由拦截，后端仍负责最终 403 校验。
- 法律表单事件页只调用 `POST /api/admin/legal/form-events/page`，权限码为 `admin:legal-form-event:view`；空关键词、小程序、表单类型、质量状态和事件类型会传 `undefined`，用户 ID 仅正整数下发。
- 生成记录页只调用 `POST /api/admin/generation-records/page`，权限码为 `admin:generation-record:view`，状态筛选仅使用 `draft/generated/expired`，记录类型按法律助手小程序本机 `caseType` 口径维护：`private_lending/divorce_agreement/divorce/labor/contract/tort/contract_template`；空筛选会传 `undefined`，用户 ID 仅正整数下发，不直连数据库、不接 crawler。
- 数据导入页当前只做浏览器本地 JSON 预检，不上传、不调用后端导入接口、不读取或控制 crawler。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。

## 下一步建议

1. 用具备 `admin:legal-form-event:view` 权限的账号联调 `/legal-form-events` 的用户 ID 和事件类型筛选。
2. 后端就绪后用具备 `admin:generation-record:view` 权限的账号联调 `/generation-records`。
3. 将动态工作区菜单占位页逐步替换为真实业务页面，并补权限配置页面、数据导入字段映射/批次确认/API 审计等后续能力。
