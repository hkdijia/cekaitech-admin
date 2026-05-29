# Current Task

## 当前任务

- 名称：LMA-FB-014 起诉文书生成目录动态配置管理页
- OpenSpec 变更：无；执行计划见 `..\..\miniapp\lawsuit-material-assistant\docs\superpowers\plans\2026-05-28-document-catalog-remote-config.md`
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-014`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录 `OfxNNC`
- 当前状态：已验证（后台配置页自动化验证、真实浏览器验证、同局域网实体手机目录抽检和企业微信阶段回写均已完成；待提交收口）

## 当前状态

- 已新增 `miniappDocumentCatalog` API 封装，覆盖文书目录项分页、保存和禁用接口。
- 已新增 `/miniapp-document-catalog` 管理页，维护 `appCode/caseType/title/description/targetPath/action/status/statusText/iconKey/sortOrder/enabled`。
- 已新增菜单和路由权限 `admin:miniapp-document-catalog:view`，写操作按钮按 `admin:miniapp-document-catalog:manage` 显示。
- 当前页面只通过 `miniapp-backend` 后台 CRUD API 修改业务数据，不直连数据库。
- 后端仍负责 `targetPath/action/status` 等白名单和最终 403；前端只负责表单约束、权限按钮显隐和接口调用。
- 后端禁用接口已收紧为 `itemId + appCode` 作用域，前端禁用请求随当前 `APP_CODE` 一起提交。
- 已用真实浏览器登录 `admin/123456` 复核 `/miniapp-document-catalog`，新增 `codex_check_20260528` 测试目录后已软禁用。
- 同局域网实体手机已确认法律助手小程序起诉文书生成页读取到后台配置结果：1 个开放入口“民间借贷纠纷”和 2 个“暂不可生成”入口。
- 企业微信智能表格 record_id=`OfxNNC` 已回写为“已验证（同局域网真机抽检通过）”。

## 已完成

- TDD RED：新增 API、页面、路由测试后，因 API 模块和页面缺失、路由菜单未声明失败。
- TDD GREEN：补齐 `src/api/miniappDocumentCatalog.ts`、`src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.vue`、路由和菜单声明。
- 新增 `src/api/miniappDocumentCatalog.test.ts`，覆盖文书目录分页、保存和禁用路径。
- 新增 `src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts`，覆盖初始化加载、保存刷新和无管理权限隐藏写操作。
- 文书目录禁用调用已补充 `appCode` 作用域，页面测试覆盖禁用后按当前小程序刷新列表。
- 扩展 `src/router/router.test.ts`，覆盖 `/miniapp-document-catalog` 菜单和路由权限声明。
- 扩展 `npm.cmd run admin:check` 诊断脚本和测试，纳入文书目录配置路由、API 和页面模块检查。
- 真实浏览器验证：页面可见三条正式目录，新增测试目录、保存、禁用链路通过；公开目录接口不返回禁用测试目录。

## 未完成

- 整理提交前验证和多仓提交。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/miniappDocumentCatalog.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts src/router/router.test.ts`：失败于 `miniappDocumentCatalog` API 模块缺失、页面组件缺失、`/miniapp-document-catalog` 菜单路由未声明。
- GREEN：`npm.cmd run test -- --run src/api/miniappDocumentCatalog.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts src/router/router.test.ts`：3 个测试文件、16 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：23 个测试文件、96 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- 联调准备：`npm.cmd run admin:check` 通过，PASS 14 / WARN 0 / FAIL 0。
- 真实页面：`admin/123456` 登录后访问 `/miniapp-document-catalog`，表格加载正式目录；新增并软禁用 `codex_check_20260528` 测试目录成功。
- 2026-05-29 收口验证：`npm.cmd run quality` 通过，23 个测试文件、96 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；`git diff --check` 仅提示 Windows 换行转换。
- 2026-05-29 作用域补强：`npm.cmd run test -- --run src/api/miniappDocumentCatalog.test.ts src/pages/miniapp-document-catalog/MiniappDocumentCatalogPage.test.ts` 通过，2 个测试文件、5 个 Vitest 测试通过。
- 2026-05-29 最终质量复验：`npm.cmd run quality` 通过，23 个测试文件、97 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 下一步

1. 跑提交前验证并整理提交。
2. 提交信息保留 `Refs: LMA-FB-014`。
