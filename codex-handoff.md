# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 接入前置预检已完成。
- 最近完成：`scripts/check-admin-integration-ready.mjs` 增加门店预约 admin 预检；新增 `docs/store-appointment-admin-precheck.md`。
- 未完成：门店预约 admin API client、只读列表页、详情抽屉和后续状态流转。

## 关键文件

- `docs/store-appointment-admin-precheck.md`
- `scripts/check-admin-integration-ready.mjs`
- `scripts/check-admin-integration-ready.test.mjs`
- `docs/变更日志.md`
- `tasks/current-task.md`

## 关键命令

- `npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs` 失败于 `report.storeAppointment` 缺失。
- [反馈编号：无] GREEN：同命令通过，1 个测试文件、4 项。
- [反馈编号：无] 预检：`npm.cmd run admin:check` 输出 PASS 10 / WARN 1 / FAIL 0；WARN 为本地 `miniapp-backend` 未启动。门店预约 admin 预检按预期提示页面尚未接入。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，42 个测试文件、224 项；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已验证，待本地提交，之后等待用户推送远程。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 不读取 `store-demo-miniapp` 本机 `wx storage`，不把 Demo 虚拟门店、虚拟员工、销售话术带入 admin 默认数据。
- 门店预约首片建议只读：列表 + 详情抽屉。状态流转、支付、会员、核销、客户资料、CRM 跟进和服务记录延后。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 跑 `npm.cmd run admin:check` 和 `npm.cmd run quality` 完成收口验证。
2. 若继续实现，先新增 `src/api/storeAppointments.ts` 和对应 API 测试。
3. 再新增 `/store-appointments` 只读列表和详情抽屉，暂不做状态变更按钮。
