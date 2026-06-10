# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 数据治理 LPR 只读预览接入已实现并通过收口验证，待本地提交。
- 最近完成：数据同步/发布页 LPR JSON tab 新增只读预览入口，展示新增、跳过、更新、冲突摘要和明细；LPR JSON 发布/预览都会保留治理元字段。
- 未完成：本地提交、用户手动推送；如需线上可见，需要先部署 backend 新镜像，再同步 admin 静态资源到服务器。

## 关键文件

- `src/api/dataGovernance.ts`
- `src/api/dataGovernance.test.ts`
- `src/pages/data-governance/DataGovernancePage.vue`
- `src/pages/data-governance/DataGovernancePage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts`
- `npm.cmd run quality`
- `git diff --check`
- `git status -sb`

## 最近验证

- [反馈编号：无] API RED：`npm.cmd run test -- --run src/api/dataGovernance.test.ts` 失败于 `previewLprRates is not a function`。
- [反馈编号：无] API GREEN：同命令通过，1 个测试文件、8 项 Vitest。
- [反馈编号：无] 页面 RED：`npm.cmd run test -- --run src/pages/data-governance/DataGovernancePage.test.ts` 失败于页面丢失 LPR payload 元字段且缺少预览按钮。
- [反馈编号：无] 页面 GREEN：同命令通过，1 个测试文件、6 项 Vitest。
- [反馈编号：无] 定向回归：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 通过，2 个测试文件、14 项 Vitest。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，33 个测试文件、160 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和大 chunk warning。
- [反馈编号：无] 空白检查：`git diff --check` 通过，仅 Windows 换行提示。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / LPR 数据治理采集预览与只读差异链路
- 本地台账：无
- 当前状态：已实现并通过收口验证

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- 线上要看到 LPR 预览按钮完整可用，需要 backend 先上线包含 `/lpr-rates/preview` 的新镜像，否则 admin 静态页面会请求到 404。

## 下一步建议

1. 本地提交后等待用户手动推送。
2. 如用户需要线上可见，先部署 backend 新镜像，再执行 admin 静态资源部署脚本并 smoke。
