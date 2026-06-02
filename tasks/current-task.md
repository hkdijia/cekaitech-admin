# Current Task

## 当前任务

- 名称：LMA-FB-044 律师费参考首片管理端覆盖
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-044`
- 来源文档：当前会话竞品对标延续 / 121 法律助手能力吸收
- 本地台账：`C:/home/work_space/myself/miniapp/lawsuit-material-assistant/docs/product-feedback.md`
- 当前状态：管理端全量 quality 通过，待提交推送和企业微信终态回写。

## 当前状态

- 管理端不新增独立律师费规则页。
- 法律工具中心测试样本覆盖 `lawyer_fee_reference` 能力、曝光入口和来源元数据。
- 入口/排序/可见性/图标/页面指向继续由后端和 admin 控制。

## 已完成

- [反馈编号：LMA-FB-044] `LegalToolCenterPage.test.ts` 新增律师费参考 capability、exposure item 和 data source fixture。
- [反馈编号：LMA-FB-044] 测试覆盖标题、图标、目标路径、执行方式、风险等级和来源版本展示。

## 最近验证

- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，1 个测试文件、12 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、149 项 Vitest，类型检查和构建通过。
- 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 配合三仓全量验证、提交推送和企业微信终态回写。
