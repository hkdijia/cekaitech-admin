# Current Task

## 当前任务

- 名称：法律表单事件后台页面
- OpenSpec 变更：无

## 当前状态

- 已完成未提交；最终质量检查已通过，未 push。

## 已完成

- 新增 `src/api/legalFormEvents.ts`，通过 `POST /api/admin/legal/form-events/page` 查询法律表单事件分页数据。
- 分页契约按现有后台统一口径使用 `pageNo`、`pageSize`、`orderBy`、`order`、`appCode`、`formType`、`qualityStatus`、`keywords` 和 `dataList`、`totalCount`。
- 新增 `src/pages/legal-form-events/LegalFormEventsPage.vue`，提供关键词、表单类型、质量状态和小程序筛选。
- 页面展示分页表格、事件基础字段、质量状态标签、字段数量和 `payloadPreview` 预览列。
- 筛选选项按当前上报值配置：`private_lending`、`divorce_agreement`、`generic_template` 和 `valid/low_value`。
- 关键词提示只声明当前后端实际支持的客户端事件 ID、事件类型和 payload 内容。
- 主菜单和路由新增 `/legal-form-events`，权限码 `admin:legal-form-event:view`。
- 新增/扩展 Vitest 覆盖 API 契约和路由菜单入口。
- 更新 `docs/变更日志.md`。

## 未完成

- 后端 worker 尚需同步实现对应 `miniapp-backend` API。

## 最近验证

- TDD 红灯：`npm.cmd run test -- --run src/api/legalFormEvents.test.ts` 因缺少 `./legalFormEvents` 模块失败。
- TDD 红灯：`npm.cmd run test -- --run src/router/router.test.ts` 因缺少 `/legal-form-events` 菜单入口失败。
- TDD 绿灯：`npm.cmd run test -- --run src/api/legalFormEvents.test.ts` 通过，1 个测试通过。
- TDD 绿灯：`npm.cmd run test -- --run src/router/router.test.ts` 通过，5 个测试通过。
- 首次质量检查：`npm.cmd run quality` 测试通过，构建因 `??` 和 `||` 混用缺少括号失败。
- 最终质量检查：`npm.cmd run quality` 通过，10 个测试文件、26 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 下一步

1. 等待后端 worker 同步实现 `POST /api/admin/legal/form-events/page`。
2. 后端就绪后用具备 `admin:legal-form-event:view` 权限的账号联调 `/legal-form-events`。
