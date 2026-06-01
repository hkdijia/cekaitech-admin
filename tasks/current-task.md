# Current Task

## 当前任务

- 名称：LMA-FB-034 小额诉讼限额管理端覆盖
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-034`
- 来源文档：当前会话竞品对标延续 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：阶段验证已完成，待三仓收口推送回写

## 当前状态

- 管理端本轮只补法律工具中心测试样本覆盖。
- 不新增小额诉讼限额年度数据维护页。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段。
- 本仓管理端阶段验证已完成，待后续三仓收口、推送和企业微信回写。

## 已完成

- [反馈编号：LMA-FB-034] 法律工具中心测试样本新增 `small_claim_limit` 能力、曝光入口和官方来源记录。
- [反馈编号：LMA-FB-034] 覆盖“小额诉讼限额核对参考”标题、`badge-check` 图标、目标页、`miniapp_local_calculation` 执行方式、`medium` 风险等级、`static_rule` 数据依赖和来源版本。
- [反馈编号：LMA-FB-034] 官方来源 key 为 `civil_procedure_law_small_claim_limit`，来源版本为 `civil-procedure-law-small-claim-limit`。

## 最近验证

- RED：`npm.cmd test -- LegalToolCenterPage.test.ts` 失败于能力 fixture 缺少 `small_claim_limit`。
- GREEN：`npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。

## 下一步

1. 配合后续三仓收口验证。
2. 推送并完成企业微信回写。
