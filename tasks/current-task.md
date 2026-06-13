# Current Task

## 当前任务

- 名称：页面菜单管理支持通用功能入口
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 多小程序 `app-tab-module-feature` 数据模型讨论
- 本地台账：无
- 当前状态：已完成本地实现、定向测试和构建，待最终空白检查、本地提交和后续发布

## 当前状态

- “小程序编排 / 页面菜单管理”可识别 backend 返回的 `miniapp_module` 和 `miniapp_feature`。
- `miniapp_feature` 节点可编辑和保存，用于“我的”页服务请求等通用功能入口。
- admin 仍通过 backend 编排接口读写，不直连数据库。

## 已完成

- [反馈编号：无] `MiniappOrchestrationPage.vue` 增加 `miniapp_module`、`miniapp_feature` 节点展示和编辑支持。
- [反馈编号：无] `miniapp_feature` 保存复用既有页面菜单管理权限。
- [反馈编号：无] 页面测试覆盖编辑“服务请求”通用功能入口并保存 `sourceType=miniapp_feature`。

## 最近验证

- `npm.cmd test -- MiniappOrchestrationPage.test.ts miniappOrchestration.test.ts` 通过 13 项。
- `npm.cmd run build` 通过；仅保留既有 Rollup PURE 注释 warning 和 chunk size warning。

## 未完成

- 尚未执行 `git diff --check`。
- 尚未本地提交。
- 尚未发布到 `admin.cekaitech.cn`。

## 下一步

1. 跑空白检查。
2. 本地提交，由用户推送远程。
3. 后端 V142 部署后，发布 admin 静态资源并验收页面菜单管理可编辑“我的”页入口。
