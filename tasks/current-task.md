# Current Task

## 当前任务

- 名称：LMA-FB-013 首页配置图标库选择器
- OpenSpec 变更：无；延续首页配置后台化能力，小步补强功能入口图标选择体验。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录 `XRhKT7`
- 当前状态：已验证（后台图标库选择器已完成定向测试、全量质量验证和 diff 检查，待提交）

## 当前状态

- 首页配置页功能入口编辑弹窗将原始 `图标 Key` 输入升级为受控开源图标库选择器。
- 选择器使用项目已依赖的 `@element-plus/icons-vue` 开源图标组件做真实预览，不新增依赖。
- 后台仍只保存 `iconKey` 与既有 `iconUrl` 字段，不改变后端接口结构，不直连数据库。
- 当前图标库先覆盖法律助手常见入口：计算、费用规则、流程清单、机构、援助、文书、复核、材料、查询、咨询、公告、管理、更多。
- 后续可把同一图标选项抽成共享 catalog，扩展到文书目录配置页和其他小程序配置页。

## 已完成

- TDD RED：新增首页配置页测试断言“开源图标库”、候选图标文案、真实图标预览节点和选择后回显，初始失败于预览节点缺失。
- TDD GREEN：`MiniappHomeConfigPage.vue` 新增受控图标选项、真实图标组件映射和 `selectMenuIcon` 选择逻辑。
- 功能入口编辑弹窗保留 `图标地址` 输入，兼容既有字段；常规场景通过图标库选择 `iconKey`。

## 未完成

- 提交。
- 下一轮评估是否抽出共享 icon catalog，复用到文书目录配置页。

## 最近验证

- RED：`npm.cmd run test -- --run src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts` 失败于 `[data-test="home-icon-calculator"]` 真实图标预览节点缺失。
- GREEN：`npm.cmd run test -- --run src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts` 通过，1 个测试文件、4 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，23 个测试文件、98 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- Diff 检查：`git diff --check` 仅提示 Windows 换行转换。

## 下一步

1. 提交信息保留 `Refs: LMA-FB-013`。
2. 下一轮评估共享 icon catalog，并同步到文书目录配置页。
