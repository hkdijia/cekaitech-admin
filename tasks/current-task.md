# Current Task

## 当前任务

- 名称：门店预约 admin 预约列表组件拆分切片
- OpenSpec 变更：无。承接已完成的门店预约 admin 四配置块 Flow 和组件拆分工作，在 `cekaitech-admin` 内将预约列表表格和分页区抽成可单独验证的前端组件。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：完整验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、筛选、详情、状态日志、受控状态流转、配置快照、配置面 readiness、四个中性配置块、配置回滚 Flow 和 admin 配置契约。
- 本轮新增 `StoreAppointmentListPanel.vue`，将预约列表表格、查看详情按钮和分页 UI 从 `StoreAppointmentsPage.vue` 中抽出。
- 本轮仅做列表 UI 组件结构收口，不新增后端接口，不改变查询参数归一化、分页状态更新和详情加载逻辑。

## 已完成

- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts`，覆盖表格数据、分页事件和禁区操作不出现。
- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentListPanel.vue`。
- [反馈编号：无] `StoreAppointmentsPage.vue` 改为渲染 `<StoreAppointmentListPanel />`，保留父组件内分页状态、列表加载和详情加载逻辑。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮组件拆分、测试资产和禁区能力边界。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts`
  - 结果：失败于 `StoreAppointmentListPanel.vue` 不存在，符合预期。
- GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts`
  - 结果：通过，1 个测试文件、1 项。
- 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，2 个测试文件、29 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentListPanel.test.ts src/pages/store-appointments/components/StoreAppointmentFilterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentAdminConfigContractPanel.test.ts src/pages/store-appointments/components/StoreAppointmentConfigReadinessPanel.test.ts src/pages/store-appointments/components/StoreAppointmentBookingConfigSnapshotPanel.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
  - 结果：通过，14 个测试文件、71 项。
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，55 个测试文件、292 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未本地提交本轮预约列表组件拆分切片。
- 尚未接入配置审计记录列表入口；当前不能虚构后端审计列表 API。
- 尚未做生产环境发布。

## 下一步

1. 提交 `refactor: extract store appointment list panel`，提交正文包含 `Refs: none`。
2. 下一阶段继续评估预约详情抽屉结构拆分，但不能新增禁区业务能力。
