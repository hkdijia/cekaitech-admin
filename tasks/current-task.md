# Current Task

## 当前任务

- 名称：LMA-FB-016 民间借贷结果模板配置页
- OpenSpec 变更：无；延续 `lawsuit-material-assistant/openspec/changes/backend-private-lending-form-schema` 后续切片。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-016`
- 来源文档：当前会话规划 / LMA 智能表格台账 record_id=`AQWFiM`
- 本地台账：法律助手小程序 `docs/product-feedback.md`
- 当前状态：已验证（管理端定向、全量质量和真实浏览器闭环通过）

## 当前状态

- 新增 `/private-lending-result-template` 菜单和路由。
- 新增 `src/api/privateLendingResultTemplate.ts`，只通过 `miniapp-backend` 受控 API 读写和预览模板。
- 新增 `PrivateLendingResultTemplatePage`，维护结构化字段并展示后端 `docPackage` 预览。
- 页面不渲染后端 HTML/WXML/CSS/JS，只把后端纯文本预览为普通文本。

## 已完成

- TDD RED：API、页面和路由测试先失败于模块缺失。
- TDD GREEN：补齐 API 封装、页面、菜单和路由。
- 定向验证通过：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts`，3 个测试文件、18 个 Vitest 测试通过。

## 未完成

- 与后端、小程序产品台账一起提交整理。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts` 失败于 `privateLendingResultTemplate` API 文件、页面组件和路由缺失。
- GREEN：同一命令通过，3 个测试文件、18 个 Vitest 测试通过。
- 全量：`npm.cmd run quality` 通过，26 个测试文件、106 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 真实浏览器：`admin/123456` 登录后可见“结果模板配置”；页面加载后端模板，点击“预览结果”展示后端 `docPackage` 样例正文、证据清单、立案提示和风险提示。

## 下一步

1. 提交并保留 `Refs: LMA-FB-016`。
