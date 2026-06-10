# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 数据治理生产巡检增强已实现，待收口验证和本地提交。
- 最近完成：数据同步/发布页“生产巡检”示范文本卡片展示 Docimax 来源、来源版本、核验日期、`226 / 226` 数量进度和文件元数据完整度。
- 未完成：运行 admin 构建/质量检查、空白检查、本地提交、用户手动推送；如需线上可见，再同步 admin 静态资源到服务器。

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

- [反馈编号：无] RED：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 失败于页面仍展示旧“示范文本 226 份”摘要。
- [反馈编号：无] GREEN：同命令通过，2 个测试文件、12 项 Vitest。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / Docimax 要素式示范文本上线后数据治理巡检增强
- 本地台账：无
- 当前状态：已实现待收口验证

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- Basic Auth 是服务器配置，本轮只写 runbook，不声称服务器已完成配置。

## 下一步建议

1. 运行 `npm.cmd run quality` 和 `git diff --check`。
2. 本地提交后等待用户手动推送。
3. 如用户需要线上可见，执行 admin 静态资源部署脚本并 smoke。
