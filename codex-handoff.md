# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：LMA-FB-018 第三片 LPR 查询小闭环管理端，API 客户端、页面标签页和全量质量验证已通过。
- 最近完成：在 `/legal-tool-center` 上新增“LPR利率”维护标签页，接入后端 `lpr-rates/page|save` API。
- 未完成：提交、推送和企业微信回写。

## 关键文件

- `src/api/legalToolCenter.ts`
- `src/api/legalToolCenter.test.ts`
- `src/pages/legal-tool-center/LegalToolCenterPage.vue`
- `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`

## 关键命令

- `npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts`
- `npm.cmd run quality`
- `git diff --check`

## 最近验证

- [反馈编号：LMA-FB-018] API RED：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 失败于 `pageLegalToolDataSources is not a function`。
- [反馈编号：LMA-FB-018] API GREEN：同一命令通过，1 个测试文件、4 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 页面 RED：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于新 loader/dialog 缺失。
- [反馈编号：LMA-FB-018] 页面 GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts` 通过，2 个测试文件、11 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 全量质量：`npm.cmd run quality` 通过，28 个测试文件、118 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过。
- [反馈编号：LMA-FB-018] 差异检查：`git diff --check` 无空白错误，仅提示 Windows 换行转换。
- [反馈编号：LMA-FB-018] LPR 定向：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，2 个测试文件、13 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] LPR 全量质量：`npm.cmd run quality` 通过，28 个测试文件、120 项 Vitest，`vue-tsc --noEmit && vite build` 通过；保留既有 Rollup PURE 注释和 chunk size warning。

## 追溯信息

- 反馈编号：`LMA-FB-018`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`HaYpcv`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（LPR 全量质量验证通过，待提交、推送和回写）

## 注意事项

- 本仓是公司级管理后台，只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 法律工具中心页面只编辑结构化字段和受控 JSON 文本，不支持任意 WXML/HTML/CSS/JS。
- 竞品交互蓝图只抽象表单组织、结果区块和 CTA 结构；不得复制竞品 UI、文案、图标、广告结构或私有数据。
- 保存 payload 已显式构造，避免把 `createdAt/updatedAt` 等后端审计字段回传。
- LPR 利率维护页只维护结构化报价数据和来源元数据；当前不做实时抓取，不绕过后端 API。

## 下一步建议

1. 提交：`feat: add legal lpr rate admin`，footer 写 `Refs: LMA-FB-018`。
2. 推送后配合后端与小程序文档提交一起回写企业微信智能表格 record_id=`HaYpcv`。
