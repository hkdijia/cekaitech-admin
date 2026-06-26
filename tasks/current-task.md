# Current Task

## 当前任务

- 名称：门店预约 admin 配置组件公共工具收口切片
- OpenSpec 变更：无。承接已完成的门店预约 admin 四配置块 Flow 和组件拆分工作，在 `cekaitech-admin` 内收口配置组件重复工具函数。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：完整验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照、四个中性配置块和配置回滚 Flow。
- 上一轮预约规则组件拆分已提交：`281ff70 refactor: extract store appointment rules panel`。
- 本轮新增公共工具 `storeAppointmentConfigPanelUtils.ts`，统一 `store-config-...` requestId、可选文本归一化和多行/逗号列表拆分逻辑。
- 本轮仅做前端配置组件结构收口，不新增后端接口，不改变四配置块字段范围。

## 已完成

- [反馈编号：无] 新增 `src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts`，覆盖空白文本归一化、换行/逗号拆分和 requestId 前缀。
- [反馈编号：无] 新增 `src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.ts`。
- [反馈编号：无] `StoreAppointmentStoreProfilePanel.vue`、`StoreAppointmentServiceCatalogPanel.vue`、`StoreAppointmentStaffRosterPanel.vue`、`StoreAppointmentRulesPanel.vue` 和 `StoreAppointmentConfigRollbackPanel.vue` 已改为复用公共工具。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮工具收口、测试资产和禁区能力边界。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts`
  - 结果：失败于 `storeAppointmentConfigPanelUtils` 模块不存在，符合预期。
- GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
  - 结果：通过，6 个测试文件、22 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/storeAppointmentConfigPanelUtils.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts src/pages/store-appointments/components/StoreAppointmentRulesPanel.test.ts`
  - 结果：通过，9 个测试文件、65 项。
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，50 个测试文件、286 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未本地提交本轮公共工具收口切片。
- 尚未接入配置审计记录列表入口；当前不能虚构后端审计列表 API。
- 尚未做生产环境发布。

## 下一步

1. 提交 `refactor: share store appointment config panel utils`，提交正文包含 `Refs: none`。
2. 下一阶段继续评估四配置块 UI/测试资产收口，但不能新增禁区业务能力。
