# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前阶段：LMA-FB-018 法律工具中心管理页已完成定向汇总、全量质量和 diff 检查，等待提交、推送和企业微信回写。
- 最近完成：新增 `/legal-tool-center` 菜单、API 封装、三分区管理页和共享图标选择器接入。
- 未完成：提交推送、智能表格回写。

## 关键文件

- `src/api/legalToolCenter.ts`
- `src/api/legalToolCenter.test.ts`
- `src/pages/legal-tool-center/LegalToolCenterPage.vue`
- `src/pages/legal-tool-center/LegalToolCenterPage.test.ts`
- `src/router/menu.ts`
- `src/router/index.ts`
- `src/router/router.test.ts`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-decisions.md`
- `docs/superpowers/plans/2026-05-30-legal-tool-center-admin.md`

## 关键命令

- `npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/router/router.test.ts`
- `npm.cmd run quality`
- `git diff --check`

## 最近验证

- [反馈编号：LMA-FB-018] API RED：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts` 失败于 `./legalToolCenter` 模块缺失。
- [反馈编号：LMA-FB-018] API GREEN：同一命令通过，1 个测试文件、3 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 页面 RED：`npm.cmd run test -- --run src/pages/legal-tool-center/LegalToolCenterPage.test.ts` 失败于 `LegalToolCenterPage.vue` 缺失。
- [反馈编号：LMA-FB-018] 页面 GREEN：同一命令通过，1 个测试文件、6 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 路由 RED：`npm.cmd run test -- --run src/router/router.test.ts` 失败于 `/legal-tool-center` 菜单和路由缺失。
- [反馈编号：LMA-FB-018] 路由 GREEN：同一命令通过，1 个测试文件、14 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 定向汇总：`npm.cmd run test -- --run src/api/legalToolCenter.test.ts src/pages/legal-tool-center/LegalToolCenterPage.test.ts src/router/router.test.ts` 通过，3 个测试文件、23 个 Vitest 测试通过。
- [反馈编号：LMA-FB-018] 全量：`npm.cmd run quality` 通过，28 个测试文件、116 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- [反馈编号：LMA-FB-018] Diff 检查：`git diff --check` 通过，仅提示 Windows 换行转换 warning。

## 追溯信息

- 反馈编号：`LMA-FB-018`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`HaYpcv`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（等待提交、推送和回写）

## 注意事项

- 本仓是公司级管理后台，只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 法律工具中心页面只编辑结构化字段，不支持任意 WXML/HTML/CSS/JS。
- 后端当前只提供能力库 `page/save`，不提供能力库禁用接口；管理端仅对展示分组和曝光入口提供禁用按钮。
- 保存 payload 已显式构造，避免把 `createdAt/updatedAt` 等后端审计字段回传。

## 下一步建议

1. 提交：`feat: add legal tool center admin page`，footer 写 `Refs: LMA-FB-018`。
2. 推送后回写企业微信智能表格 record_id=`HaYpcv`，记录管理端 commit、验证结果和推送状态。
