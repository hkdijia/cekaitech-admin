# Current Task

## 当前任务

- 名称：LMA-FB-018 法律工具来源与交互蓝图管理页
- OpenSpec 变更：无；延续法律助手竞品工具全盘吸收和来源/蓝图治理切片。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-018`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`HaYpcv`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（管理端 API 客户端、页面、全量质量和 diff 检查通过，待提交、推送和企业微信回写）

## 当前状态

- 既有 `/legal-tool-center` 页面已覆盖能力库、展示分组和曝光入口。
- 本轮新增“数据来源”和“交互蓝图”两个标签页。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 页面只编辑结构化字段和受控 JSON 文本，不提供任意 WXML/HTML/CSS/JS 编辑能力。

## 已完成

- [反馈编号：LMA-FB-018] `src/api/legalToolCenter.ts` 新增 `pageLegalToolDataSources`、`saveLegalToolDataSource`、`pageLegalToolInteractionBlueprints`、`saveLegalToolInteractionBlueprint`。
- [反馈编号：LMA-FB-018] `LegalToolCenterPage.vue` 新增数据来源表格、维护弹窗、加载和保存逻辑。
- [反馈编号：LMA-FB-018] `LegalToolCenterPage.vue` 新增交互蓝图表格、维护弹窗、加载和保存逻辑。
- [反馈编号：LMA-FB-018] 保存 payload 显式去除 `createdAt/updatedAt` 等审计字段。

## 未完成

- [反馈编号：LMA-FB-018] 提交、推送，并与后端和小程序追溯文档一起回写企业微信智能表格。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 失败于 `pageLegalToolDataSources is not a function`。
- GREEN：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 通过，1 个测试文件、4 个 Vitest 测试通过。
- RED：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于数据来源 loader 和 dialog 函数缺失。
- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts` 通过，2 个测试文件、11 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，28 个测试文件、118 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过。
- 差异检查：`git diff --check` 无空白错误，仅提示 Windows 换行转换。

## 下一步

1. 提交并推送 `feat: add legal tool source blueprint admin`。
2. 配合后端和法律助手小程序追溯文档回写企业微信智能表格。
