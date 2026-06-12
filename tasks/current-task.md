# Current Task

## 当前任务

- 名称：小程序页面菜单统一承载上线生命周期
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / admin 菜单与工具能力状态割裂讨论
- 本地台账：无
- 当前状态：已完成本地实现与验证，待本地提交后由用户推送。

## 当前状态

- 页面菜单管理是小程序入口上线生命周期的唯一配置入口。
- 功能节点生命周期选项为 `published/pending_release/paused/retired`，并兼容旧响应值。
- 法律工具中心能力库不再展示能力状态列、启用状态列和生命周期下拉；能力页只维护能力元数据。
- 入口是否在小程序前台可见由 backend 按菜单入口 `published` 过滤。

## 已完成

- [反馈编号：无] 页面菜单管理表单从“业务状态”改为“生命周期”。
- [反馈编号：无] 页面菜单保存默认状态改为 `published/已上线`，并将旧 `open/coming_soon/consultation/locked/disabled` 映射到新生命周期。
- [反馈编号：无] 法律工具中心能力库移除发布生命周期操作，避免与页面菜单管理割裂。
- [反馈编号：无] 补充页面菜单生命周期和能力页不暴露发布操作的测试。

## 未完成

- 起诉文书生成模块的多结果模板配置尚未开始：当前 admin 尚未支撑同一模块下多模板启停和配置管理。
- 本轮未发布 admin 静态资源到服务器。

## 最近验证

- 通过：`npm.cmd run test -- --run src/api/miniappOrchestration.test.ts src/pages/miniapp-orchestration/MiniappOrchestrationPage.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts`，4 个测试文件、35 项通过。
- 通过：`npm.cmd run quality`，35 个测试文件、168 项测试通过，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- 通过：`git diff --check`。

## 下一步

1. 提交并由用户推送本轮 admin 变更。
2. 下一轮进入“起诉文书生成多模板配置”工作流，先梳理 `民间借贷纠纷/离婚纠纷/劳动争议` 的模板、目录、启用状态和 admin 配置界面。
