# Current Task

## 当前任务

- 名称：数据导入本地预检工作台
- OpenSpec 变更：无

## 当前状态

- 已完成未提交；最终质量检查已通过，等待提交并推送到 `master`。

## 已完成

- 数据导入页从纯占位升级为本地预检工作台。
- 支持选择本地 JSON 文件或粘贴 JSON 文本，读取过程只发生在浏览器内。
- 支持识别 `root[]`、`records[]`、`items[]`、`dataList[]`、`list[]`、`data[]` 等常见导出结构。
- 展示记录数量、字段数量、记录来源、顶层字段完整度和敏感字段提醒。
- 对 `sessionId`、Cookie、Authorization、token、原始 HTTP exchange、原始请求/响应头等字段给出不应上传提醒。
- 页面明确显示“仅本地预检，暂不上传”，当前不新增后端 API。
- 新增 Vitest 覆盖本地预检纯函数。
- 更新 `docs/变更日志.md`、`codex-decisions.md` 和 `codex-handoff.md`。

## 未完成

- 暂未接入真实上传。
- 暂未新增字段映射、导入批次、后端审计和入库流程。
- 暂未读取 crawler 进程或控制 crawler。

## 最近验证

- 基线：`npm.cmd run quality` 通过，8 个测试文件、21 个 Vitest 测试通过，TypeScript 与 Vite 构建通过；构建保留既有 Vite/Rollup warning。
- TDD 红灯：`npm.cmd run test -- --run src/pages/data-import/importPreflight.test.ts` 先因缺少 `importPreflight` 模块失败，补骨架后 3 个行为断言按预期失败。
- TDD 绿灯：`npm.cmd run test -- --run src/pages/data-import/importPreflight.test.ts` 通过，1 个测试文件、3 个测试通过。
- 页面构建：`npm.cmd run build` 通过，TypeScript 与 Vite 构建通过；构建保留既有 Vite/Rollup warning。
- 最终：`npm.cmd run quality` 通过，9 个测试文件、24 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Vite/Rollup warning 和 chunk size warning。

## 下一步

1. 提交并推送到 `master`。
2. 后续可设计导入字段映射、批次确认、后端 API 和审计记录。
