# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 配置快照接入已完成。
- 最近完成：`getStoreAppointmentBookingConfig` API client、门店预约工作台“配置快照”只读区、门店资料/项目/员工/规则展示。
- 未完成：真实支付、会员、核销、客户资料、CRM 跟进、服务记录、生产发布和配置面编辑入口。

## 关键文件

- `src/api/storeAppointments.ts`
- `src/api/storeAppointments.test.ts`
- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于 `getStoreAppointmentBookingConfig is not a function` 和配置快照入口未调用。
- [反馈编号：无] 定向收口：同命令通过，2 个测试文件、11 项。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：定向验证已通过，待完整质量验证和本地提交，之后等待用户推送远程。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 不读取 `store-demo-miniapp` 本机 `wx storage`，不把 Demo 虚拟门店、虚拟员工、销售话术带入 admin 默认数据。
- 状态流转只处理预约状态，不包含退款、通知、核销、服务备注、客户资料或 CRM 跟进。
- 配置快照只读读取后端公开 `booking-config`；当前不保存门店资料、项目、员工或规则，不把 demo 虚拟门店和销售话术作为 admin 默认数据。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 完成本轮 `admin:check`、`quality` 和本地提交。
2. 下一轮可做门店预约配置编辑前置方案：candidate 字段、权限边界、后端接口缺口和不可进入项。
3. 若继续增强工作台，可做状态动作二次确认、备注字段和操作审计展示。
