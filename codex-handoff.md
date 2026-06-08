# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：admin 试运行上线前加固已验证，待本地提交。
- 最近完成：补齐 `admin.cekaitech.cn` Basic Auth、生产管理员改密、生产 API 域名、平台后台/工作区隔离的上线前 runbook；前端增加平台后台文案和试运行提醒；测试锁定全局工作区不加载具体小程序菜单。
- 未完成：本地提交、用户手动推送。

## 关键文件

- `docs/production-runbook.md`
- `src/layouts/AdminLayout.vue`
- `src/pages/dashboard/DashboardPage.vue`
- `src/router/menu.ts`
- `src/stores/workspace.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`

## 关键命令

- `npm.cmd run test -- --run src/stores/workspace.test.ts`
- `npm.cmd run quality`
- `git diff --check`
- `git status -sb`

## 最近验证

- [反馈编号：无] 定向：`npm.cmd run test -- --run src/stores/workspace.test.ts` 通过，1 个测试文件、5 项 Vitest。
- [反馈编号：无] 全量：`npm.cmd run quality` 通过，32 个测试文件、152 项 Vitest，类型检查和生产构建通过。
- [反馈编号：无] 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 admin/backend 试运行上线讨论
- 本地台账：无
- 当前状态：已验证，待本地提交

## 注意事项

- 本仓不直连数据库，不控制 crawler 进程，只通过 `miniapp-backend` 受控 API 管理结构化数据。
- `.runtime-logs/` 是本地运行日志噪声，不纳入提交。
- 用户当前偏好：本地提交可由 Codex 完成，GitHub 远程推送由用户通过 GitHub Desktop 手动执行。
- Basic Auth 是服务器配置，本轮只写 runbook，不声称服务器已完成配置。

## 下一步建议

1. 本地提交后等待用户手动推送。
