# Current Task

## 当前任务

- 名称：LMA-FB-033 工伤赔偿首片管理端覆盖
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-033`
- 来源文档：当前会话竞品对标延续 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：已提交待推送

## 当前状态

- 管理端本轮只补法律工具中心测试样本覆盖。
- 不新增工伤赔偿独立规则维护页。
- 不新增独立地区数据维护页。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段。
- 本仓管理端提交已落地，等待三仓收口验证和企业微信回写。

## 已完成

- [反馈编号：LMA-FB-033] 法律工具中心测试样本新增 `work_injury_compensation` 能力、曝光入口和官方来源记录。
- [反馈编号：LMA-FB-033] 覆盖“工伤赔偿伤残等级参考”标题、`briefcase-medical` 图标、目标页、`miniapp_local_calculation` 执行方式、`high` 风险等级和来源版本。
- [反馈编号：LMA-FB-033] 官方来源 key 为 `state_council_2010_work_injury_insurance_regulation`，来源名称为“工伤保险条例”。

## 最近验证

- RED：`npm.cmd test -- LegalToolCenterPage.test.ts` 失败于页面缺少“工伤赔偿伤残等级参考”。
- GREEN：`npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。
- 复核修复：补充工伤能力、曝光入口和来源 mock fixture 的结构化字段归属断言。

## 下一步

1. 等待三仓收口验证。
2. 配合企业微信回写。
