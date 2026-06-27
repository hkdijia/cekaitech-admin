# Current Task

## 当前任务

- 名称：门店预约配置审计记录列表后端接口契约测试规划
- OpenSpec 变更：无。承接 Store Appointment Admin Pack 索引和 `docs/store-appointment-config-audit-contract-design.md`，先规划审计记录列表后端接口实现前必须补齐的契约测试资产。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`docs/store-appointment-admin-pack-contract-index.md`、`docs/store-appointment-config-audit-contract-design.md`
- 本地台账：无
- 当前状态：已验证，待本地提交。

## 当前状态

- 本轮新增 `scripts/store-appointment-config-audit-api-contract-plan.test.mjs`，先以 RED 锁定审计记录列表后端接口契约测试规划资产缺失。
- 本轮补充 `docs/store-appointment-config-audit-api-contract-plan.md`，只定义后端接口实现前的契约测试范围和验收门禁。
- 当前仍不实现后端接口，不新增 API client，不新增页面入口，不改变门店预约 admin 页面。
- 配置审计记录列表进入实现前，必须先完成后端契约测试、权限和租户隔离测试、字段白名单和脱敏测试、错误码与空列表测试、回滚链路联动测试。

## 已完成

- [反馈编号：无] 新增 RED 测试 `scripts/store-appointment-config-audit-api-contract-plan.test.mjs`，验证规划文档、能力包索引和 checkpoint 需要同步存在。
- [反馈编号：无] 新增规划文档 `docs/store-appointment-config-audit-api-contract-plan.md`，覆盖分页参数、surface 白名单、storeCode 范围、权限 403、空列表、`rollbackAvailable`、raw payload 禁止暴露、跨门店查询和跨租户查询。
- [反馈编号：无] 更新 `docs/store-appointment-admin-pack-contract-index.md`，将审计记录列表后端接口契约测试规划纳入 Store Appointment Admin Pack 资产索引。
- [反馈编号：无] 修正 `scripts/store-appointment-payment-contract-plan.test.mjs` 和 `scripts/store-appointment-white-label-pack-plan.test.mjs` 的 checkpoint 过度绑定，历史规划资产改由能力包索引守住，checkpoint 只记录当前现场。
- [反馈编号：无] 完成本轮 GREEN、门店预约契约组合、`admin:check`、`quality` 和 `git diff --check`。
- [反馈编号：无] 观察者线程启动后被关闭且无可用复核输出，已改走本地观察者门禁清单；确认本轮没有 `src/`、`dist/`、`.env`、路由、API client 或页面入口改动，`audit-logs` 只出现在规划文档和守卫测试中。

## 未完成

- 尚未本地提交和合回主工作区。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/store-appointment-config-audit-api-contract-plan.test.mjs`
  - 结果：失败于 `docs/store-appointment-config-audit-api-contract-plan.md` 不存在，以及能力包索引和 checkpoint 未链接该规划，证明测试能捕获规划资产缺失。
- GREEN：`npm.cmd run test -- --run scripts/store-appointment-config-audit-api-contract-plan.test.mjs`
  - 结果：1 个测试文件、4 项通过。
- 定向组合：`npm.cmd run test -- --run scripts/store-appointment-config-audit-api-contract-plan.test.mjs scripts/store-appointment-config-audit-contract-index.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：6 个测试文件、50 项通过。
- 前序规划脚本组合：`npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs scripts/store-appointment-white-label-pack-plan.test.mjs scripts/store-appointment-config-audit-api-contract-plan.test.mjs scripts/store-appointment-config-audit-contract-index.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs`
  - 结果：6 个测试文件、24 项通过。
- 联调检查：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本机 `http://127.0.0.1:8080/api/health` 未启动。
- 全量质量：`npm.cmd run quality`
  - 结果：65 个测试文件、322 项通过；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。
- 提交前检查：`git diff --check`
  - 结果：无空白错误，仅 Windows 换行提示。
- 观察者复核：独立线程无可用输出，已执行本地观察者门禁清单。
  - 结果：无 Critical / Important 问题；确认本轮仍为规划态文档/脚本/checkpoint 切片，没有新增后端接口、API client、页面入口或禁区能力。

## 下一步

1. 复验本轮契约组合和 `git diff --check`。
2. 本地提交，提交正文包含 `Refs: none`。
3. 检查主工作区状态并 cherry-pick 合回。
