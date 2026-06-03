# Current Task

## 当前任务

- 名称：首页模块“展示更多”配置管理端支持
- OpenSpec 变更：无。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话上线收窄要求 / 首页“更多”按钮配置化
- 本地台账：无
- 当前状态：管理端定向、全量 quality 和空白检查已通过，待本地提交和用户手动推送。

## 当前状态

- 首页模块配置页新增 `showMoreEnabled` 维护。
- 模块列表展示“展示更多/全量展示”状态。
- 模块编辑弹窗新增“展示更多”开关。
- 入口/可见性/排序/图标/页面指向仍由后端和 admin 结构化配置控制，不下发任意前端代码。

## 最近验证

- [反馈编号：无] RED：管理端页面测试失败于缺少“全量展示”状态。
- [反馈编号：无] GREEN：`npm.cmd test -- --run src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/api/miniappHomeConfig.test.ts` 通过 7 项。
- [反馈编号：无] 全量 quality：`npm.cmd run quality` 通过，32 个测试文件、149 项 Vitest，类型检查和构建通过。
- [反馈编号：无] 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 已完成

- [反馈编号：LMA-FB-044] `LegalToolCenterPage.test.ts` 新增律师费参考 capability、exposure item 和 data source fixture。
- [反馈编号：LMA-FB-044] 测试覆盖标题、图标、目标路径、执行方式、风险等级和来源版本展示。

## 最近验证

- GREEN：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过，1 个测试文件、12 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、149 项 Vitest，类型检查和构建通过。
- 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 配合三仓全量验证、提交推送和企业微信终态回写。
