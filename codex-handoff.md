# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：阳律通失信/限高查询 admin 接入已完成。
- 最近完成：后台 API client、状态映射、`/legal-credit-query-tasks` 路由和任务复核页面。
- 未完成：小程序专业能力入口、提交查询、任务列表和结果详情；外层 smoke/runbook。

## 关键文件

- `src/api/legalCreditQueries.ts`
- `src/api/legalCreditQueries.test.ts`
- `src/pages/legal-credit-queries/legalCreditQueryStatus.ts`
- `src/pages/legal-credit-queries/legalCreditQueryStatus.test.ts`
- `src/pages/legal-credit-queries/LegalCreditQueriesPage.vue`
- `src/pages/legal-credit-queries/LegalCreditQueriesPage.test.ts`
- `src/router/index.ts`
- `src/router/router.test.ts`

## 关键命令

- `npm.cmd test -- legalCreditQueries.test.ts legalCreditQueryStatus.test.ts router.test.ts`
- `npm.cmd test -- LegalCreditQueriesPage.test.ts`
- `npm.cmd run quality`

## 最近验证

- [反馈编号：无] RED：`npm.cmd test -- legalCreditQueries.test.ts legalCreditQueryStatus.test.ts router.test.ts` 失败于新增模块和路由缺失。
- [反馈编号：无] GREEN：同命令通过，3 个测试文件、28 项。
- [反馈编号：无] 页面 RED：`npm.cmd test -- LegalCreditQueriesPage.test.ts` 失败于占位页未加载任务、详情和操作。
- [反馈编号：无] 页面 GREEN：同命令通过，1 个测试文件、6 项。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，Vitest 38 个测试文件、197 项测试通过，`vue-tsc --noEmit` 和 `vite build` 通过；保留既有 Rollup 注释 warning 和 chunk size warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：`..\..\miniapp\docs\superpowers\plans\2026-06-17-credit-restriction-full-integration.md`
- 本地台账：无
- 当前状态：已验证，待本地提交，之后等待用户推送远程。

## 注意事项

- admin 只调用 `miniapp-backend` 受控 API，不直连数据库。
- admin 不控制本地 crawler 进程，不保存 worker token。
- 本轮没有生产部署，`dist/` 构建产物不提交。

## 下一步建议

1. 切到 `C:\home\work_space\myself\miniapp\lawsuit-material-assistant` 实现小程序 API client 和页面路由。
2. 实现专业能力入口、查询提交、任务列表和结果详情。
3. 后续补外层 smoke/runbook。
