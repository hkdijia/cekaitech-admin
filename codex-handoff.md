# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 首片只读接入已完成。
- 最近完成：`src/api/storeAppointments.ts`、`/store-appointments` 路由菜单、`StoreAppointmentsPage.vue` 只读列表和详情抽屉。
- 未完成：状态流转按钮、真实支付、会员、核销、客户资料、CRM 跟进、服务记录和生产发布。

## 关键文件

- `src/api/storeAppointments.ts`
- `src/api/storeAppointments.test.ts`
- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `src/router/index.ts`
- `src/router/menu.ts`
- `scripts/check-admin-integration-ready.mjs`
- `docs/store-appointment-admin-precheck.md`
- `docs/变更日志.md`
- `tasks/current-task.md`

## 关键命令

- `npm.cmd run test -- --run src/api/storeAppointments.test.ts src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] API RED：`npm.cmd run test -- --run src/api/storeAppointments.test.ts` 失败于 `./storeAppointments` 模块缺失。
- [反馈编号：无] API GREEN：同命令通过，1 个测试文件、2 项。
- [反馈编号：无] 路由/预检 RED：`npm.cmd run test -- --run src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs` 失败于门店预约菜单、路由和 readiness 模块检查缺失。
- [反馈编号：无] 路由/预检 GREEN：同命令通过，2 个测试文件、29 项。
- [反馈编号：无] 页面 RED：`npm.cmd run test -- --run src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于占位页未加载预约分页、筛选和详情。
- [反馈编号：无] 页面 GREEN：同命令通过，1 个测试文件、4 项。
- [反馈编号：无] 定向收口：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/router/router.test.ts scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 通过，4 个测试文件、35 项。
- [反馈编号：无] 预检：`npm.cmd run admin:check` 输出 PASS 13 / WARN 1 / FAIL 0；WARN 为本地 `miniapp-backend` 未启动。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，44 个测试文件、232 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已验证，待本地提交，之后等待用户推送远程。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 不读取 `store-demo-miniapp` 本机 `wx storage`，不把 Demo 虚拟门店、虚拟员工、销售话术带入 admin 默认数据。
- 门店预约首片保持只读。状态流转、支付、会员、核销、客户资料、CRM 跟进和服务记录延后。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 完成本轮 `admin:check`、`quality` 和本地提交。
2. 下一轮若继续 admin，先设计状态流转的权限、审计、通知、误操作防护，再考虑接 `status` 接口。
3. 若转向业务骨架，优先做门店资料、项目目录、员工名册、预约规则这些中性配置面的 admin 规划。
