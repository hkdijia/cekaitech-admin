# Current Task

## 当前任务

- 名称：页面菜单管理、首页配置和共享图标库治理
- OpenSpec 变更：无；当前为现场治理和配置体验收口。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：无
- 来源文档：当前会话现场梳理
- 本地台账：无
- 当前状态：实施中（待提交、验证、推送）

## 当前状态

- 管理端页面菜单管理改为业务人员可理解的 `Tab / 模块 / 功能` 层级，支持搜索、展开收起、停用项开关和本地账号页只读节点。
- 首页配置补充 `visibleLimit` 展示数量字段。
- 共享图标选择器扩展为 50+ 受控语义图标并支持搜索，首页配置、页面菜单管理和法律工具中心复用。
- 管理端继续只通过 `miniapp-backend` 受控 API 管理结构化字段，不直连数据库，不下发任意 WXML/HTML/CSS/JS。

## 已完成

- [反馈编号：无] 页面菜单管理新增树内搜索、展开收起、显示停用项和功能编辑体验优化。
- [反馈编号：无] 页面菜单管理适配 `profile_local_feature` 账号页本地功能只读展示。
- [反馈编号：无] 首页配置新增 `visibleLimit` 字段展示和编辑。
- [反馈编号：无] 共享图标选择器扩展 50+ 受控图标，补充法律、风险、材料和账号场景 key。

## 未完成

- [反馈编号：无] 提交、最终验证和推送。

## 最近验证

- RED：`npm.cmd test -- LegalToolCenterPage.test.ts` 失败于页面缺少“延迟退休年龄”。
- GREEN：`npm.cmd test -- LegalToolCenterPage.test.ts` 通过，1 个测试文件、10 项 Vitest。
- 全量质量：`npm.cmd run quality` 通过，32 个测试文件、141 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；仅保留既有 Rollup PURE 注释和 chunk size warning。
- 本轮页面菜单/图标库治理最终验证待执行。

## 下一步

1. 按显式文件列表提交本轮治理改动，提交正文包含 `Refs: none`。
2. 运行 `npm.cmd run quality` 和 `git diff --check`。
