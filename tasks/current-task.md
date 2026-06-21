# Current Task

## 当前任务

- 名称：门店预约 admin 状态流转接入
- OpenSpec 变更：无。承接 `miniapp-backend` 已提供的门店预约状态机接口。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已完成状态流转首片，待完整质量验证和本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、详情、状态日志和受控状态流转。
- 状态流转仅按后端状态机推进，不接支付、会员、核销、客户资料、CRM 跟进或服务记录。

## 已完成

- [反馈编号：无] `src/api/storeAppointments.ts` 新增 `updateStoreAppointmentStatus`，调用 `POST /api/admin/store-appointments/{appointmentId}/status`。
- [反馈编号：无] `StoreAppointmentsPage.vue` 按 `admin:store-appointment:manage` 权限展示状态动作；无权限仅可查看列表和详情。
- [反馈编号：无] 支持 `pending -> confirmed`、`confirmed -> arrived`、`arrived -> completed`、`pending/confirmed -> cancelled`。
- [反馈编号：无] 状态更新成功后刷新当前详情和外层列表，便于看到最新状态日志和列表状态。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts`
  - 结果：失败于 `updateStoreAppointmentStatus is not a function`，符合预期。
- GREEN：同命令通过，1 个测试文件、3 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于状态动作按钮和权限文案缺失，符合预期。
- GREEN：同命令通过，1 个测试文件、6 项。
- 定向收口：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，2 个测试文件、9 项。
- 预检：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `miniapp-backend` 未启动。
- 全量收口：`npm.cmd run quality`
  - 结果：通过，44 个测试文件、235 项；`vue-tsc --noEmit` 和 `vite build` 通过。构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 未完成

- 尚未做真实支付、会员、核销、客户资料、CRM 跟进或服务记录。
- 尚未做生产环境发布。
- 尚未规划门店资料、项目目录、员工名册、预约规则等中性配置面的 admin 编辑入口。

## 下一步

1. 跑 `npm.cmd run admin:check` 和 `npm.cmd run quality` 完成本轮收口验证。
2. 下一轮可做门店预约配置面规划：门店资料、项目目录、员工名册、预约规则。
3. 若继续增强工作台，可补充状态操作的二次确认、批注/备注和操作审计展示，但仍不碰支付、核销和客户资料。
