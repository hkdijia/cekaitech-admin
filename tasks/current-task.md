# Current Task

## 当前任务

- 名称：小程序工作台与工具完整性摘要
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / admin 功能扩张讨论
- 本地台账：无
- 当前状态：admin 小程序工作台首片已实现，待最终质量检查、提交和用户推送。

## 当前状态

- 登录后默认仍为全局后台。
- 切换到阳律通工作区后，admin 会进入新的 `/miniapp-workbench` 小程序工作台。
- 工作台通过 `miniapp-backend` 受控 API 读取工具完整性摘要，不直连数据库，不写生产数据。

## 已完成

- [反馈编号：无] 新增 `inspectLegalToolReadiness` API 封装，对接 `POST /api/admin/legal-tool-center/readiness/inspect`。
- [反馈编号：无] 新增“小程序工作台”菜单和 `/miniapp-workbench` 路由，限定阳律通工作区展示。
- [反馈编号：无] 新增 `MiniappWorkbenchPage`，展示工具总数、可启用候选、需复核、阻塞数量，以及逐工具完整性问题。
- [反馈编号：无] `AdminLayout` 工作区切换行为调整：切到业务小程序进入小程序工作台，切回全局进入平台工作台。

## 未完成

- 工具下架/恢复和启用前强制门禁尚未实现。
- 本轮未部署 admin 静态资源；线上可见需要先部署 backend 新接口，再部署 admin。

## 最近验证

- RED：`legalToolCenter.test.ts` 失败于 `inspectLegalToolReadiness is not a function`。
- RED：`router.test.ts` 失败于缺少 `/miniapp-workbench` 菜单和路由。
- RED：`MiniappWorkbenchPage.test.ts` 失败于页面文件不存在。
- RED：`AdminLayout.test.ts` 失败于切换业务工作区后未跳转小程序工作台。
- GREEN：`npm.cmd run test -- --run src/layouts/AdminLayout.test.ts src/api/legalToolCenter.test.ts src/router/router.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts` 通过，4 个测试文件、32 项 Vitest。
- 质量检查：`npm.cmd run quality` 通过，35 个测试文件、165 项 Vitest，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和大 chunk warning。

## 下一步

1. 运行 admin `npm.cmd run quality`。
2. 本地提交后由用户推送。
3. 如需线上可见，先部署 backend 新镜像，再发布 admin 静态资源。
