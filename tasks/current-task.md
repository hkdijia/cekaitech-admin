# Current Task

## 当前任务

- 名称：门店预约支付商业闭环包契约规划
- OpenSpec 变更：无。承接 Store Appointment Admin Pack 索引中的下一阶段建议，补齐支付商业闭环包的产品和后端契约规划资产。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`docs/store-appointment-admin-pack-contract-index.md`、`docs/store-appointment-admin-commercial-portability-guide.md`
- 本地台账：无
- 当前状态：已验证，待本地提交。

## 当前状态

- 支付能力最终需要实现，并应作为商业闭环包独立交付。
- 本轮新增 `docs/store-appointment-payment-contract-plan.md`，仅定义支付商业闭环包的规划态产品范围、后端契约方向、权限、审计、安全和验收门禁。
- 本轮不新增 API client，不新增页面入口，不调用真实支付，不创建订单，不处理退款或核销，不改变基础预约包页面能力。
- 基础预约包继续不得出现半成品支付入口，不得用 `priceText` 伪装真实金额。

## 已完成

- [反馈编号：无] 新增 `scripts/store-appointment-payment-contract-plan.test.mjs`，验证支付规划资产存在、链接能力包索引、保持规划态且未新增 admin 支付实现。
- [反馈编号：无] 新增 `docs/store-appointment-payment-contract-plan.md`，定义支付产品设计、后端订单模型、规划态 API、权限码、审计安全、异常补偿和验收门禁。
- [反馈编号：无] 更新 `docs/store-appointment-admin-pack-contract-index.md`，将支付商业闭环包契约规划纳入 Store Appointment Admin Pack 资产索引。
- [反馈编号：无] 保留上一轮 `docs/store-appointment-config-audit-contract-design.md` 和 `scripts/store-appointment-config-audit-contract-index.test.mjs` 的资产引用，避免 checkpoint 随任务切换丢失已落地契约索引。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮规划资产和边界。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs`
  - 结果：失败于 `docs/store-appointment-payment-contract-plan.md` 不存在，以及能力包索引和 checkpoint 未链接该规划，证明测试能捕获支付契约规划缺失。
- GREEN：`npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs`
  - 结果：1 个测试文件、4 项通过。
- 定向组合：`npm.cmd run test -- --run scripts/store-appointment-payment-contract-plan.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：5 个测试文件、46 项通过。
- 联调检查：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本机 `http://127.0.0.1:8080/api/health` 未启动。
- 全量质量：`npm.cmd run quality`
  - 结果：63 个测试文件、313 项通过；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。首次运行发现上一轮审计契约测试把 checkpoint 固定到旧任务名称，已修正为验证审计资产引用。
- 提交前检查：`git diff --check`
  - 结果：无空白错误，仅 Windows 换行提示。
- 观察者复核：独立线程创建失败于 `agent thread limit reached`，已执行本地观察者清单复核。
  - 结果：无 Critical / Important 问题；确认本轮未新增门店预约支付 API client、页面入口、真实支付、订单、退款、核销或后端接口实现，支付商业闭环包仍为规划态。

## 未完成

- 尚未本地提交本轮支付商业闭环包契约规划切片。
- 尚未合回 `cekaitech-admin` 主工作区。
- 尚未做生产环境发布。

## 下一步

1. 提交 `docs: add store appointment payment contract plan`，提交正文包含 `Refs: none`。
2. 检查 `cekaitech-admin` 主工作区状态，必要时 cherry-pick 合回。
