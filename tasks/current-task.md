# Current Task

## 当前任务

- 名称：门店预约 admin 接入前置收口
- OpenSpec 变更：无。承接 `store-demo-miniapp`、`store-appointment-miniapp-template` 和 `miniapp-backend` 已形成的门店预约契约。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力与当前会话规划
- 本地台账：无
- 当前状态：已完成 admin 接入前置预检，待进入首片页面实现判断。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 本仓不直连数据库，不读取 Demo 本机 `wx storage`，不复制 Demo 虚拟门店或销售话术。
- 门店预约 admin 首片建议限定为只读列表 + 详情抽屉。

## 已完成

- [反馈编号：无] 新增 `docs/store-appointment-admin-precheck.md`，明确现有 admin 模式、后端契约、首片建议和暂不做范围。
- [反馈编号：无] 扩展 `scripts/check-admin-integration-ready.mjs`，输出门店预约 admin 前置预检、后端接口、权限、首片策略和排除能力。
- [反馈编号：无] 补充 `scripts/check-admin-integration-ready.test.mjs`，用 TDD 锁定门店预约 admin 接入前置边界。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`
  - 结果：失败于 `report.storeAppointment` 缺失，符合预期。
- GREEN：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs`
  - 结果：通过，1 个测试文件、4 项。
- 预检：`npm.cmd run admin:check`
  - 结果：PASS 10 / WARN 1 / FAIL 0；WARN 为本地 `miniapp-backend` 未启动。门店预约 admin 前置预检按预期输出为 WARN，表示页面尚未接入。
- 收口：`npm.cmd run quality`
  - 结果：通过，42 个测试文件、224 项；`vue-tsc --noEmit` 和 `vite build` 通过。构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 未完成

- 尚未新增 `src/api/storeAppointments.ts`。
- 尚未新增 `/store-appointments` 页面、路由和菜单。
- 尚未对接 `POST /api/admin/store-appointments/{appointmentId}/status` 状态流转。

## 下一步

1. 若进入实现，先按 TDD 新增 `src/api/storeAppointments.ts` 分页和详情接口封装。
2. 再新增 `/store-appointments` 只读列表 + 详情抽屉，权限码使用 `admin:store-appointment:view`。
3. 状态流转按钮延后到生产权限、审计、通知和门店真实工作流确认后再做。
