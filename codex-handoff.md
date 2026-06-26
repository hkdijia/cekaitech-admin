# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 配置契约组件拆分切片。
- 最近完成：新增 `StoreAppointmentAdminConfigContractPanel.vue` 和组件测试，`StoreAppointmentsPage.vue` 已改为引用该组件。
- 未完成：本地提交、生产发布。

## 关键文件

- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts`
- `src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.ts`
- `src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentRulesPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
- `src/api/storeAppointments.ts`
- `src/api/storeAppointments.test.ts`
- `scripts/check-admin-integration-ready.mjs`
- `scripts/check-admin-integration-ready.test.mjs`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts`
- `npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts` 失败于 `StoreAppointmentAdminConfigContractPanel.vue` 不存在。
- [反馈编号：无] GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts` 通过，1 个测试文件、1 项。
- [反馈编号：无] 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，2 个测试文件、29 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts` 通过，12 个测试文件、69 项。
- [反馈编号：无] 收口：`npm.cmd run admin:check` 通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 8080 后端未启动。
- [反馈编号：无] 收口：`npm.cmd run quality` 通过，53 个测试文件、290 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：配置契约组件拆分完整验证已通过，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 本轮只拆分只读 admin 配置契约组件，不新增后端接口、不开放配置保存。
- 配置契约只展示四配置面的后端接口、权限码、候选可写字段和排除字段。
- 当前没有配置审计列表后端 API，不能虚构审计列表入口；回滚仍需管理员输入已知 `auditLogId`。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。
- 本轮提交信息建议：`refactor: extract store appointment config contract panel`，正文或 footer 写 `Refs: none`。

## 下一步建议

1. 本地提交本轮配置契约组件拆分切片。
2. 下一阶段继续评估预约列表/详情工作台的结构拆分，但不能新增禁区业务能力。
