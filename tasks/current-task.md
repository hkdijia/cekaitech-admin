# Current Task

## 当前任务

- 名称：起诉文书生成多结果模板配置首片
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 起诉文书生成模块多模板配置讨论
- 本地台账：无
- 当前状态：已完成本地实现与定向验证，待全量验证和本地提交后由用户推送。

## 当前状态

- 结果模板配置页从固定民间借贷页面改为按案件类型选择。
- 页面从 backend 通用 options 接口读取 `private_lending/divorce/labor` 的生成配置状态。
- 当前仅 `private_lending` 显示编辑器、保存和预览；`divorce/labor` 显示“暂无生成配置”，不展示模板编辑器。
- 管理端 API 封装已切换到 `/api/admin/case-result-template` 通用接口。

## 已完成

- [反馈编号：无] `privateLendingResultTemplate` API 新增 options 查询，并将 get/save/preview 切到通用 endpoint。
- [反馈编号：无] `PrivateLendingResultTemplatePage` 增加案件类型列表、不可编辑提示和按选中 `caseType` 加载模板。
- [反馈编号：无] 后台菜单描述改为“起诉文书生成结果模板和预览”。
- [反馈编号：无] 补充 API、页面和路由测试。

## 未完成

- 页面目录项仍沿用旧路由 `/private-lending-result-template` 和旧权限码，作为兼容过渡；后续可单独改为更通用的路由和权限。
- 尚未为 `divorce/labor` 提供真实模板编辑能力，因为 backend 尚无 schema 和生成服务。
- 本轮未发布 admin 静态资源到服务器。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 失败于 `getCaseResultTemplateOptions is not a function`、案件选择方法缺失和标题仍为民间借贷。
- RED：`npm.cmd run test -- --run src/router/router.test.ts` 失败于菜单描述仍为“民间借贷结果模板和预览”。
- GREEN：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts` 通过 3 个测试文件、26 项。

## 下一步

1. 跑 admin `npm.cmd run quality` 和空白检查。
2. 本地提交 admin 变更，由用户推送远程。
3. 后续配合 backend 继续推进 `divorce/labor` 真实生成配置。
