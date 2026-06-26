# Current Task

## 当前任务

- 名称：门店预约 admin 配置回滚组件拆分切片
- OpenSpec 变更：无。承接已完成的门店预约 admin 配置回滚 Flow，在 `cekaitech-admin` 内将回滚面板抽成可单独验证的前端组件。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：完整验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照、四个中性配置块和配置回滚 Flow。
- 本轮将“配置回滚”从 `StoreAppointmentsPage.vue` 抽成 `StoreAppointmentConfigRollbackPanel.vue`。
- 回滚组件仍只支持 `storeCode + auditLogId` 预览、显式勾选确认和受控执行，不新增审计列表接口。

## 已完成

- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`，覆盖预览不执行、执行前必须确认、低权限隐藏操作。
- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.vue`，承接回滚查询、预览、确认、执行、错误和成功提示。
- [反馈编号：无] `StoreAppointmentsPage.vue` 改为渲染 `<StoreAppointmentConfigRollbackPanel :can-manage="canManageStoreAppointmentConfig" />`，移除页面内重复的回滚状态、函数和内联模板。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮组件拆分、测试资产和禁止新增后端假接口边界。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
  - 结果：失败于 `StoreAppointmentConfigRollbackPanel.vue` 不存在，符合预期。
- GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
  - 结果：通过，1 个测试文件、3 项。
- 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，1 个测试文件、28 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts`
  - 结果：通过，4 个测试文件、46 项。
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，45 个测试文件、267 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未本地提交本轮组件拆分切片。
- 尚未接入配置审计记录列表入口；当前不能虚构后端审计列表 API。
- 尚未做生产环境发布。

## 下一步

1. 提交 `refactor: extract store appointment config rollback panel`，提交正文包含 `Refs: none`。
2. 下一切片再评估配置审计记录列表入口或继续拆分其他配置 block。
