# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 小程序工作台法律工具生命周期队列展示和法律工具中心状态流转首片已实现，并已发布到 `admin.cekaitech.cn`。
- 最近完成：新增 `/miniapp-workbench` 小程序工作台，切换到阳律通工作区后自动进入该工作台；页面调用 backend 工具完整性只读检查接口，按 `enabled/pending_release/blocked/paused/retired` 展示已上线、待发布、阻塞和人工暂缓队列。法律工具中心能力列表新增“状态”下拉，可调用 backend 窄接口人工调整生命周期；静态资源已同步到服务器。
- 未完成：启用前强制门禁、批量推进队列和状态变更审计尚未实现；如需线上可见，需要先部署 backend 新接口，再同步 admin 静态资源到服务器。

## 关键文件

- `src/api/legalToolCenter.ts`
- `src/api/legalToolCenter.test.ts`
- `src/pages/legal-tool-center/LegalToolCenterPage.vue`
- `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`
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
- `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts`
- `npm.cmd run quality`
- `git diff --check`
- `git status -sb`

## 最近验证

- [反馈编号：无] 法律工具状态流转：新增 `updateLegalToolCapabilityStatus` API 封装和能力列表“状态”下拉，调整状态时只提交 `status/ownerNote`；定向 `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 通过 2 个测试文件、24 项。
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
- 当前状态：小程序工作台法律工具生命周期队列展示和状态流转首片已实现并发布到生产测试环境，待用户体验复核

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- 线上要看到小程序工作台完整可用，需要 backend 先上线包含 `/legal-tool-center/readiness/inspect` 的新镜像，否则 admin 静态页面会请求到 404。

## 下一步建议

1. 运行 `npm.cmd run quality` 和 `git diff --check` 后本地提交，等待用户手动推送。
2. 如用户需要线上可见，先部署 backend 新镜像，再执行 admin 静态资源部署脚本并 smoke。
3. 下一轮可继续做启用前强制门禁、批量推进队列或状态变更审计。
