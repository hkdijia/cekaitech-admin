# Codex Handoff

## 当前状态

- 当前分支：`master`
- 当前 HEAD：以 Git log 为准。
- 当前阶段：LMA-FB-013 首页配置图标库选择器；功能入口编辑弹窗已接入受控开源图标库与真实图标预览，已完成全量质量验证，待提交。
- 最近完成：首页配置页的功能入口图标从自由输入 `iconKey` 升级为 `@element-plus/icons-vue` 开源图标库选择器；仍通过既有后端接口保存 `iconKey`，不改变数据结构。
- 未完成：提交。

## 关键文件

- `AGENTS.md`
- `docs/变更日志.md`
- `tasks/current-task.md`
- `codex-handoff.md`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.vue`
- `src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts`

## 关键命令

- `npm.cmd install`
- `npm.cmd run dev`
- `npm.cmd test`
- `npm.cmd run build`
- `npm.cmd run quality`
- `npm.cmd run admin:check`

## 最近验证

- RED（LMA-FB-013 图标库选择器）：`npm.cmd run test -- --run src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts` 失败于 `[data-test="home-icon-calculator"]` 真实图标预览节点缺失。
- GREEN（LMA-FB-013 图标库选择器）：`npm.cmd run test -- --run src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts` 通过，1 个测试文件、4 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，23 个测试文件、98 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- Diff 检查：`git diff --check` 仅提示 Windows 换行转换。

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录 `XRhKT7`
- 当前状态：已验证，待提交

## 注意事项

- 本仓是公司级管理后台，只通过 `miniapp-backend` 受控 API 管理业务数据，不直连数据库。
- 首页配置页调用 `POST /api/admin/miniapp-home-config/**`，路由 `/miniapp-home-config`，权限码 `admin:miniapp-home-config:view`；写操作按 `admin:miniapp-home-config:manage` 显示。
- 当前图标库是前端受控 allowlist，后台保存的仍是字符串 `iconKey`；后端仍负责路径、action/status/tone/fontWeight 等白名单和最终 403。
- 当前 icon catalog 尚未抽公共模块；下一轮若要让文书目录配置页、其他小程序配置页复用，应先抽 `src/pages/miniapp-home-config` 外的共享配置。
- 若新工作区缺少 `node_modules`，先执行 `npm.cmd ci` 按 `package-lock.json` 恢复依赖，再运行 `npm.cmd run quality`。

## 下一步建议

1. 提交 `feat: add home icon picker`，正文或 footer 写 `Refs: LMA-FB-013`。
2. 下一轮评估共享 icon catalog，并同步到文书目录配置页。
