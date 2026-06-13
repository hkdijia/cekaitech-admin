# Current Task

## 当前任务

- 名称：页面菜单管理支持通用功能入口
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 多小程序 `app-tab-module-feature` 数据模型讨论
- 本地台账：无
- 当前状态：已发布生产测试环境并通过 smoke，待用户推送部署记录提交

## 当前状态

- “小程序编排 / 页面菜单管理”可识别 backend 返回的 `miniapp_module` 和 `miniapp_feature`。
- `miniapp_feature` 节点可编辑和保存，用于“我的”页服务请求等通用功能入口。
- admin 仍通过 backend 编排接口读写，不直连数据库。
- 本轮静态资源已发布到 `admin.cekaitech.cn`。

## 已完成

- [反馈编号：无] `MiniappOrchestrationPage.vue` 增加 `miniapp_module`、`miniapp_feature` 节点展示和编辑支持。
- [反馈编号：无] `miniapp_feature` 保存复用既有页面菜单管理权限。
- [反馈编号：无] 页面测试覆盖编辑“服务请求”通用功能入口并保存 `sourceType=miniapp_feature`。
- [反馈编号：无] 已通过 `scripts\deploy-admin-static.ps1` 发布到生产测试环境，保留上一版 `.previous` 供回滚。

## 最近验证

- `npm.cmd test -- MiniappOrchestrationPage.test.ts miniappOrchestration.test.ts` 通过 13 项。
- `npm.cmd run build` 通过；仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。
- `scripts\deploy-admin-static.ps1` 发布通过，上线资源包含 `MiniappOrchestrationPage-D-fbfYLo.js`。
- 公网校验：Basic Auth 返回 401，未登录后台编排接口返回 401，远端静态资源包含 `miniapp_feature` / “通用功能入口”。

## 未完成

- 尚未推送本次部署记录提交。

## 下一步

1. 用户推送本次部署记录提交。
2. 线上验收：进入“小程序编排 / 页面菜单管理”，确认“我的”页服务请求等通用功能入口可见且可编辑。
