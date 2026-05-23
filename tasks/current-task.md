# Current Task

## 当前任务

- 名称：生成记录后台管理页
- OpenSpec 变更：无

## 当前状态

- 生成记录后台管理页已完成，最终质量检查已通过；提交号以 Git log 和本轮最终同步为准。

## 已完成

- 确认上一轮“法律表单事件后台页面”已经提交并推送，当前 HEAD 为 `8de89c0 feat: add legal form events page`。
- 新增 `src/api/generationRecords.ts`，通过 `POST /api/admin/generation-records/page` 查询生成记录分页数据。
- 分页契约使用 `pageNo`、`pageSize`、`appCode`、`userId`、`status`、`recordType`、`keywords`、`orderBy`、`order` 和 `dataList`、`totalCount`。
- 新增 `src/pages/generation-records/GenerationRecordsPage.vue`，提供关键词、用户 ID、状态、记录类型和小程序筛选。
- 状态选项按后端契约修正为 `draft`（待填写/草稿）、`generated`（已生成）、`expired`（已过期），不再使用 `processing/success/failed`。
- 记录类型选项按小程序本机 `caseType` 口径修正，覆盖 `private_lending`、`divorce_agreement`、`generic_template`、`contract_template`，未知值兜底显示原值。
- 新增 `src/pages/generation-records/generationRecordOptions.ts` 和 `generationRecordOptions.test.ts`，覆盖生成记录状态、tag 类型和记录类型展示映射。
- 页面展示用户 ID、身份 ID、小程序、客户端记录 ID、标题、类型、状态、摘要、创建时间和更新时间。
- 主菜单和路由新增 `/generation-records`，权限码 `admin:generation-record:view`。
- 新增/扩展 Vitest 覆盖 API 契约和路由菜单入口。
- 更新 `docs/变更日志.md` 和 `codex-handoff.md`。

## 未完成

- 后续需用具备 `admin:generation-record:view` 权限的账号做本地联调。

## 最近验证

- TDD 红灯：`npm.cmd run test -- --run src/api/generationRecords.test.ts` 因缺少 `./generationRecords` 模块失败。
- TDD 红灯：`npm.cmd run test -- --run src/router/router.test.ts` 因缺少 `/generation-records` 菜单入口失败。
- TDD 绿灯：`npm.cmd run test -- --run src/api/generationRecords.test.ts` 通过，1 个测试通过。
- TDD 绿灯：`npm.cmd run test -- --run src/router/router.test.ts` 通过，6 个测试通过。
- 返工 TDD 红灯：`npm.cmd run test -- --run src/pages/generation-records/generationRecordOptions.test.ts` 因缺少 `./generationRecordOptions` 模块失败。
- 返工 TDD 绿灯：`npm.cmd run test -- --run src/pages/generation-records/generationRecordOptions.test.ts` 通过，3 个测试通过。
- 返工定向绿灯：`npm.cmd run test -- --run src/api/generationRecords.test.ts` 通过，1 个测试通过。
- 最终质量检查：`npm.cmd run quality` 通过，12 个测试文件、31 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。

## 下一步

1. 用具备 `admin:generation-record:view` 权限的账号联调 `/generation-records`。
