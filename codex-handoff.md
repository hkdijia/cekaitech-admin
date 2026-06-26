# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：门店预约 admin 配置前端契约同步切片。
- 最近完成：将门店预约配置面从 `missing-admin-api` 缺口清单同步为 `backend-ready-frontend-pending` 后端契约已具备、前端表单待接入状态，并修正规则接口路径。
- 未完成：配置编辑表单、四配置块 API client、`X-Request-Id` 写请求、回滚预览/确认/执行、生产发布。

## 关键文件

- `src/pages/store-appointments/StoreAppointmentsPage.vue`
- `src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `scripts/check-admin-integration-ready.mjs`
- `scripts/check-admin-integration-ready.test.mjs`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts`
- `npm.cmd run admin:check`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd run test -- --run scripts/check-admin-integration-ready.test.mjs src/pages/store-appointments/StoreAppointmentsPage.test.ts` 失败于 `adminConfigContract` 缺失和页面仍展示“admin API 缺口”。
- [反馈编号：无] GREEN：同命令通过，2 个测试文件、16 项。
- [反馈编号：无] 收口：`npm.cmd run admin:check` 通过，PASS 13 / WARN 1 / FAIL 0；WARN 为本地 8080 后端未启动。
- [反馈编号：无] 收口：`npm.cmd run quality` 通过，44 个测试文件、241 项，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：契约同步完整质量验证已通过，待本地提交。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- 当前只是前端契约同步，不代表页面已经可以保存配置。
- 后端正式规则接口是 `/api/admin/store-appointment-config/rules/{storeCode}`，不要再使用旧候选 `/stores/{storeCode}/rules`。
- 四个中性配置面状态为 `backend-ready-frontend-pending`：门店资料、项目目录、员工名册、预约规则。
- 页面仍必须排除真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款、客户账户策略。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 完成本轮本地提交。
2. 下一切片按 TDD 新增 `storeAppointmentConfig` API client，覆盖 GET/PUT 四配置块和写请求 `X-Request-Id`。
3. API client 绿灯后再进入配置编辑页面切片，先做门店资料 block，再扩展项目、员工、规则和回滚。
