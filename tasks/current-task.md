# Current Task

## 当前任务

- 名称：服务请求管理页前端实现
- OpenSpec 变更：无
- 当前 HEAD：以 Git log 为准

## 当前状态

- 已完成未提交；等待人工后续联调。

## 已完成

- 完成代码分析：服务请求管理页应复用生成记录/法律表单事件页的列表筛选模式，复用用户页的权限判断和详情操作模式；只通过 `miniapp-backend` 受控 API，不直连数据库、不控制 crawler。
- 新增 `src/api/legalServiceRequests.ts`，封装分页、详情和状态更新接口。
- 新增 `/legal-service-requests` 菜单和路由，标题“服务请求”，权限码 `admin:legal-service-request:view`。
- 新增 `src/pages/legal-service-requests/LegalServiceRequestsPage.vue`，支持关键词、用户 ID、手机号、服务类型、状态、小程序筛选；空筛选传 `undefined`，用户 ID 仅正整数且 `Number.isSafeInteger` 时下发。
- 页面表格展示请求 ID、用户 ID、小程序、服务类型、联系人、脱敏手机号、状态、处理人、创建/更新时间和查看详情操作。
- 详情抽屉展示请求基础信息、用户/来源记录、完整手机号、用户备注、内部备注和处理状态；支持跳转 `/users?userId=...` 与 `/generation-records?userId=...`。
- 具备 `admin:legal-service-request:manage` 时显示处理状态和内部备注更新入口，并调用状态更新 API。
- 新增 API、页面和路由测试，覆盖契约请求、筛选归一化、非法用户 ID、查看用户跳转和管理权限。
- 更新 `docs/变更日志.md`、`codex-handoff.md`、`tasks/current-task.md` 和 `codex-decisions.md`。

## 未完成

- 需后续用真实后端数据和具备服务请求权限的账号联调分页、详情完整手机号、状态更新和后端 403 行为。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts`：服务请求 API/页面模块缺失，菜单和路由未声明 `/legal-service-requests`。
- GREEN：`npm.cmd run test -- --run src/api/legalServiceRequests.test.ts src/pages/legal-service-requests/LegalServiceRequestsPage.test.ts src/router/router.test.ts`：3 个测试文件、22 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：17 个测试文件、66 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 下一步

1. 用真实后端联调服务请求分页、详情完整手机号和状态更新。
