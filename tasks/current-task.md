# Current Task

## 当前任务

- 名称：LMA-FB-013 小程序配置统一图标库能力
- OpenSpec 变更：无；延续首页配置后台化能力，将图标选择器抽象为 `cekaitech-admin` 统一管理能力。
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录 `XRhKT7`
- 当前状态：已验证（共享 icon catalog 与选择器已完成定向测试、全量质量验证和 diff 检查，待提交）

## 当前状态

- 新增共享图标目录 `src/miniapp-icons/miniappIconCatalog.ts`，统一维护小程序配置页使用的开源图标候选。
- 新增共享组件 `src/components/miniapp-icon-picker/MiniappIconPicker.vue`，负责真实图标预览、当前 key 回显和选择交互。
- 首页配置页已从局部 `iconOptions` 切换为共享组件。
- 文书目录配置页已从自由输入 `图标 Key` 切换为共享组件。
- 后台仍只保存既有 `iconKey` 字符串，不改变后端接口结构，不直连数据库。
- 图标预览使用项目既有 `@element-plus/icons-vue` 开源图标组件，不新增依赖。

## 已完成

- TDD RED：新增共享 catalog 测试和文书目录页共享图标选择器测试，初始失败于 `miniappIconCatalog` 模块缺失、文书目录页仍显示自由输入。
- TDD GREEN：补齐共享 catalog、共享 picker、首页配置页复用和文书目录页复用。
- 更新首页配置页测试，从调用页面内部方法改为点击共享选择器。

## 未完成

- 提交信息保留 `Refs: LMA-FB-013`。

## 最近验证

- RED：`npm.cmd run test -- --run src/miniapp-icons/miniappIconCatalog.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts` 失败于共享 catalog 文件缺失、文书目录页缺少“统一开源图标库”。
- GREEN：`npm.cmd run test -- --run src/miniapp-icons/miniappIconCatalog.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts` 通过，3 个测试文件、10 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality` 通过，24 个测试文件、100 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- Diff 检查：`git diff --check` 仅提示 Windows 换行转换。

## 下一步

1. 提交并保留 `Refs: LMA-FB-013`。
2. 后续其他小程序配置页直接复用 `MiniappIconPicker`。
