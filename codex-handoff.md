# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：`LMA-FB-031` 破产管理人报酬上限首片管理端覆盖已提交未推送。
- 最近完成：法律工具中心测试样本新增破产管理人报酬能力、曝光入口、来源记录和全量质量验证。
- 未完成：推送和企业微信回写。

## 关键文件

- `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd test -- LegalToolCenterPage.test.ts`
- `npm.cmd run quality`
- `git diff --check`

## 最近验证

- [反馈编号：LMA-FB-031] `npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。
- [反馈编号：LMA-FB-031] 收口验证：`npm.cmd run quality` 通过，32 个测试文件、141 项 Vitest、类型检查和构建；`git diff --check` 无空白错误。

## 注意事项

- 本仓只做管理端结构化展示覆盖，不新增规则维护页。
- `.runtime-logs/` 为本地运行日志，不纳入提交。
