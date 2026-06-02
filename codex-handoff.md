# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：`LMA-FB-041-C` 年度常用数据 admin 核验发布切片实施中。
- 最近完成：数据同步/发布页新增年度数据同步批次、revision 和 JSON 导入能力，定向测试已通过。
- 未完成：管理端全量 quality、提交推送、小程序总台账同步和企业微信阶段回写。

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
- `git status --short`

## 最近验证

- [反馈编号：LMA-FB-041] RED：定向测试失败于年度 API 函数不存在、页面年度 JSON 编辑器不存在。
- [反馈编号：LMA-FB-041] GREEN：`npm.cmd run test -- --run src/api/dataGovernance.test.ts src/pages/data-governance/DataGovernancePage.test.ts` 通过，2 个测试文件、11 项 Vitest。
- [反馈编号：LMA-FB-041] 待运行：`npm.cmd run quality` 和 `git diff --check`。

## 追溯信息

- 反馈编号：`LMA-FB-041`
- 来源文档：当前会话数据治理闭环规划 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：管理端定向验证通过，待全量验证、推送和回写

## 注意事项

- 本仓只通过 `miniapp-backend` 受控 API 管理结构化年度数据，不下发任意小程序代码。
- 本仓不直连数据库，不控制 crawler 进程；年度 JSON 导入后由后端负责幂等、冲突和 revision 审计。
- `.runtime-logs/` 为本地运行日志，不纳入提交。

## 下一步建议

1. 运行管理端全量 quality 和空白检查。
2. 同步小程序总台账。
3. 推送并完成企业微信阶段回写。
