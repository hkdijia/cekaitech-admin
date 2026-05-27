# Current Task

## 当前任务

- 名称：LMA-FB-013 首页菜单与 Banner 公告后台动态配置管理页
- OpenSpec 变更：无；执行计划见 `..\..\miniapp\lawsuit-material-assistant\docs\superpowers\plans\2026-05-27-dynamic-home-configuration.md`
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录
- 当前状态：实施中；管理端页面全量质量验证已通过，待提交推送和企业微信智能表格回写

## 当前状态

- 已新增 `miniappHomeConfig` API 封装，覆盖模块、功能入口、Banner 的分页、保存和禁用接口。
- 已新增 `/miniapp-home-config` 管理页，按模块配置、功能入口、Banner 公告三块维护首页配置。
- 已新增菜单和路由权限 `admin:miniapp-home-config:view`，写操作按钮按 `admin:miniapp-home-config:manage` 显示。
- 当前页面只通过 `miniapp-backend` 后台 CRUD API 修改业务数据，不直连数据库。

## 已完成

- TDD RED：新增 API、页面、路由测试后，因 API 模块和页面缺失、路由菜单未声明失败。
- TDD GREEN：补齐 `src/api/miniappHomeConfig.ts`、`src/pages/miniapp-home-config/MiniappHomeConfigPage.vue`、路由和菜单声明。
- 新增 `src/api/miniappHomeConfig.test.ts`，覆盖模块、功能入口、Banner 的分页、保存和禁用路径。
- 新增 `src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts`，覆盖初始化加载、模块保存刷新和无管理权限隐藏写操作。
- 扩展 `src/router/router.test.ts`，覆盖 `/miniapp-home-config` 菜单和路由权限声明。
- 已同步 `docs/变更日志.md` 和 `codex-handoff.md`。

## 未完成

- 提交并推送管理端改动。
- 回写企业微信智能表格 `XRhKT7`。
- 用真实后端账号联调页面新增/编辑/禁用操作。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts`：失败于 `miniappHomeConfig` API 模块缺失、页面组件缺失、`/miniapp-home-config` 菜单路由未声明。
- GREEN：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts`：3 个测试文件、17 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：21 个测试文件、91 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 下一步

1. 提交并推送管理端改动。
2. 回写企业微信智能表格 `XRhKT7`。
3. 用真实后端账号联调页面新增/编辑/禁用操作。
