# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 门店资料配置 block 切片。
- 最近完成：页面新增“门店资料配置”block，支持按 `storeCode` 读取、编辑和保存中性门店资料，保存失败保留草稿输入。
- 未完成：项目目录、员工名册、预约规则、回滚预览/确认/执行、生产发布。

## 关键文件

- `src/api/storeAppointments.ts`
- `src/api/storeAppointments.test.ts`
- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `scripts/check-admin-integration-ready.mjs`
- `scripts/check-admin-integration-ready.test.mjs`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs`
- `npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于 `adminConfigContract` 缺失和页面仍展示“admin API 缺口”。
- [反馈编号：无] GREEN：同命令通过，2 个测试文件、16 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts` 失败于新 API client 函数缺失。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、6 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs` 失败于 `storeAppointmentConfigApiClient` 缺失。
- [反馈编号：无] GREEN：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs` 通过，2 个测试文件、14 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于页面缺少“门店资料配置”block 和 `配置 storeCode` 输入。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、13 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，3 个测试文件、27 项。
- [反馈编号：无] 收口：`npm.cmd run admin:check` 通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 8080 后端未启动。
- [反馈编号：无] 收口：`npm.cmd run quality` 首次运行 Vitest 44 个文件、248 项通过，但 `vue-tsc` 失败于测试 DOM `element.value` 类型断言；修正后重跑通过，44 个测试文件、248 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：门店资料 block 完整质量验证已通过，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 当前只是前端契约同步，不代表页面已经可以保存配置。
- 当前页面只开放门店资料中性展示字段编辑，不开放项目、员工、规则或回滚。
- 后端正式规则接口是 `/api/admin/store-appointment-config/rules/{storeCode}`，不要再使用旧候选 `/stores/{storeCode}/rules`。
- 写接口必须传入 `X-Request-Id`，建议格式继续使用 `store-config-<uuid>`。
- 四个中性配置面状态为 `backend-ready-frontend-pending`：门店资料、项目目录、员工名册、预约规则。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 完成本轮本地提交。
2. 下一切片进入项目目录 block，先做项目列表读取和单项目草稿保存。
3. 项目目录 block 绿灯后再扩展员工、规则和回滚。
