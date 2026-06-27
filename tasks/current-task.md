# Current Task

## 当前任务

- 名称：门店预约 admin 前端契约守卫
- OpenSpec 变更：无。承接 `miniapp-backend` 已完成的门店预约 admin 配置契约守卫，补齐 `cekaitech-admin` 侧前端路径、禁区能力和 checkpoint 对齐测试。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`miniapp-backend/docs/store-appointment-admin-config-api-design.md`、`miniapp-backend/docs/store-appointment-admin-config-frontend-flow-guide.md`
- 本地台账：无
- 当前状态：已验证，待本地提交。

## 当前状态

- `cekaitech-admin` 仍只通过 `miniapp-backend` 受控 API 操作业务数据。
- 门店预约工作台已具备列表、筛选、详情、状态日志、受控状态流转、配置快照、配置面 readiness、四个中性配置块、配置回滚 Flow 和 admin 配置契约。
- 本轮新增前端契约守卫测试，集中约束门店预约 admin 配置路径继续使用当前后端正式路径 `/api/admin/store-appointment-config`，不得漂移到草案路径 `/api/admin/store-appointment/config`。
- 本轮不新增后端接口，不改页面业务能力，不实现真实支付、会员、核销、客户资料、CRM、服务记录、员工账号、真实排班、消息通知、退款或客户账户策略。

## 已完成

- [反馈编号：无] 新增 `scripts/store-appointment-frontend-contract-guard.test.mjs`，覆盖前端 API、页面和组件源码的配置路径稳定性。
- [反馈编号：无] 守卫测试覆盖门店预约 admin UI 不暴露支付配置、会员配置、核销配置、CRM 配置、客户资料配置、服务记录配置、员工账号配置、真实排班配置、消息通知配置、退款配置或客户账户策略配置入口。
- [反馈编号：无] 修正 checkpoint 文档，记录当前任务已从商业化可移植性规划进入前端契约守卫收口。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮测试资产、边界和验证命令。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/store-appointment-frontend-contract-guard.test.mjs`
  - 结果：失败于 checkpoint 仍记录上一轮“商业化可移植性规划切片”，证明测试能捕获状态文档偏移。
- GREEN：`npm.cmd run test -- --run scripts/store-appointment-frontend-contract-guard.test.mjs`
  - 结果：1 个测试文件、3 项通过。
- 定向组合：`npm.cmd run test -- --run src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts scripts/store-appointment-frontend-contract-guard.test.mjs`
  - 结果：3 个测试文件、38 项通过。
- 联调检查：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本机 `http://127.0.0.1:8080/api/health` 未启动。
- 全量质量：`npm.cmd run quality`
  - 结果：60 个测试文件、301 项通过；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。
- 提交前检查：`git diff --check`
  - 结果：无空白错误，仅 Windows 换行提示。
- 观察者复核：独立线程创建失败于 agent thread limit，已执行本地观察者清单复核。
  - 结果：无 Critical / Important 问题；发现并修正“下一步”仍包含已完成验证步骤的文档一致性问题。

## 未完成

- 尚未本地提交本轮前端契约守卫切片。
- 尚未合回 `cekaitech-admin` 主工作区。
- 尚未做生产环境发布。

## 下一步

1. 提交 `test: guard store appointment admin frontend contract`，提交正文包含 `Refs: none`。
2. 检查 `cekaitech-admin` 主工作区状态，必要时 cherry-pick 合回。
