# Current Task

## 当前任务

- 名称：LMA-FB-018 LPR 查询小闭环管理端
- OpenSpec 变更：无；延续法律助手竞品工具全盘吸收和来源/蓝图治理切片。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-018`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`HaYpcv`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（LPR 利率 API 客户端、页面标签页和全量质量验证通过，已提交、已推送、已回写）

## 当前状态

- 既有 `/legal-tool-center` 页面已覆盖能力库、展示分组和曝光入口。
- 第二片新增“数据来源”和“交互蓝图”两个标签页。
- 本轮新增“LPR利率”维护标签页，作为第一个后台数据维护到小程序渲染的小闭环管理入口。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 页面只编辑结构化字段和受控 JSON 文本，不提供任意 WXML/HTML/CSS/JS 编辑能力。

## 已完成

- [反馈编号：LMA-FB-018] `src/api/legalToolCenter.ts` 新增 `pageLegalToolDataSources`、`saveLegalToolDataSource`、`pageLegalToolInteractionBlueprints`、`saveLegalToolInteractionBlueprint`。
- [反馈编号：LMA-FB-018] `LegalToolCenterPage.vue` 新增数据来源表格、维护弹窗、加载和保存逻辑。
- [反馈编号：LMA-FB-018] `LegalToolCenterPage.vue` 新增交互蓝图表格、维护弹窗、加载和保存逻辑。
- [反馈编号：LMA-FB-018] 保存 payload 显式去除 `createdAt/updatedAt` 等审计字段。
- [反馈编号：LMA-FB-018] `src/api/legalToolCenter.ts` 新增 `pageLegalLprRates`、`saveLegalLprRate` 和 LPR 相关类型。
- [反馈编号：LMA-FB-018] `LegalToolCenterPage.vue` 新增“LPR利率”表格、维护弹窗、加载和保存逻辑。

## 未完成

- [反馈编号：待登记] 下一轮数据驱动治理的 admin 维护入口：本地 crawler 同步状态、发布批次、人工复核和公网数据发布记录。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 失败于 `pageLegalToolDataSources is not a function`。
- GREEN：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 通过，1 个测试文件、4 个 Vitest 测试通过。
- RED：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于数据来源 loader 和 dialog 函数缺失。
- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts` 通过，2 个测试文件、11 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，28 个测试文件、118 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过。
- 差异检查：`git diff --check` 无空白错误，仅提示 Windows 换行转换。
- LPR 定向：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，2 个测试文件、13 个 Vitest 测试通过。
- LPR 全量质量：`npm.cmd run quality` 通过，28 个测试文件、120 项 Vitest，`vue-tsc --noEmit && vite build` 通过；保留既有 Rollup PURE 注释和 chunk size warning。
- 提交推送：`f88d0de feat: add legal lpr rate admin` 已推送到 GitHub，footer `Refs: LMA-FB-018`。
- 企业微信回写：智能表格 `HaYpcv` 已更新为“已验证（LPR 查询小闭环通过，已推送）”。

## 下一步

1. 配合后端设计数据驱动治理的管理端入口。
2. 评估同步批次、人工复核、冲突处理和发布记录在 `cekaitech-admin` 的展示与操作边界。
