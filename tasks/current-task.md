# Current Task

## 当前任务

- 名称：LMA-FB-030 延迟法定退休年龄计算首片管理端覆盖
- OpenSpec 变更：无；实施计划见 `C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/superpowers/plans/2026-06-01-statutory-retirement-age-tool.md`。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-030`
- 来源文档：当前会话竞品对标延续 / LMA 智能表格台账 record_id=`DpS8iy`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（管理端法律工具中心定向和全量质量通过，待提交、推送、回写）

## 当前状态

- 管理端本轮只补 `LegalToolCenterPage.test.ts` 样本覆盖，证明法律工具中心能展示 `statutory_retirement_age` 能力、曝光入口和官方来源记录。
- 不新增独立退休年龄规则维护页面。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段，不直连数据库，不下发任意 WXML/HTML/CSS/JS。

## 已完成

- [反馈编号：LMA-FB-030] 法律工具中心测试样本新增 `statutory_retirement_age` 能力、曝光入口和 `npc_2024_statutory_retirement_age` 官方来源记录。
- [反馈编号：LMA-FB-030] 覆盖“延迟退休年龄”标题、`hourglass` 图标、`/pages/statutory-retirement-age/statutory-retirement-age` 跳转、`miniapp_local_calculation` 执行方式、`medium` 风险等级和 `npc-2024-statutory-retirement-age` 来源版本。

## 未完成

- [反馈编号：LMA-FB-030] 管理端提交、推送和企业微信回写。

## 最近验证

- RED：`npm.cmd test -- LegalToolCenterPage.test.ts` 失败于页面缺少“延迟退休年龄”。
- GREEN：`npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。
- 全量质量：`npm.cmd run quality` 通过，32 个测试文件、141 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；仅保留既有 Rollup PURE 注释和 chunk size warning。

## 下一步

1. 只提交本轮管理端相关文件，提交正文包含 `Refs: LMA-FB-030`。
2. 等待三仓推送后回写企业微信智能表格 `DpS8iy`。
