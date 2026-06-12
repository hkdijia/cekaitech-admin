# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 已完成“起诉文书生成多结果模板配置首片”线上发布；本轮“离婚纠纷结果模板配置首片”已发布到 `admin.cekaitech.cn` 并完成 smoke。
- 最近完成：结果模板配置页支持在 backend 返回 `divorce.templateSupported=true` 时加载离婚模板编辑器，并以离婚样例数据预览；上线资源为 `PrivateLendingResultTemplatePage-CfdkUiv5.js`。
- 未完成：`labor` 仍没有真实生成 schema 和模板，页面只显示“暂无生成配置”；离婚纠纷前台入口尚未发布；启用前强制门禁、批量推进队列和状态变更审计尚未实现。

## 关键文件

- `src/api/legalToolCenter.ts`
- `src/api/legalToolCenter.test.ts`
- `src/pages/legal-tool-center/LegalToolCenterPage.vue`
- `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`
- `src/pages/miniapp-orchestration/MiniappOrchestrationPage.vue`
- `src/pages/miniapp-orchestration/MiniappOrchestrationPage.test.ts`
- `src/router/menu.ts`
- `src/router/index.ts`
- `src/router/router.test.ts`
- `src/layouts/AdminLayout.vue`
- `src/layouts/AdminLayout.test.ts`
- `src/pages/miniapp-workbench/MiniappWorkbenchPage.vue`
- `src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `src/api/privateLendingResultTemplate.ts`
- `src/api/privateLendingResultTemplate.test.ts`
- `src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.vue`
- `src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts`
- `src/router/menu.ts`
- `src/router/router.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/layouts/AdminLayout.test.ts src/api/legalToolCenter.test.ts src/router/router.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `npm.cmd run quality`
- `npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts`
- `git diff --check`
- `git status -sb`

## 最近验证

- [反馈编号：无] 离婚纠纷结果模板配置首片：RED 阶段切换 `divorce` 后预览仍提交民间借贷样例字段；GREEN 后 `npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 通过 2 个测试文件、6 项。
- [反馈编号：无] 离婚纠纷结果模板配置首片收口：`npm.cmd run quality` 通过 35 个测试文件、169 项并完成生产构建；`git diff --check` 通过，仅有 Windows 换行提示。
- [反馈编号：无] 离婚纠纷结果模板配置发布：`scripts/deploy-admin-static.ps1` 构建并同步到 `/data/cekaitech-admin/`，上线资源包含 `PrivateLendingResultTemplatePage-CfdkUiv5.js`；服务器静态文件确认包含 `divorce/plaintiffName` 样例字段，公网 smoke 通过。
- [反馈编号：无] 起诉文书生成多模板配置首片：RED 阶段 API 函数、案件选择方法和菜单描述测试失败；GREEN 后 `npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts` 通过 3 个测试文件、26 项。
- [反馈编号：无] 起诉文书生成多模板配置 admin 发布：`scripts/deploy-admin-static.ps1` 构建并同步到 `/data/cekaitech-admin/`，上线资源包含 `PrivateLendingResultTemplatePage-CKOHrQyy.js`；服务器静态文件确认包含 `/api/admin/case-result-template` 和“结果模板配置”文案，公网 smoke 通过。
- [反馈编号：无] 页面菜单生命周期归口：`npm.cmd run test -- --run src/api/miniappOrchestration.test.ts src/pages/miniapp-orchestration/MiniappOrchestrationPage.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/api/legalToolCenter.test.ts` 通过 4 个测试文件、35 项；`npm.cmd run quality` 通过 35 个测试文件、168 项并完成构建；`git diff --check` 通过。
- [反馈编号：无] 历史状态流转首片曾在能力列表加入“状态”下拉；本轮产品口径已调整为页面菜单承载入口生命周期，能力列表状态下拉已撤销。
- [反馈编号：无] admin 静态资源发布：`scripts/deploy-admin-static.ps1` 构建并同步到 `/data/cekaitech-admin/`，上线资源包含 `LegalToolCenterPage-BsUFdRjP.js` 和 `MiniappWorkbenchPage-VNEwOTtl.js`；公网 smoke 确认 Basic Auth 和 API 未登录鉴权正常。
- [反馈编号：无] 法律工具生命周期展示：工作台摘要改为“已上线/待发布队列/阻塞/人工暂缓”，能力状态选项改为 `enabled/pending_release/blocked/paused/retired`，新增能力默认 `pending_release`；定向测试通过 3 个文件 26 项，`npm.cmd run quality` 通过 35 个文件 167 项并完成构建。
- [反馈编号：无] API RED：`legalToolCenter.test.ts` 失败于 `inspectLegalToolReadiness is not a function`。
- [反馈编号：无] 路由 RED：`router.test.ts` 失败于缺少 `/miniapp-workbench` 菜单和路由。
- [反馈编号：无] 页面 RED：`MiniappWorkbenchPage.test.ts` 失败于页面文件不存在。
- [反馈编号：无] 布局 RED：`AdminLayout.test.ts` 失败于切换业务工作区后未跳转小程序工作台。
- [反馈编号：无] 定向 GREEN：`npm.cmd run test -- --run src/layouts/AdminLayout.test.ts src/api/legalToolCenter.test.ts src/router/router.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts` 通过，4 个测试文件、32 项 Vitest。
- [反馈编号：无] 质量检查：`npm.cmd run quality` 通过，35 个测试文件、165 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和大 chunk warning。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / admin 功能扩张讨论
- 本地台账：无
- 当前状态：小程序工作台法律工具生命周期队列已发布到生产测试环境；页面菜单统一承载入口上线生命周期已完成；起诉文书生成多结果模板配置首片已部署生产测试环境；离婚纠纷结果模板配置首片已完成本地验证，待提交/发布

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- 线上已部署本轮结果模板配置；如页面未刷新，优先清缓存或无痕窗口访问 `admin.cekaitech.cn`。

## 下一步建议

1. 完成本轮 admin quality、提交和静态资源发布后，线上验收“结果模板配置”：民间借贷和离婚可编辑预览，劳动显示“暂无生成配置”。
2. 后续梳理 `劳动争议` 的真实生成 schema、模板占位符、表单字段和入口启用门禁。
