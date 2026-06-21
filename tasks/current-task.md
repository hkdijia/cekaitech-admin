# Current Task

## 当前任务

- 名称：门店预约 admin 配置快照接入
- OpenSpec 变更：无。承接 `miniapp-backend` 已提供的门店预约公开 booking-config 只读接口。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已完成配置快照首片，待完整质量验证和本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志、受控状态流转和配置快照只读核对。
- 配置快照仅读取后端公开 `booking-config`，不新增配置写入，不接支付、会员、核销、客户资料、CRM 跟进或服务记录。

## 已完成

- [反馈编号：无] `src/api/storeAppointments.ts` 新增 `getStoreAppointmentBookingConfig`，调用 `GET /api/miniapps/{appCode}/stores/{storeCode}/booking-config`。
- [反馈编号：无] `StoreAppointmentsPage.vue` 新增“配置快照”区，展示门店资料、服务项目、员工名册、员工项目关系和基础预约规则。
- [反馈编号：无] 配置快照明确“只读展示，不保存配置”，暂不提供保存、支付配置、会员配置或核销配置操作。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于 `getStoreAppointmentBookingConfig is not a function` 和配置快照入口未调用，符合预期。
- 定向收口：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，2 个测试文件、11 项。

## 未完成

- 尚未做真实支付、会员、核销、客户资料、CRM 跟进或服务记录。
- 尚未做生产环境发布。
- 尚未新增门店资料、项目目录、员工名册、预约规则等中性配置面的 admin 编辑入口。

## 下一步

1. 跑 `npm.cmd run admin:check` 和 `npm.cmd run quality` 完成本轮收口验证。
2. 下一轮可做门店预约配置面编辑前置方案：只规划 candidate 字段与权限边界，暂不写生产配置。
3. 若继续增强工作台，可补充状态操作的二次确认、批注/备注和操作审计展示，但仍不碰支付、核销和客户资料。
