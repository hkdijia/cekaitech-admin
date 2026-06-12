# Current Task

## 当前任务

- 名称：离婚纠纷结果模板配置首片
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 起诉文书生成模块离婚纠纷首片讨论
- 本地台账：无
- 当前状态：已完成本地实现和 quality 验证，待本地提交。

## 当前状态

- 结果模板配置页按 backend 通用 options 接口读取 `private_lending/divorce/labor` 的生成配置状态。
- `private_lending` 和 `divorce` 可在 backend 支持时显示编辑器、保存和预览。
- 页面切换到 `divorce` 时使用离婚样例数据预览，不再提交民间借贷样例字段。
- `labor` 仍显示“暂无生成配置”，不展示模板编辑器。

## 已完成

- [反馈编号：无] `PrivateLendingResultTemplatePage` 增加按案由分发样例数据，当前覆盖 `private_lending` 和 `divorce`。
- [反馈编号：无] 页面测试覆盖切换 `divorce` 后加载离婚模板并以 `plaintiffName/defendantName/marriageDate` 预览。
- [反馈编号：无] API 测试更新离婚 options 为 `templateSupported=true`。

## 未完成

- 页面目录项仍沿用旧路由 `/private-lending-result-template` 和旧权限码，作为兼容过渡；后续可单独改为更通用的路由和权限。
- `labor` 尚未提供真实模板编辑能力，因为 backend 尚无 schema 和生成服务。
- 本轮尚未发布 admin 静态资源到服务器。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 失败于切换 `divorce` 后仍提交民间借贷样例字段。
- GREEN：同命令通过 2 个测试文件、6 项。
- 收口：`npm.cmd run quality` 通过 35 个测试文件、169 项并完成生产构建；`git diff --check` 通过，仅有 Windows 换行提示。

## 下一步

1. 本地提交后等待用户推送。
2. 后续配合 backend 继续推进 `labor` 真实生成配置，或部署本轮 admin 静态资源后验收离婚模板预览。
