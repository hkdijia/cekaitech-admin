# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 配置回滚组件拆分切片。
- 最近完成：新增 `StoreAppointmentConfigRollbackPanel.vue` 和组件测试，`StoreAppointmentsPage.vue` 已改为引用该组件。
- 未完成：本地提交、生产发布。

## 关键文件

- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
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

- `npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
- `npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts` 失败于 `StoreAppointmentConfigRollbackPanel.vue` 不存在。
- [反馈编号：无] GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts` 通过，1 个测试文件、3 项。
- [反馈编号：无] 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，1 个测试文件、28 项。
- [反馈编号：无] 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts` 通过，4 个测试文件、46 项。
- [反馈编号：无] 收口：`npm.cmd run admin:check` 通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 8080 后端未启动。
- [反馈编号：无] 收口：`npm.cmd run quality` 通过，45 个测试文件、267 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：组件拆分完整验证已通过，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 配置回滚只恢复四个中性配置面；预览不写库，执行会写 rollback 审计。
- 当前没有配置审计列表后端 API，不能虚构审计列表入口；回滚仍需管理员输入已知 `auditLogId`。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。
- 提交信息建议：`refactor: extract store appointment config rollback panel`，正文或 footer 写 `Refs: none`。

## 下一步建议

1. 本地提交本轮组件拆分切片。
2. 下一切片可进入配置审计记录列表入口可行性确认或继续拆分其他配置 block。
