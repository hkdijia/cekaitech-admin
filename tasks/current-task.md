# Current Task

## 当前任务

- 名称：LMA-FB-013 首页菜单与 Banner 公告后台动态配置管理页
- OpenSpec 变更：无；执行计划见 `..\..\miniapp\lawsuit-material-assistant\docs\superpowers\plans\2026-05-27-dynamic-home-configuration.md`
- 当前 HEAD：以 Git log 为准

## 追溯信息

- 反馈编号：`LMA-FB-013`
- 来源文档：企业微信需求整理文档 / LMA 智能表格台账
- 本地台账：法律助手小程序 `docs/product-feedback.md` 与企业微信智能表格记录
- 当前状态：已提交已推送，企业微信智能表格已回写；真实后端账号联调和小程序真实接口复验均已通过，待发布前真机抽检

## 当前状态

- 已新增 `miniappHomeConfig` API 封装，覆盖模块、功能入口、Banner 的分页、保存和禁用接口。
- 已新增 `/miniapp-home-config` 管理页，按模块配置、功能入口、Banner 公告三块维护首页配置。
- 已新增菜单和路由权限 `admin:miniapp-home-config:view`，写操作按钮按 `admin:miniapp-home-config:manage` 显示。
- 当前页面只通过 `miniapp-backend` 后台 CRUD API 修改业务数据，不直连数据库。
- 已用真实后端账号 `admin/123456` 和本地 `miniapp-backend p15,local` 完成浏览器联调，模块、功能入口和 Banner 的新增、编辑、禁用链路均通过。

## 已完成

- TDD RED：新增 API、页面、路由测试后，因 API 模块和页面缺失、路由菜单未声明失败。
- TDD GREEN：补齐 `src/api/miniappHomeConfig.ts`、`src/pages/miniapp-home-config/MiniappHomeConfigPage.vue`、路由和菜单声明。
- 新增 `src/api/miniappHomeConfig.test.ts`，覆盖模块、功能入口、Banner 的分页、保存和禁用路径。
- 新增 `src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts`，覆盖初始化加载、模块保存刷新和无管理权限隐藏写操作。
- 扩展 `src/router/router.test.ts`，覆盖 `/miniapp-home-config` 菜单和路由权限声明。
- 真实联调时发现 8080 旧后端进程未带新增默认权限，重启后 `admin` 权限恢复，菜单展示“首页配置”。
- 页面真实联调产生的 `codex_test_*` 测试模块、入口、Banner 均已软禁用；公开首页配置接口不返回这些禁用记录。
- 已同步 `docs/变更日志.md` 和 `codex-handoff.md`。

## 未完成

- 发布前用实体手机抽检首页配置读取、Banner 点击和公告详情。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts`：失败于 `miniappHomeConfig` API 模块缺失、页面组件缺失、`/miniapp-home-config` 菜单路由未声明。
- GREEN：`npm.cmd run test -- --run src/api/miniappHomeConfig.test.ts src/pages/miniapp-home-config/MiniappHomeConfigPage.test.ts src/router/router.test.ts`：3 个测试文件、17 个 Vitest 测试通过。
- 全量质量：`npm.cmd run quality`：21 个测试文件、91 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过；构建保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- `git push origin master`：已将 `fcd220c feat: add miniapp home config admin page` 推送到 `origin/master`。
- 企业微信智能表格 `LMA-FB-013` / `XRhKT7`：已回写管理端提交记录、验证证据、状态、下一步和备注。
- 真实浏览器联调：`admin/123456` 重新登录后可见“首页配置”；在 `/miniapp-home-config` 完成模块、功能入口、Banner 的新增、编辑、禁用。
- 后端接口复核：`GET /api/miniapps/lawsuit-material-assistant/home-config` 不包含已禁用的 `codex_test_*` 联调记录。
- 小程序真实接口自动化复验：清空缓存并指向本地后端后，首页加载远程 `launch_notice` Banner 和模块，点击 Banner 进入公告详情，且不包含已禁用 `codex_test_*` 记录。

## 下一步

1. 发布前用实体手机抽检首页配置读取、Banner 点击和公告详情。
2. 确认无误后关闭 `LMA-FB-013`。
