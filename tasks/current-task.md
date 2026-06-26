# Current Task

## 当前任务

- 名称：门店预约 admin 配置 API client 切片
- OpenSpec 变更：无。承接 `miniapp-backend` 已验证的门店预约 admin 配置 frontend-ready-contract，先完成 `cekaitech-admin` API client 和 readiness 检查，不实现编辑表单。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：实施中，API client 定向 TDD 已通过，待完整质量验证和本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照只读核对和配置面 readiness 展示。
- 已完成契约同步：四个中性配置面统一标为 `backend-ready-frontend-pending`，规则接口路径为 `/api/admin/store-appointment-config/rules/{storeCode}`。
- 本轮新增四配置块 API client：门店资料、项目目录、员工名册、预约规则的 GET/PUT 封装。
- 四个写接口都要求调用方传入 `X-Request-Id`，用于后端审计和排障追踪。
- 当前页面仍不开放门店资料、项目目录、员工名册、预约规则编辑保存入口。

## 已完成

- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 将 `adminApiGaps` 调整为 `adminConfigContract`，标注后端契约已具备、前端表单待接入。
- [反馈编号：无] `StoreAppointmentsPage.vue` 将“admin API 缺口”区改为“admin 配置契约”区，保留只读展示和禁止保存配置边界。
- [反馈编号：无] 预约规则接口路径从旧候选 `/stores/{storeCode}/rules` 修正为后端正式 `/rules/{storeCode}`。
- [反馈编号：无] 测试覆盖契约状态、正式规则路径、排除字段，以及页面仍不展示保存/立即接入按钮。
- [反馈编号：无] `src/api/storeAppointments.ts` 新增门店资料、项目目录、员工名册和预约规则的 admin 配置 API client。
- [反馈编号：无] 四个写接口封装 `PUT /api/admin/store-appointment-config/**`，通过 `X-Request-Id` 请求头传递审计追踪 ID。
- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 新增“门店预约 admin 配置 API client”检查，确认四配置块 API client 和 `X-Request-Id` 已存在。

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
- 收口：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `http://127.0.0.1:8080/api/health` 未启动，非阻塞。
- 收口：`npm.cmd run quality`
  - 结果：通过，44 个测试文件、244 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。

## 未完成

- 尚未新增门店资料、项目目录、员工名册、预约规则等中性配置面的 admin 编辑入口。
- 尚未新增保存错误态映射和页面 block 状态模型。
- 尚未接入回滚预览、二次确认和执行。
- 尚未做真实支付、会员、核销、客户资料、CRM 跟进、服务记录、员工账号、真实排班、消息通知、退款或客户账户策略。
- 尚未做生产环境发布。
- 尚未本地提交本轮 API client 切片。

## 下一步

1. 本地提交本轮 API client 切片。
2. 下一切片建议按 TDD 接入门店资料 block 的读取、草稿、保存状态和错误保留输入，仍不触碰支付、会员、CRM 等能力。
