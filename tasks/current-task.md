# Current Task

## 当前任务

- 名称：门店预约 admin candidate 配置面接口缺口清单
- OpenSpec 变更：无。承接门店预约 admin 接入前置规划，先固定 candidate 配置面所需受控 admin API 缺口。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已完成 candidate 配置面 admin API 缺口首片，待完整质量验证和本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转、配置快照只读核对和配置面 readiness 展示。
- 配置快照仅读取后端公开 `booking-config`，不新增配置写入，不接支付、会员、核销、客户资料、CRM 跟进或服务记录。
- 配置面 readiness 将 `store-profile/service-catalog/staff-roster/appointment-rules` 标为可继续设计的候选，将 `operation-summary/feedback-follow-up/service-record` 标为需生产设计阻塞项。
- admin API 缺口清单将 4 个 candidate 配置面全部标为 `missing-admin-api`，只列候选接口、权限码、可写字段和排除字段，不视为已实现接口。

## 已完成

- [反馈编号：无] `src/api/storeAppointments.ts` 新增 `getStoreAppointmentBookingConfig`，调用 `GET /api/miniapps/{appCode}/stores/{storeCode}/booking-config`。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“配置快照”区，展示门店资料、服务项目、员工名册、员工项目关系和基础预约规则。
- [反馈编号：无] 配置快照明确“只读展示，不保存配置”，暂不提供保存、支付配置、会员配置或核销配置操作。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“配置面 readiness”只读区，展示 7 个配置面的状态、说明和 demo-only-excluded 清单。
- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 同步输出配置面 readiness 和排除项，供后续 admin/模板设计前置检查使用。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“admin API 缺口”只读区，展示门店资料、项目目录、员工名册和预约规则需要的候选 backend API。
- [反馈编号：无] `scripts/check-admin-integration-ready.mjs` 新增 `adminApiGaps`，标注 `admin:store-appointment-config:manage`、候选可写字段和 `tenantId/paymentAmount/员工权限/真实排班/通知退款策略` 等排除字段。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于 `getStoreAppointmentBookingConfig is not a function` 和配置快照入口未调用，符合预期。
- 定向收口：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，2 个测试文件、11 项。
- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于 `configSurfaces` 缺失和页面缺少“配置面 readiness”，符合预期。
- 定向收口：同命令通过，2 个测试文件、14 项。
- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于 `adminApiGaps` 缺失和页面缺少“admin API 缺口”，符合预期。
- 定向收口：同命令通过，2 个测试文件、16 项。

## 未完成

- 尚未做真实支付、会员、核销、客户资料、CRM 跟进或服务记录。
- 尚未做生产环境发布。
- 尚未新增门店资料、项目目录、员工名册、预约规则等中性配置面的 admin 编辑入口。
- 尚未设计 operation-summary、feedback-follow-up、service-record 的租户、权限、隐私、统计口径和合规边界。
- 尚未在 `miniapp-backend` 实现 `store-appointment-config` 管理接口。

## 下一步

1. 跑 `npm.cmd run admin:check` 和 `npm.cmd run quality` 完成本轮收口验证。
2. 下一轮可转到 `miniapp-backend` 做 store appointment config admin API 的设计预检文档，仍先不实现写接口。
3. 若继续增强工作台，可补充状态操作的二次确认、批注/备注和操作审计展示，但仍不碰支付、核销和客户资料。
