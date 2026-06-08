# Current Task

## 当前任务

- 名称：admin 试运行上线前加固
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 admin/backend 试运行上线讨论
- 本地台账：无
- 当前状态：已验证，待本地提交。

## 当前状态

- admin 试运行上线前必做项已收敛到文档和前端轻量提醒。
- 管理后台定位明确为公司级平台后台，具体小程序能力通过工作区菜单隔离。
- 本仓继续只通过 `miniapp-backend` 受控 API 管理数据，不直连数据库，不控制 crawler。

## 已完成

- `docs/production-runbook.md` 补齐 Nginx Basic Auth、生产管理员改密、生产 API 域名、平台后台/工作区隔离的试运行前硬门槛。
- 后台布局文案从“管理后台”收敛为“平台管理后台”。
- 首页改为“平台工作台”，增加试运行上线前提醒。
- 工作区 store 测试补充全局后台不加载具体小程序菜单的隔离断言。

## 未完成

- 本地提交后由用户通过 GitHub Desktop 推送。

## 最近验证

- 定向：`npm.cmd run test -- --run src/stores/workspace.test.ts` 通过，1 个测试文件、5 项 Vitest。
- 全量：`npm.cmd run quality` 通过，32 个测试文件、152 项 Vitest，类型检查和生产构建通过。
- 空白检查：`git diff --check` 无空白错误，仅 Windows 换行提示。

## 下一步

1. 本地提交，等待用户通过 GitHub Desktop 推送。
