# Current Task

## 当前任务

- 名称：LMA-FB-032 交通事故等人身损害赔偿首片管理端覆盖
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-032`
- 来源文档：当前会话竞品对标延续 / 法律助手本地台账
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：已验证待推送

## 当前状态

- 管理端本轮只补法律工具中心测试样本覆盖。
- 不新增交通事故等人身损害赔偿独立规则维护页。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段。

## 已完成

- [反馈编号：LMA-FB-032] 法律工具中心测试样本新增 `traffic_personal_injury_compensation` 能力、曝光入口和官方来源记录。
- [反馈编号：LMA-FB-032] 覆盖“交通事故等人身损害赔偿参考”标题、`ambulance` 图标、目标页、`miniapp_local_calculation` 执行方式、`high` 风险等级和来源版本。

## 最近验证

- RED：`npm.cmd test -- LegalToolCenterPage.test.ts` 失败于页面缺少“交通事故等人身损害赔偿参考”。
- GREEN：`npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。
- 收口验证：`npm.cmd run quality` 通过，32 个测试文件、141 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；`git diff --check` 无空白错误。

## 下一步

1. 推送本仓提交。
2. 配合小程序最终回写企业微信智能表格。
