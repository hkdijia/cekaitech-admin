# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：以 Git log 为准。
- 当前阶段：后台 MVP 壳已接入 `miniapp-backend` 数据库管理员登录、工作区、工作区菜单、用户分页/详情、开发态演示数据、用户限制管理、用户主状态调整、用户操作日志、法律表单事件和生成记录查询；已适配后端 `/api/admin/**` 全局鉴权、细粒度权限码、登录失效处理、当前管理员改密和数据导入本地预检工作台。
- 最近完成：上一轮法律表单事件后台页面已提交并推送；本轮新增生成记录后台管理页 `/generation-records`，当前最终质量检查已通过。
- 未完成：后端生成记录接口联调、权限配置页面、数据导入真实上传/批次/审计流程、Redis/JWT 等生产级 session 机制

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
- `src/api/generationRecords.ts`
- `src/api/generationRecords.test.ts`
- `src/pages/generation-records/generationRecordOptions.ts`
- `src/pages/generation-records/generationRecordOptions.test.ts`
- `src/api/legalFormEvents.ts`
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

- `npm.cmd run test -- --run src/api/legalFormEvents.test.ts`：上一轮 TDD 绿灯通过，1 个测试通过。
- `npm.cmd run test -- --run src/router/router.test.ts`：上一轮 TDD 绿灯通过，5 个测试通过。
- `npm.cmd run quality`：上一轮最终通过，10 个测试文件、26 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- `npm.cmd run test -- --run src/api/generationRecords.test.ts`：本轮 TDD 红灯先因缺少 `./generationRecords` 模块失败，随后通过，1 个测试通过。
- `npm.cmd run test -- --run src/router/router.test.ts`：本轮 TDD 红灯先因缺少 `/generation-records` 入口失败，随后通过，6 个测试通过。
- `npm.cmd run test -- --run src/pages/generation-records/generationRecordOptions.test.ts`：返工 TDD 红灯先因缺少 `./generationRecordOptions` 模块失败，随后通过，3 个测试通过。
- `npm.cmd run test -- --run src/api/generationRecords.test.ts`：返工定向通过，1 个测试通过，样例值使用 `generated/private_lending`。
- `npm.cmd run quality`：本轮最终通过，12 个测试文件、31 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 注意事项

- 当前接入后台数据库管理员登录接口，默认账号仍为 `admin/123456`，生产前必须改密或建立正式管理员。
- Vite 开发环境通过 `/api` 代理到 `http://127.0.0.1:8080`，需要先启动 `miniapp-backend`。
- 若 8080 被旧后端占用，可用 `VITE_API_BASE_URL=http://127.0.0.1:8081` 启动前端，并让后端运行在 8081。
- 通用请求会自动读取 `cekaitech-admin-token` 并附加 Bearer token；登录接口本身不附加旧 token。
- 非登录接口收到 HTTP 401 时会清理本地 token，并通过全局事件跳转登录页。
- 当前权限控制以登录返回的 `operator.permissions` 为准；前端只负责隐藏入口和路由拦截，后端仍负责最终 403 校验。
- 生成记录页只调用 `POST /api/admin/generation-records/page`，权限码为 `admin:generation-record:view`，状态筛选仅使用 `draft/generated/expired`，记录类型按小程序本机 `caseType` 口径维护，不直连数据库、不接 crawler。
- 数据导入页当前只做浏览器本地 JSON 预检，不上传、不调用后端导入接口、不读取或控制 crawler。
- 后续真实业务数据只能通过 `miniapp-backend` 受控 API 获取和修改。
- 不直连数据库，不直接控制本地 `crawler`。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。

## 下一步建议

1. 后端就绪后用具备 `admin:generation-record:view` 权限的账号联调 `/generation-records`。
2. 将动态工作区菜单占位页逐步替换为真实业务页面。
3. 后续补权限配置页面、数据导入字段映射/批次确认/API 审计、黑名单等级和生产级操作者身份来源。
