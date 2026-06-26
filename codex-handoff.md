# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 配置回滚 Flow 切片。
- 最近完成：页面新增“配置回滚”Flow，支持按 `storeCode + auditLogId` 只读预览回滚内容，勾选确认后执行受控回滚，执行请求携带 `store-config-...` requestId。
- 未完成：配置审计记录列表入口、组件拆分、生产发布。

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
- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于页面缺少“项目目录配置”block 和 `项目目录 storeCode` 输入。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、17 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，3 个测试文件、31 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于页面缺少“员工名册配置”block 和 `员工名册 storeCode` 输入。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、21 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，3 个测试文件、35 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于页面缺少“预约规则配置”block 和 `预约规则 storeCode` 输入。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、25 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，3 个测试文件、39 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts` 失败于 `getStoreAppointmentRollbackPreview is not a function`。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、7 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs` 失败于 readiness 未识别回滚 API client。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、8 项。
- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于页面缺少“配置回滚”block 和 `回滚 storeCode` 输入。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、28 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，3 个测试文件、43 项。
- [反馈编号：无] 收口：`npm.cmd run admin:check` 通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 8080 后端未启动。
- [反馈编号：无] 收口：`npm.cmd run quality` 通过，44 个测试文件、264 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：配置回滚 Flow 完整质量验证已通过，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 当前页面开放门店资料、项目目录、员工名册、预约规则中性字段编辑，以及配置回滚预览/确认/执行 Flow。
- 项目目录 `priceText` 只是展示文案，不代表真实收款、定金或会员权益。
- 员工名册只保存展示资料和可服务项目 code，不代表员工账号、权限、私联信息或真实排班。
- 预约规则只保存可约窗口、默认时长、默认时段和提示文案，不代表真实排班、消息通知、退款或客户账户策略。
- 配置回滚只恢复四个中性配置面；预览不写库，执行会写 rollback 审计，不恢复支付、会员、核销、客户资料、CRM、服务记录、员工账号或真实排班。
- 当前没有配置审计列表，回滚需要管理员输入已知 `auditLogId`。
- 后端正式规则接口是 `/api/admin/store-appointment-config/rules/{storeCode}`，不要再使用旧候选 `/stores/{storeCode}/rules`。
- 写接口必须传入 `X-Request-Id`，建议格式继续使用 `store-config-<uuid>`。
- 四个中性配置面状态为 `backend-ready-frontend-pending`：门店资料、项目目录、员工名册、预约规则。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 完成本轮配置回滚 Flow 本地提交。
2. 下一切片可进入配置审计记录列表入口或配置 block 组件拆分。
