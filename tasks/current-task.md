# Current Task

## 当前任务

- 名称：门店预约白标托管后台配置清单
- OpenSpec 变更：无。承接 Store Appointment Admin Pack 索引中的下一阶段建议，补齐白标托管后台的品牌、权限和部署配置清单资产。

## 追溯信息

- 反馈编号：`无`
- 来源文档：本地工程接力、`docs/store-appointment-admin-pack-contract-index.md`、`docs/store-appointment-admin-commercial-portability-guide.md`
- 本地台账：无
- 当前状态：已验证，待本地提交。

## 当前状态

- `cekaitech-admin` 仍是当前样板宿主和自营后台，不直接改造成客户后台。
- 本轮新增 `docs/store-appointment-white-label-pack-plan.md`，仅定义白标托管后台的规划态品牌、权限、部署、模块开关和验收门禁。
- 本轮不新增运行时代码，不新增路由，不改布局，不改登录，不改主题实现，不创建客户后台，不写生产配置。
- 白标托管实现前必须先完成品牌配置来源、权限映射、API base URL、客户域名、租户上下文、模块开关和 secret 扫描设计。

## 已完成

- [反馈编号：无] 新增 `scripts/store-appointment-white-label-pack-plan.test.mjs`，验证白标配置清单存在、链接能力包索引、保持规划态且未新增路由或布局运行时实现。
- [反馈编号：无] 新增 `docs/store-appointment-white-label-pack-plan.md`，定义品牌配置、术语配置、权限映射、部署配置、模块开关、数据隔离、禁止携带内容和验收门禁。
- [反馈编号：无] 更新 `docs/store-appointment-admin-pack-contract-index.md`，将白标托管后台配置清单纳入 Store Appointment Admin Pack 资产索引。
- [反馈编号：无] 保留 `docs/store-appointment-config-audit-contract-design.md`、`docs/store-appointment-payment-contract-plan.md` 和对应测试资产引用，避免 checkpoint 随任务切换丢失已落地契约索引。
- [反馈编号：无] `docs/变更日志.md` 已记录本轮规划资产和边界。

## 最近验证

- RED：`npm.cmd run test -- --run scripts/store-appointment-white-label-pack-plan.test.mjs`
  - 结果：失败于 `docs/store-appointment-white-label-pack-plan.md` 不存在，以及能力包索引和 checkpoint 未链接该规划，证明测试能捕获白标配置清单缺失。
- GREEN：`npm.cmd run test -- --run scripts/store-appointment-white-label-pack-plan.test.mjs`
  - 结果：1 个测试文件、4 项通过。
- 定向组合：`npm.cmd run test -- --run scripts/store-appointment-white-label-pack-plan.test.mjs scripts/store-appointment-admin-pack-contract-index.test.mjs scripts/store-appointment-frontend-contract-guard.test.mjs src/api/storeAppointments.test.ts src/pages/store-appointments/StoreAppointmentsPage.test.ts`
  - 结果：5 个测试文件、46 项通过。
- 联调检查：`npm.cmd run admin:check`
  - 结果：PASS 13 / WARN 1 / FAIL 0；WARN 为本机 `http://127.0.0.1:8080/api/health` 未启动。
- 全量质量：`npm.cmd run quality`
  - 结果：64 个测试文件、318 项通过；`vue-tsc --noEmit` 和 `vite build` 通过，保留既有 PURE 注释和 chunk size warning。首次运行发现上一轮支付契约测试把 checkpoint 固定到旧任务名称，已修正为验证支付资产引用。
- 提交前检查：`git diff --check`
  - 结果：无空白错误，仅 Windows 换行提示。
- 观察者复核：独立线程 `Nash` 完成复核。
  - 结果：无 Critical；发现 1 个 Important，指出白标测试对“无运行时代码”的守卫范围不足，已补强为扫描本轮 git 变更并只允许文档、脚本测试和 checkpoint 资产；1 个 Minor 为下一步状态滞后，已修正。复验契约组合 4 个文件、16 项通过，`quality` 通过。

## 未完成

- 尚未本地提交本轮白标托管后台配置清单切片。
- 尚未合回 `cekaitech-admin` 主工作区。
- 尚未做生产环境发布。

## 下一步

1. 提交 `docs: add store appointment white label pack plan`，提交正文包含 `Refs: none`。
2. 检查 `cekaitech-admin` 主工作区状态，必要时 cherry-pick 合回。
