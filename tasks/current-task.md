# Current Task

## 当前任务

- 名称：门店预约 admin 配置回滚 Flow 切片
- OpenSpec 变更：无。承接 `miniapp-backend` 已验证的门店预约 admin 配置 frontend-ready-contract，在 `cekaitech-admin` 接入回滚预览、显式确认和受控执行 Flow。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：已验证，配置回滚 Flow 完整质量验证已通过，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照只读核对和配置面 readiness 展示。
- 已完成契约同步：四个中性配置面统一标为 `backend-ready-frontend-pending`，规则接口路径为 `/api/admin/store-appointment-config/rules/{storeCode}`。
- 四配置块 API client 已具备：门店资料、项目目录、员工名册、预约规则的 GET/PUT 封装，写接口要求 `X-Request-Id`。
- 页面已具备“门店资料配置”block，仅具备 `admin:store-appointment-config:manage` 权限时显示读取和保存入口。
- 页面已具备“项目目录配置”block，可读取项目列表、选择单项目编辑草稿并保存。
- 页面已具备“员工名册配置”block，可读取员工列表、选择单员工编辑草稿并保存。
- 页面已具备“预约规则配置”block，可读取基础预约规则、编辑草稿并保存。
- 本轮新增“配置回滚”Flow，可按 `storeCode + auditLogId` 预览回滚内容，勾选确认后执行受控回滚。
- 回滚 Flow 只覆盖四个中性配置面，预览不写库，执行写入新的 rollback 审计。

## 已完成

- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 将 `adminApiGaps` 调整为 `adminConfigContract`，标注后端契约已具备、前端表单待接入。
- [反馈编号：无] `StoreAppointmentsPage.vue` 将“admin API 缺口”区改为“admin 配置契约”区，保留只读展示和禁止保存配置边界。
- [反馈编号：无] 预约规则接口路径从旧候选 `/stores/{storeCode}/rules` 修正为后端正式 `/rules/{storeCode}`。
- [反馈编号：无] 测试覆盖契约状态、正式规则路径、排除字段，以及页面仍不展示保存/立即接入按钮。
- [反馈编号：无] `src/api/storeAppointments.ts` 新增门店资料、项目目录、员工名册和预约规则的 admin 配置 API client。
- [反馈编号：无] 四个写接口封装 `PUT /api/admin/store-appointment-config/**`，通过 `X-Request-Id` 请求头传递审计追踪 ID。
- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 新增“门店预约 admin 配置 API client”检查，确认四配置块 API client 和 `X-Request-Id` 已存在。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“门店资料配置”block，可按 `storeCode` 读取 `GET /api/admin/store-appointment-config/stores/{storeCode}` 并编辑中性展示字段。
- [反馈编号：无] 门店资料保存调用 `PUT /api/admin/store-appointment-config/stores/{storeCode}`，写请求生成 `store-config-...` requestId；保存成功回填后端响应，保存失败保留草稿输入。
- [反馈编号：无] 无 `admin:store-appointment-config:manage` 权限时，只展示权限提示，不显示读取/保存按钮。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“项目目录配置”block，可按 `storeCode` 读取 `GET /api/admin/store-appointment-config/stores/{storeCode}/projects` 并选择单项目编辑。
- [反馈编号：无] 项目保存调用 `PUT /api/admin/store-appointment-config/projects/{projectCode}`，请求体携带 `storeCode` 限定门店范围，并生成 `store-config-...` requestId。
- [反馈编号：无] 项目目录 block 仅展示和保存 `categoryId/name/summary/durationMinutes/priceText/showPrice/enabled`，不引入支付金额、定金或会员卡字段。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“员工名册配置”block，可按 `storeCode` 读取 `GET /api/admin/store-appointment-config/stores/{storeCode}/staff` 并选择单员工编辑。
- [反馈编号：无] 员工保存调用 `PUT /api/admin/store-appointment-config/staff/{staffCode}`，请求体携带 `storeCode` 限定门店范围，并生成 `store-config-...` requestId。
- [反馈编号：无] 员工名册 block 仅展示和保存 `name/role/bio/avatarUrl/trustHighlights/enabled/projectCodes`，不引入员工账号、权限、私联或真实排班字段。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“预约规则配置”block，可按 `storeCode` 读取 `GET /api/admin/store-appointment-config/rules/{storeCode}` 并编辑基础规则字段。
- [反馈编号：无] 预约规则保存调用 `PUT /api/admin/store-appointment-config/rules/{storeCode}`，写请求生成 `store-config-...` requestId。
- [反馈编号：无] 预约规则 block 仅展示和保存 `bookingWindowDays/defaultDurationMinutes/defaultSlots/confirmationHint/cancelHint`，不引入通知模板、退款规则、真实排班策略或客户账户策略字段。
- [反馈编号：无] `src/api/storeAppointments.ts` 新增 `getStoreAppointmentRollbackPreview` 和 `rollbackStoreAppointmentConfig`，分别封装回滚只读预览和受控执行接口。
- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 新增回滚 API client 与 `adminConfigRollback` readiness 输出，标注预览/执行路径、权限和禁区能力。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“配置回滚”block，可预览 `configSurface/targetCode/values/projectCodes`，执行前必须勾选确认。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于 `adminConfigContract` 缺失和页面仍展示“admin API 缺口”，符合预期。
- GREEN：同命令通过，2 个测试文件、16 项。
- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts`
  - 结果：失败于 `getStoreAppointmentStoreProfile is not a function` 和 `updateStoreAppointmentStoreProfile is not a function`，符合预期。
- GREEN：同命令通过，1 个测试文件、6 项。
- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`
  - 结果：失败于 `storeAppointmentConfigApiClient` 缺失，符合预期。
- GREEN：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs` 通过，2 个测试文件、14 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于页面缺少“门店资料配置”block 和 `配置 storeCode` 输入，符合预期。
- GREEN：同命令通过，1 个测试文件、13 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，3 个测试文件、27 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于页面缺少“项目目录配置”block 和 `项目目录 storeCode` 输入，符合预期。
- GREEN：同命令通过，1 个测试文件、17 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，3 个测试文件、31 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于页面缺少“员工名册配置”block 和 `员工名册 storeCode` 输入，符合预期。
- GREEN：同命令通过，1 个测试文件、21 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，3 个测试文件、35 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于页面缺少“预约规则配置”block 和 `预约规则 storeCode` 输入，符合预期。
- GREEN：同命令通过，1 个测试文件、25 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，3 个测试文件、39 项。
- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts`
  - 结果：失败于 `getStoreAppointmentRollbackPreview is not a function`，符合预期。
- GREEN：同命令通过，1 个测试文件、7 项。
- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`
  - 结果：失败于 readiness 未识别回滚 API client，符合预期。
- GREEN：同命令通过，1 个测试文件、8 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于页面缺少“配置回滚”block 和 `回滚 storeCode` 输入，符合预期。
- GREEN：同命令通过，1 个测试文件、28 项。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，3 个测试文件、43 项。
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，44 个测试文件、264 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 门店资料、项目目录、员工名册、预约规则和回滚 block 尚未抽成独立组件，尚未接入更完整的后端错误码提示表。
- 尚未接入配置审计记录列表入口；回滚仍需管理员自行输入已知审计记录 ID。
- 尚未做真实支付、会员、核销、客户资料、CRM 跟进、服务记录、员工账号、真实排班、消息通知、退款或客户账户策略。
- 尚未做生产环境发布。
- 尚未本地提交本轮配置回滚 Flow 切片。

## 下一步

1. 本地提交本轮配置回滚 Flow 切片。
2. 下一切片建议收口配置审计记录列表或拆分配置组件，仍不触碰真实支付、会员、CRM、服务记录或生产发布。
