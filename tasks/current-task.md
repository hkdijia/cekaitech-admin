# Current Task

## 当前任务

- 名称：LMA-FB-037 常用年度数据管理端维护首片
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-037`
- 来源文档：当前会话竞品对标延续 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：已完成未提交，管理端 quality 通过，待三仓提交、推送和回写

## 当前状态

- 管理端法律工具中心新增“常用年度数据”维护 tab。
- 可通过受控后端 API 查看和保存地区、年度、指标、数值、来源版本、核验日期、状态等结构化字段。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段，不下发任意小程序代码。
- 本仓管理端定向验证已完成，待后续三仓全量验证、推送和企业微信回写。

## 已完成

- [反馈编号：LMA-FB-037] `src/api/legalToolCenter.ts` 新增年度数据分页和保存 API 封装。
- [反馈编号：LMA-FB-037] `LegalToolCenterPage.vue` 新增“常用年度数据”表格和编辑弹窗。
- [反馈编号：LMA-FB-037] `vite.config.ts` 排除 `.worktrees/**` 测试扫描，避免旧 worktree 测试重复进入 quality。

## 最近验证

- RED：`npm.cmd run test -- src/api/legalToolCenter.test.ts` 失败于 `pageAnnualCommonData is not a function`。
- RED：`npm.cmd run test -- src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于年度数据 API 未调用、页面方法不存在。
- GREEN：`npm.cmd run test -- src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，2 个测试文件、19 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、144 项 Vitest，类型检查和构建通过。
- `git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 配合后续三仓全量验证。
2. 推送并完成企业微信回写。
