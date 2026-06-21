# Current Task

## 当前任务

- 名称：门店预约 admin 首片只读接入
- OpenSpec 变更：无。承接 `store-demo-miniapp`、`store-appointment-miniapp-template` 和 `miniapp-backend` 已形成的门店预约契约。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已完成首片实现，待完整质量验证和本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 本仓不直连数据库，不读取 Demo 本机 `wx storage`，不复制 Demo 虚拟门店或销售话术。
- 门店预约 admin 首片已限定为只读列表 + 详情抽屉。

## 已完成

- [反馈编号：无] 新增 `src/api/storeAppointments.ts`，封装后台预约分页和预约详情两个只读接口。
- [反馈编号：无] 新增 `/store-appointments` 路由和全局菜单入口，权限码为 `admin:store-appointment:view`。
- [反馈编号：无] 新增 `StoreAppointmentsPage.vue`，支持门店、项目、员工、预约日、状态筛选，展示预约列表、详情抽屉和状态日志。
- [反馈编号：无] 扩展 `scripts/check-admin-integration-ready.mjs`，同步检查门店预约路由、API 模块和页面模块。
- [反馈编号：无] 页面明确保持“只读查看”，即使管理员有 `admin:store-appointment:manage` 权限，也不展示确认、到店、完成、取消等状态流转按钮。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts`
  - 结果：失败于 `./storeAppointments` 模块缺失，符合预期。
- GREEN：`npm.cmd run test -- --run src/api/storeAppointments.test.ts`
  - 结果：通过，1 个测试文件、2 项。
- RED：`npm.cmd run test -- --run src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs`
  - 结果：失败于 `/store-appointments` 菜单、路由和 readiness 模块检查缺失，符合预期。
- GREEN：同命令通过，2 个测试文件、29 项。
- RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：失败于占位页未加载预约分页、筛选和详情，符合预期。
- GREEN：同命令通过，1 个测试文件、4 项。
- 定向收口：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：通过，4 个测试文件、35 项。
- 预检：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `miniapp-backend` 未启动。
- 全量收口：`npm.cmd run quality`
  - 结果：通过，44 个测试文件、232 项；`vue-tsc --noEmit` 和 `vite build` 通过。构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 未完成

- 尚未对接 `POST /api/admin/store-appointments/{appointmentId}/status` 状态流转。
- 尚未设计真实支付、会员、核销、客户资料、CRM 跟进或服务记录。
- 尚未做生产环境发布。

## 下一步

1. 跑 `npm.cmd run admin:check` 和 `npm.cmd run quality` 完成本轮收口验证。
2. 如果继续推进 admin，可做门店预约状态流转的权限、审计、通知和误操作防护设计。
3. 如果回到业务建模，应先规划门店资料、项目目录、员工名册、预约规则这些中性配置面。
