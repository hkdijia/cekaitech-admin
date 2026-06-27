# Current Task

## 当前任务

- 名称：门店预约 admin 预约查询状态工具收口切片
- OpenSpec 变更：无。承接已完成的门店预约 admin 四配置块 Flow 和组件拆分工作，在 `cekaitech-admin` 内将列表查询初始值和重置逻辑抽成共享纯工具。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：完整验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、筛选、详情、状态日志、受控状态流转、配置快照、配置面 readiness、四个中性配置块、配置回滚 Flow 和 admin 配置契约。
- 本轮扩展 `storeAppointmentQueryUtils.ts`，统一列表查询初始值、重置逻辑、查询参数归一化和 pageSize 上限收敛。
- 本轮仅做查询状态工具结构收口，不新增后端接口，不改变查询字段、分页、详情加载、状态更新或列表刷新逻辑。

## 已完成

- [反馈编号：无] 扩展 `src/pages/store-appointments/storeAppointmentQueryUtils.test.ts`，覆盖默认查询对象和重置时清空筛选但保留 pageSize。
- [反馈编号：无] 扩展 `src/pages/store-appointments/storeAppointmentQueryUtils.ts`，新增 `createDefaultStoreAppointmentPageQuery` 与 `resetStoreAppointmentPageQuery`。
- [反馈编号：无] `StoreAppointmentsPage.vue` 改为复用共享查询状态工具，保持 `pageStoreAppointments` 请求字段不变。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮组件拆分、测试资产和禁区能力边界。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/store-appointments/storeAppointmentQueryUtils.test.ts`
  - 结果：失败于 `createDefaultStoreAppointmentPageQuery` 导出不存在，符合预期。
- GREEN：`npm.cmd run test -- --run src/pages/store-appointments/storeAppointmentQueryUtils.test.ts`
  - 结果：通过，1 个测试文件、2 项。
- 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，1 个测试文件、28 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/storeAppointmentQueryUtils.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/storeAppointmentDisplayUtils.test.ts src/pages/store-appointments/components/storeAppointmentStatusActionUtils.test.ts src/pages/store-appointments/components/StoreAppointmentDetailDrawer.test.ts src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts src/pages/store-appointments/components/StoreAppointmentFilterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
  - 结果：通过，18 个测试文件、77 项。
- 收口：`npm.cmd run admin:check`
  - 结果：通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动。
- 收口：`npm.cmd run quality`
  - 结果：通过，59 个测试文件、298 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未本地提交本轮预约查询状态工具收口切片。
- 尚未接入配置审计记录列表入口；当前不能虚构后端审计列表 API。
- 尚未做生产环境发布。

## 下一步

1. 提交 `refactor: share store appointment query state utils`，提交正文包含 `Refs: none`。
