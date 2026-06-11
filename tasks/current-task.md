# Current Task

## 当前任务

- 名称：法律工具生命周期状态流转首片
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / admin 功能扩张讨论
- 本地台账：无
- 当前状态：已实现，待最终验证、提交和用户推送。

## 当前状态

- 登录后默认仍为全局后台。
- 切换到阳律通工作区后进入 `/miniapp-workbench` 小程序工作台。
- 工作台通过 `miniapp-backend` 受控 API 读取工具生命周期与完整性摘要，不直连数据库，不写生产数据。
- 生命周期口径为 `enabled/pending_release/blocked/paused/retired`，其中待发布和人工暂缓不会在小程序前台可见。
- 法律工具中心能力列表支持通过“状态”下拉人工调整生命周期，调用 backend 窄接口，只提交 `status/ownerNote`。

## 已完成

- [反馈编号：无] `LegalToolReadinessInspectResult` 类型补充已上线、待发布、阻塞状态、人工暂缓和已下架计数字段。
- [反馈编号：无] 小程序工作台摘要卡片改为展示“已上线、待发布队列、阻塞、人工暂缓”。
- [反馈编号：无] 列表新增生命周期列，并适配 `live/deferred/pass/warning/blocked` 展示文案。
- [反馈编号：无] 法律工具中心能力状态选项改为“已上线、待发布、阻塞、人工暂缓、已下架”，默认新增能力为待发布。
- [反馈编号：无] 新增 `updateLegalToolCapabilityStatus` API 封装和页面状态下拉操作，支持人工上线、回到待发布、标记阻塞、人工暂缓和下架。

## 未完成

- 启用前强制门禁、批量推进工作流和状态变更审计尚未实现。
- 本轮未部署 admin 静态资源；线上可见需要先部署 backend 新接口，再部署 admin。

## 最近验证

- 通过：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/miniapp-workbench/MiniappWorkbenchPage.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts`，3 个测试文件、26 项测试通过。
- 通过：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts`，2 个测试文件、24 项测试通过。
- 通过：`npm.cmd run quality`，35 个测试文件、167 项测试通过，`vue-tsc --noEmit` 和 `vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。`git diff --check` 待复跑。

## 下一步

1. 运行 admin 定向测试和空白检查。
2. 与 backend 生命周期改动一起本地提交。
3. 用户推送后，如需线上可见，先部署 backend 新镜像，再发布 admin 静态资源。
