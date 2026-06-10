# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 小程序工作台首片已实现，待最终质量检查、本地提交和用户推送。
- 最近完成：新增 `/miniapp-workbench` 小程序工作台，切换到阳律通工作区后自动进入该工作台；页面调用 backend 工具完整性只读检查接口，展示工具总数、可启用候选、需复核、阻塞和逐工具问题。
- 未完成：工具下架/恢复、启用前强制门禁尚未实现；如需线上可见，需要先部署 backend 新接口，再同步 admin 静态资源到服务器。

## 关键文件

- `src/api/legalToolCenter.ts`
- `src/api/legalToolCenter.test.ts`
- `src/router/menu.ts`
- `src/router/index.ts`
- `src/router/router.test.ts`
- `src/layouts/AdminLayout.vue`
- `src/layouts/AdminLayout.test.ts`
- `src/pages/miniapp-workbench/MiniappWorkbenchPage.vue`
- `src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/layouts/AdminLayout.test.ts src/api/legalToolCenter.test.ts src/router/router.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `npm.cmd run quality`
- `git diff --check`
- `git status -sb`

## 最近验证

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
- 当前状态：小程序工作台首片已实现，待最终质量检查

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- 线上要看到小程序工作台完整可用，需要 backend 先上线包含 `/legal-tool-center/readiness/inspect` 的新镜像，否则 admin 静态页面会请求到 404。

## 下一步建议

1. 运行 `npm.cmd run quality` 和 `git diff --check` 后本地提交，等待用户手动推送。
2. 如用户需要线上可见，先部署 backend 新镜像，再执行 admin 静态资源部署脚本并 smoke。
3. 下一轮可继续做工具下架/恢复或启用前强制门禁。
