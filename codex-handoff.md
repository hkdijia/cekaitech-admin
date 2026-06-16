# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：年度数据治理覆盖矩阵 admin 接入完成，待发布联调。
- 最近完成：数据同步/发布页新增“年度覆盖矩阵”页签，调用 backend 年度数据覆盖矩阵只读接口并展示年份、地区/指标覆盖、缺失指标和最近同步批次。
- 未完成：backend 新接口发布后部署 admin 静态资源，并在线上验证覆盖矩阵页签。

## 关键文件

- `src/api/dataGovernance.ts`
- `src/api/dataGovernance.test.ts`
- `src/pages/data-governance/DataGovernancePage.vue`
- `src/pages/data-governance/DataGovernancePage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- 定向测试：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts`
- 质量检查：`npm.cmd run quality`
- 空白检查：`git diff --check`
- 生产静态发布：`powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1`

## 最近验证

- [反馈编号：无] RED/GREEN：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 先失败于缺少覆盖矩阵 API 封装和页面加载，GREEN 后通过 2 个测试文件、15 项。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，Vitest 35 个测试文件、184 项测试通过，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 `@vueuse/core` PURE 注释 warning 和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 年度数据治理主线
- 本地台账：无
- 当前状态：已完成本地实现和验证，待提交、推送和后续发布

## 注意事项

- 本仓不直连数据库，只通过 `miniapp-backend` 编排接口读写。
- 本轮 admin 依赖 backend 新接口 `POST /api/admin/data-governance/annual-common-data/coverage-matrix`；backend 未发布前线上 admin 无法验证该页签数据。
- 用户偏好：Codex 可本地提交，远程 GitHub 推送由用户执行。

## 下一步建议

1. 本地提交 admin 覆盖矩阵改动。
2. 用户推送 admin 提交；backend 发布新接口后部署 admin 静态资源。
3. 继续年度数据治理：按覆盖矩阵确认最新有效数据范围并推进缺口补齐。
