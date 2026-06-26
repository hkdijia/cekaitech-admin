# Current Task

## 当前任务

- 名称：门店预约 admin 员工名册配置组件拆分切片
- OpenSpec 变更：无。承接已完成的门店预约 admin 四配置块 Flow，在 `cekaitech-admin` 内将员工名册配置面板抽成可单独验证的前端组件。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：完整验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照、四个中性配置块和配置回滚 Flow。
- 已拆出 `StoreAppointmentConfigRollbackPanel.vue`、`StoreAppointmentStoreProfilePanel.vue` 和 `StoreAppointmentServiceCatalogPanel.vue`。
- 本轮将“员工名册配置”从 `StoreAppointmentsPage.vue` 抽成 `StoreAppointmentStaffRosterPanel.vue`。
- 员工名册组件仍只处理 `name/role/bio/avatarUrl/trustHighlights/enabled/projectCodes`，不接入员工账号、权限、私联信息或真实排班。

## 已完成

- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts`，覆盖读取、编辑、保存、保存失败保留草稿和低权限隐藏操作。
- [反馈编号：无] 新增 `src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.vue`，承接员工名册查询、选中员工草稿、保存、错误和成功提示。
- [反馈编号：无] `StoreAppointmentsPage.vue` 改为渲染 `<StoreAppointmentStaffRosterPanel :can-manage="canManageStoreAppointmentConfig" />`，移除页面内重复的员工名册状态、函数和内联模板。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮组件拆分、测试资产和禁区能力边界。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts`
  - 结果：失败于 `StoreAppointmentStaffRosterPanel.vue` 不存在，符合预期。
- GREEN：`npm.cmd run test -- --run src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts`
  - 结果：通过，1 个测试文件、4 项。
- 页面回归：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，1 个测试文件、28 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts src/pages/store-appointments/components/StoreAppointmentConfigRollbackPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStoreProfilePanel.test.ts src/pages/store-appointments/components/StoreAppointmentServiceCatalogPanel.test.ts src/pages/store-appointments/components/StoreAppointmentStaffRosterPanel.test.ts`
  - 结果：通过，7 个测试文件、58 项。
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，48 个测试文件、279 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未本地提交本轮组件拆分切片。
- 尚未接入配置审计记录列表入口；当前不能虚构后端审计列表 API。
- 尚未做生产环境发布。

## 下一步

1. 提交 `refactor: extract store appointment staff roster panel`，提交正文包含 `Refs: none`。
2. 下一切片继续评估拆分预约规则配置 block。
