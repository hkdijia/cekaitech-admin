# Current Task

## 当前任务

- 名称：起诉文书生成多结果模板配置首片
- OpenSpec 变更：无。

## 追溯信息

- 反馈编号：`无`
- 来源文档：当前会话 / 起诉文书生成模块多模板配置讨论
- 本地台账：无
- 当前状态：已完成本地实现、推送、生产测试环境静态发布和 smoke。

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
- 本轮已发布 admin 静态资源到服务器。

## 最近验证

- RED：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts` 失败于 `getCaseResultTemplateOptions is not a function`、案件选择方法缺失和标题仍为民间借贷。
- RED：`npm.cmd run test -- --run src/router/router.test.ts` 失败于菜单描述仍为“民间借贷结果模板和预览”。
- GREEN：`npm.cmd run test -- --run src/api/privateLendingResultTemplate.test.ts src/pages/private-lending-result-template/PrivateLendingResultTemplatePage.test.ts src/router/router.test.ts` 通过 3 个测试文件、26 项。
- 通过：`npm.cmd run quality`，35 个测试文件、169 项通过，并完成生产构建。
- 发布：`powershell -ExecutionPolicy Bypass -File scripts\deploy-admin-static.ps1` 成功同步到 `/data/cekaitech-admin/`，上线资源包含 `PrivateLendingResultTemplatePage-CKOHrQyy.js`。
- 生产验证：服务器静态资源包含 `/api/admin/case-result-template` 和“结果模板配置”文案；公网 smoke 通过。

## 下一步

1. 线上人工验收 `admin.cekaitech.cn` 的“结果模板配置”：民间借贷可编辑，离婚/劳动显示“暂无生成配置”。
2. 后续配合 backend 继续推进 `divorce/labor` 真实生成配置。
