# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 商业化可移植性规划切片。
- 最近完成：新增 `docs/store-appointment-admin-commercial-portability-guide.md`，明确 CekaiAdmin 样板宿主、可移植能力包和未来支付商业闭环方向。
- 未完成：本地提交、生产发布。

## 关键文件

- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentDetailDrawer.vue`
- `src/pages/store-appointments/components/StoreAppointmentDetailDrawer.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentListPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts`
- `src/pages/store-appointments/components/storeAppointmentDisplayUtils.ts`
- `src/pages/store-appointments/components/storeAppointmentDisplayUtils.test.ts`
- `src/pages/store-appointments/components/storeAppointmentStatusActionUtils.ts`
- `src/pages/store-appointments/components/storeAppointmentStatusActionUtils.test.ts`
- `src/pages/store-appointments/storeAppointmentQueryUtils.ts`
- `src/pages/store-appointments/storeAppointmentQueryUtils.test.ts`
- `src/pages/store-appointments/components/StoreAppointmentFilterPanel.vue`
- `src/pages/store-appointments/components/StoreAppointmentFilterPanel.test.ts`
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
- `docs/store-appointment-admin-commercial-portability-guide.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/pages/store-appointments/components/storeAppointmentDisplayUtils.test.ts`
- `npm.cmd run test -- --run src/pages/store-appointments/components/storeAppointmentStatusActionUtils.test.ts`
- `npm.cmd run test -- --run src/pages/store-appointments/storeAppointmentQueryUtils.test.ts`
- `npm.cmd run test -- --run src/pages/store-appointments/components/storeAppointmentDisplayUtils.test.ts src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts src/pages/store-appointments/components/StoreAppointmentDetailDrawer.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/storeAppointmentDisplayUtils.test.ts src/pages/store-appointments/components/StoreAppointmentDetailDrawer.test.ts src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts src/pages/store-appointments/components/StoreAppointmentFilterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`
- `rg -n "TBD|TODO|待定|半成品支付|priceText.*真实" docs/store-appointment-admin-commercial-portability-guide.md`

## 最近验证

- [反馈编号：无] 文档检查：`Select-String -Path docs/store-appointment-admin-commercial-portability-guide.md -Pattern 'TBD|TODO|待定|以后再说'` 通过，未发现占位词。
- [反馈编号：无] 文档检查：`rg -n "基础预约包|商业闭环包|增长运营包|支付能力是商业化闭环中的关键能力|迁移验收清单" docs/store-appointment-admin-commercial-portability-guide.md` 通过，关键章节和支付路线均已覆盖。
- [反馈编号：无] 提交前检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：商业化可移植性 guide 已补充并通过文档检查，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 本轮只补商业化可移植性规划，不新增后端接口、不改页面代码、不实现支付或增长运营能力。
- 文档明确支付是未来商业闭环必做方向，但必须作为独立阶段补齐后端契约、权限、审计、安全、退款和对账设计。
- 当前没有配置审计列表后端 API，不能虚构审计列表入口；回滚仍需管理员输入已知 `auditLogId`。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。
- 本轮提交信息建议：`docs: add store appointment admin portability guide`，正文或 footer 写 `Refs: none`。

## 下一步建议

1. 本地提交本轮商业化可移植性规划切片。
