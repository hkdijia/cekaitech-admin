# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：页面菜单管理支持通用功能入口已发布生产测试环境。
- 最近完成：admin 可展示和编辑 backend 返回的 `miniapp_module` / `miniapp_feature` 节点，支持保存“服务请求”等通用入口；静态资源已发布到 `admin.cekaitech.cn`。
- 未完成：用户推送部署记录提交和线上页面验收。

## 关键文件

- `src/pages/miniapp-orchestration/MiniappOrchestrationPage.vue`
- `src/pages/miniapp-orchestration/MiniappOrchestrationPage.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- 定向测试：`npm.cmd test -- MiniappOrchestrationPage.test.ts miniappOrchestration.test.ts`
- 构建：`npm.cmd run build`
- 质量检查：`npm.cmd run quality`
- 空白检查：`git diff --check`
- 生产静态发布：`powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1`

## 最近验证

- [反馈编号：无] 通用功能入口编辑：`npm.cmd test -- MiniappOrchestrationPage.test.ts miniappOrchestration.test.ts` 通过 13 项。
- [反馈编号：无] 构建：`npm.cmd run build` 通过，保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- [反馈编号：无] 发布：`scripts\deploy-admin-static.ps1` 通过，上线资源包含 `MiniappOrchestrationPage-D-fbfYLo.js`；Basic Auth 和未登录后台接口均返回 401；active dist 包含 `miniapp_feature` 和“通用功能入口”。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 多小程序 `app-tab-module-feature` 数据模型讨论
- 本地台账：无
- 当前状态：已部署，待推送部署记录

## 注意事项

- 本仓不直连数据库，只通过 `miniapp-backend` 编排接口读写。
- 后端 V142 部署前，线上 admin 无法读到生产库的通用编排节点。
- 用户偏好：Codex 可本地提交，远程 GitHub 推送由用户执行。

## 下一步建议

1. 用户推送本次部署记录提交。
2. 线上验收“小程序编排 / 页面菜单管理”可维护“我的”页入口。
