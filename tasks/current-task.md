# Current Task

## 当前任务

- 名称：管理后台路由/菜单/按钮权限控制
- OpenSpec 变更：无

## 当前状态

- 已完成；本轮平台基线校验同步到 HEAD `cf22873`。

## 已完成

- `auth` store 新增 `hasPermission(permissionCode)`。
- 全局侧边栏菜单新增 `permissionCode`，并按当前管理员权限过滤。
- 路由新增 `meta.permissionCode`，已登录但无权限时跳转 `/dashboard`。
- 工作区菜单按后端返回的 `permissionCode` 过滤。
- 用户管理页按权限控制“生成演示数据”和“状态调整”按钮。
- 限制与黑名单页按权限控制“新增限制”和“取消”按钮。
- 扩展 auth、router、workspace 测试，覆盖权限判断和过滤逻辑。
- 更新 `docs/变更日志.md` 和 checkpoint 文档。

## 未完成

- 暂未提供后台权限配置页面。
- 暂未做无权限专用 403 页面，第一阶段重定向到 `/dashboard`。
- 工作区菜单服务端过滤可在后续与后端权限模型继续收敛。

## 最近验证

- `npm.cmd run test -- --run src/stores/auth.test.ts src/router/router.test.ts src/stores/workspace.test.ts`：11 个测试通过。
- `npm.cmd run quality`：21 个 Vitest 测试通过，TypeScript 与 Vite 构建通过。
- `npm.cmd run quality`：通过，8 个测试文件、21 个 Vitest 测试通过，`vue-tsc --noEmit && vite build` 通过，完成时间 2026-05-23 09:31 +08:00；构建保留 Vite chunk size warning。

## 下一步

1. 后续可补权限配置页、403 页面和服务端菜单过滤。
2. 继续规划数据导入真实流程。
