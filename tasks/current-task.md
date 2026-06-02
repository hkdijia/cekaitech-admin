# Current Task

## 当前任务

- 名称：LMA-FB-043 仲裁费用参考首片管理端覆盖
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-043`
- 来源文档：当前会话竞品对标延续 / 121 法律助手能力吸收
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：已验证（管理端定向和全量 quality 通过，已推送已回写）。

## 当前状态

- 管理端不新增独立仲裁费用规则页。
- 法律工具中心测试样本覆盖 `arbitration_fee` 能力、曝光入口和来源元数据。
- 入口/排序/可见性/图标/页面指向继续由后端和 admin 控制。

## 已完成

- [反馈编号：LMA-FB-043] `LegalToolCenterPage.test.ts` 新增仲裁费用 capability、exposure item 和 data source fixture。
- [反馈编号：LMA-FB-043] 测试覆盖标题、图标、目标路径、执行方式、风险等级和来源版本展示。
- [反馈编号：LMA-FB-043] 提交 `e8afd46 test: cover arbitration fee legal tool` 已推送 GitHub，并配合小程序总台账回写企业微信智能表格 `oRvzFj`。

## 最近验证

- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，1 个测试文件、12 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、149 项 Vitest，类型检查和构建通过。
- 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 等待下一项 121 高频工具吸收任务。
