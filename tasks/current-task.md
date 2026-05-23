# Current Task

## 当前任务

- 名称：生成记录后台生成记录页面联调缺口
- OpenSpec 变更：无

## 当前状态

- 已补充生成记录页组件交互测试，并完成查询参数归一化；本轮最终质量检查已通过。

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
- 新增 `src/pages/generation-records/GenerationRecordsPage.test.ts`，mock `../../api/generationRecords` 覆盖初始加载、列表字段渲染、筛选查询、重置和非法用户 ID。
- `GenerationRecordsPage.vue` 查询参数归一化：空关键词、小程序、状态和记录类型传 `undefined`；用户 ID 仅正整数传给后端。
- 生成记录类型筛选和展示补齐法律助手实际 `caseType`：`divorce`、`labor`、`contract`、`tort`，避免通用模板云端记录只能显示原始枚举。

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
- 本轮 TDD 红灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts` 失败，初始加载/重置仍传空字符串，非数字用户 ID 传出 `NaN`。
- 本轮 TDD 绿灯：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts` 通过，5 个测试通过。
- 本轮最终定向验证：`npm.cmd run test -- --run src/pages/generation-records/GenerationRecordsPage.test.ts` 通过，1 个测试文件、5 个 Vitest 测试通过。
- 本轮最终质量检查：`npm.cmd run quality` 通过，13 个测试文件、36 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup 注释 warning 和 chunk size warning。
- 补充 TDD 红灯：`npm.cmd run test -- --run src/pages/generation-records/generationRecordOptions.test.ts` 失败，后台缺少 `divorce/labor/contract/tort` 记录类型选项。
- 补充 TDD 绿灯：`npm.cmd run test -- --run src/pages/generation-records/generationRecordOptions.test.ts` 通过，3 个测试通过。

## 下一步

1. 用具备 `admin:generation-record:view` 权限的账号联调 `/generation-records`。
