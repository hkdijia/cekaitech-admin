# Current Task

## 当前任务

- 名称：生成记录和法律表单事件 userId 跨页排查入口
- OpenSpec 变更：无
- 当前 HEAD：以 Git log 为准

## 当前状态

- 已完成；提交和推送状态以当前 Git log 与远程分支为准。

## 已完成

- 完成代码分析：生成记录页、法律表单事件页已有用户 ID 展示和本页用户 ID 筛选；用户管理 API 当前只支持 `keywords/status/appCode`，没有 `userId` 精确筛选字段，不能假造后端契约。
- `src/pages/generation-records/GenerationRecordsPage.vue` 用户 ID 列新增“查看用户”动作，跳转 `/users?userId=...`。
- `src/pages/legal-form-events/LegalFormEventsPage.vue` 用户 ID 列新增“查看用户”动作，跳转 `/users?userId=...`。
- `src/pages/users/UsersPage.vue` 读取合法正整数 `userId` query，填入现有 `keywords` 查询用户列表，并展示“关键词排查”提示，明确这是排查入口而非精确筛选。
- 扩展 `src/pages/generation-records/GenerationRecordsPage.test.ts` 和 `src/pages/legal-form-events/LegalFormEventsPage.test.ts`，新增 `src/pages/users/UsersPage.test.ts`，覆盖跨页跳转和 query 初始化。
- 更新 `docs/变更日志.md`、`codex-handoff.md` 和本文件。

## 未完成

- 需后续用真实后端数据确认用户列表 `keywords` 是否能命中纯数字用户 ID；若后端后续提供精确筛选字段，再按真实契约调整。

## 最近验证

- TDD 红灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts` 失败，生成记录页/法律表单事件页缺少“查看用户”跳转，用户管理页未把 `userId` query 填入关键词。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts` 通过，3 个测试文件、11 个 Vitest 测试通过；追加 `UsersPage` query 边界后，同范围定向验证通过，3 个测试文件、18 个 Vitest 测试通过。
- 相关定向验证：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts src/pages/legal-form-events/LegalFormEventsPage.test.ts src/pages/users/UsersPage.test.ts src/router/router.test.ts src/api/adminUsers.test.ts` 通过，5 个测试文件、23 个 Vitest 测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，15 个测试文件、51 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 下一步

1. 用真实数据联调 `/users?userId=...` 的关键词排查命中效果。
