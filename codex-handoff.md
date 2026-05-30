# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：以 Git log 为准。
- 当前阶段：LMA-FB-013 小程序配置统一图标库能力；共享 icon catalog、共享选择器、首页配置页复用和文书目录配置页复用已完成定向测试与全量质量验证，待提交。
- 最近完成：将首页配置页内的局部图标候选抽到 `src/miniapp-icons/miniappIconCatalog.ts`，新增 `MiniappIconPicker`，并接入首页配置页和文书目录配置页。
- 未完成：提交。

## 关键文件

- `AGENTS.md`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`
- `src/miniapp-icons/miniappIconCatalog.ts`
- `src/miniapp-icons/miniappIconCatalog.test.ts`
- `src/components/miniapp-icon-picker/MiniappIconPicker.vue`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.vue`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts`
- `src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.vue`
- `src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts`

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`
- `npm.cmd run admin:check`

## 最近验证

- RED（LMA-FB-013 统一图标库）：`npm.cmd run test -- --run src/miniapp-icons/miniappIconCatalog.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts` 失败于共享 catalog 文件缺失、文书目录页缺少“统一开源图标库”。
- GREEN（LMA-FB-013 统一图标库）：`npm.cmd run test -- --run src/miniapp-icons/miniappIconCatalog.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts` 通过，3 个测试文件、10 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，24 个测试文件、100 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- Diff 检查：`git diff --check` 仅提示 Windows 换行转换。

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录 `XRhKT7`
- 当前状态：已验证，待提交

## 注意事项

- 本仓是公司级管理后台，只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 当前统一图标库仍是前端受控 allowlist，后台保存的仍是字符串 `iconKey`。
- 后端仍负责路径、action/status/tone/fontWeight 等白名单和最终 403。
- 共享选择器是后台配置体验，不代表小程序运行时直接使用 Element Plus 图标；小程序端仍应把后端 `iconKey` 映射到本地主包受控图标资产。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。

## 下一步建议

1. 提交，正文或 footer 写 `Refs: LMA-FB-013`。
